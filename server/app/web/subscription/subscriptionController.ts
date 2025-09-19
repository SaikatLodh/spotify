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

class SubscriptionController {
  async createSubscription(req: Request, res: Response) {
    try {
      const { plan, price, duration } = req.body;
      const userId = req.user._id;

      const { error } = createSubscriptionSchema.validate(req.body);

      if (error) {
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
        return res.redirect(`${process.env.CLIENT_URL}/payment-failure`);
      }

      const subscription = await Subscription.create({
        userId,
        plan,
        price,
        duration,
      });

      if (!subscription) {
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
      const userId = req.user._id;

      const { error } = verifySubscriptionSchema.validate(req.body);

      if (error) {
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
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Subscription not found", STATUS_CODES.NOT_FOUND));
      }

      if (razorpay_signature !== expectedSignature) {
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

      return res.redirect(`${process.env.CLIENT_URL}/payment-success`);
    } catch (error) {
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

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      (user.subscriptionStatus = "Free"), (user.subscribed = false);
      user.save({ validateBeforeSave: false });

      await Subscription.updateMany({ userId }, { status: "expired" });

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Subscription expired"));
    } catch (error) {
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
