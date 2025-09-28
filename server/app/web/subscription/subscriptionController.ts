import Subscription from "../../models/subscriptionModel";
import User from "../../models/userModel";
import { Request, Response } from "express";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import razorpay from "../../helpers/razorpay";
import crypto from "crypto";
import {
  createSubscriptionSchema,
  verifySubscriptionSchema,
} from "../../helpers/validator/subscription/subscriptionValidation";
import logger from "../../helpers/logger";

class SubscriptionController {
  async createSubscription(req: Request, res: Response) {
    try {
      const { plan, price, duration } = req.body;
      const userId = req.user._id;
      logger.info(`Creating subscription: userId=${userId}, plan=${plan}, price=${price}, duration=${duration}`);

      const { error } = createSubscriptionSchema.validate(req.body);

      if (error) {
        logger.warn(`Validation error for subscription creation: ${error.details[0].message}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const options = {
        amount: price * 100,
        currency: "INR",
      };

      if (!razorpay) {
        logger.error("Razorpay is not initialized");
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Razorpay is not initialized",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const createRazorpayorder = await razorpay.orders.create(options);

      if (!createRazorpayorder) {
        logger.error("Failed to create Razorpay order");
        return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
      }

      const subscription = await Subscription.create({
        userId,
        plan,
        price,
        duration,
      });

      if (!subscription) {
        logger.error("Failed to create subscription in database");
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to create subscription",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const razorpayOrderDetails = {
        ...createRazorpayorder,
        subscriptionId: subscription._id.toString(),
      };

      logger.info(`Subscription created successfully: subscriptionId=${subscription._id}`);
      return res
        .status(STATUS_CODES.CREATED)
        .json(
          new ApiResponse(
            STATUS_CODES.CREATED,
            { razorpayOrderDetails },
            "Order created"
          )
        );
    } catch (error) {
      logger.error(`Error creating subscription: ${error instanceof Error ? error.message : String(error)}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : String(error),
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async getKeys(req: Request, res: Response) {
    try {
      logger.info("Fetching Razorpay keys");
      logger.info("Razorpay keys fetched successfully");
      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(
            STATUS_CODES.OK,
            { key: process.env.RAZORPAY_KEY_ID },
            "Keys fetched"
          )
        );
    } catch (error) {
      logger.error(`Error fetching Razorpay keys: ${error instanceof Error ? error.message : String(error)}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : String(error),
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async verifySubscription(req: Request, res: Response) {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;
      const subscriptionId = req.params.subscriptionId;
      const userId = req.params.userId;
      logger.info(`Verifying subscription: subscriptionId=${subscriptionId}, userId=${userId}, paymentId=${razorpay_payment_id}`);

      const { error } = verifySubscriptionSchema.validate(req.body);

      if (error) {
        logger.warn(`Validation error for subscription verification: ${error.details[0].message}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      const subscription = await Subscription.findById(subscriptionId);

      if (!subscription) {
        logger.warn(`Subscription not found for verification: subscriptionId=${subscriptionId}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Subscription not found", STATUS_CODES.NOT_FOUND));
      }

      if (razorpay_signature !== expectedSignature) {
        logger.warn(`Payment signature verification failed: subscriptionId=${subscriptionId}`);
        subscription.status = "failed";
        await subscription.save({ validateBeforeSave: false });
        return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
      }

      subscription.status = "success";

      const durationMonths = parseInt(subscription.duration.split(" ")[0]) || 0;
      subscription.expitreDate = new Date();
      subscription.expitreDate.setMonth(
        subscription.expitreDate.getMonth() + durationMonths
      );

      subscription.razorpayPaymentId = razorpay_payment_id;
      subscription.razorpayOrderId = razorpay_order_id;
      subscription.razorpaySignature = razorpay_signature;

      await subscription.save({ validateBeforeSave: false });

      await User.findByIdAndUpdate(userId, {
        subscription: subscription._id,
        subscriptionStatus: subscription.plan,
        subscribed: true,
      });

      logger.info(`Subscription verified and activated successfully: subscriptionId=${subscriptionId}, userId=${userId}`);
      return res.redirect(`${process.env.CLIENT_URL}/payment-success`);
    } catch (error) {
      logger.error(`Error verifying subscription: ${error instanceof Error ? error.message : String(error)}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : String(error),
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async expireSubscription(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      logger.info(`Expiring subscription for user: userId=${userId}`);

      const user = await User.findById(userId);

      if (!user) {
        logger.warn(`User not found for subscription expiration: userId=${userId}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      (user.subscriptionStatus = "Free"), (user.subscribed = false);
      user.save({ validateBeforeSave: false });

      await Subscription.updateMany({ userId }, { status: "expired" });

      logger.info(`Subscription expired successfully for user: userId=${userId}`);
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Subscription expired"));
    } catch (error) {
      logger.error(`Error expiring subscription: ${error instanceof Error ? error.message : String(error)}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : String(error),
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}

export default new SubscriptionController();
