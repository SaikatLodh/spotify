import User from "../../models/userModel";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { Request, Response } from "express";
import { RequestWithFile } from "../../interface/requestWithFile";
import { uploadFile, deleteImage } from "../../helpers/cloudinary";
import {
  updatePasswordSchema,
  updateUserSchema,
} from "../../helpers/validator/user/userValidator";
import { unlinkSync } from "fs";
import logger from "../../helpers/logger";

class UserController {
  async getProfile(req: RequestWithFile, res: Response) {
    try {
      const userId = req.user._id;
      logger.info(`Fetching profile for user: userId=${userId}`);

      const user = await User.findOne({ _id: userId, isDeleted: false })
        .populate({
          path: "subscription",
          select:
            "-__v -createdAt -updatedAt -updatedAt -userId -razorpaySignature -razorpayOrderId -razorpayPaymentId",
        })
        .select(
          "-password -isDeleted -__v -createdAt -updatedAt -forgotPasswordToken -forgotPasswordExpiry -fbId"
        );

      if (!user) {
        logger.warn(`User not found for profile fetch: userId=${userId}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      logger.info(`Profile fetched successfully for user: userId=${userId}`);
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, user, "User fetched"));
    } catch (error) {
      logger.error(`Error fetching profile: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async updateProfile(req: RequestWithFile, res: Response) {
    try {
      const userId = req.user._id;
      const { fullName } = req.body;
      const file = req?.file?.path;
      logger.info(`Updating profile for user: userId=${userId}, fullName=${fullName}, hasFile=${!!file}`);

      const { error } = updateUserSchema.validate(req.body);

      if (error) {
        if (file) unlinkSync(file!);
        logger.warn(`Validation error for profile update: ${error.details[0].message}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const user = await User.findOne({ _id: userId, isDeleted: false });

      if (!user) {
        logger.warn(`User not found for profile update: userId=${userId}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      if (file) {
        if (user?.profilePicture?.public_id) {
          const deleteimage = await deleteImage(
            user?.profilePicture?.public_id!
          );

          if (!deleteimage) {
            if (file) unlinkSync(file!);
            logger.error("Failed to delete old profile image");
            return res
              .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
              .json(
                new ApiError(
                  "Image upload failed",
                  STATUS_CODES.INTERNAL_SERVER_ERROR
                )
              );
          }
        }

        const result = await uploadFile(file);

        const updateUser = await User.findByIdAndUpdate(
          userId,
          {
            fullName: fullName || user?.fullName,
            profilePicture: {
              public_id: result?.publicId || user?.profilePicture?.public_id,
              url: result?.url || user?.profilePicture?.url,
            },
          },
          { new: true }
        );

        if (!updateUser) {
          logger.error("Failed to update user profile with image");
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to update user",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
      } else {
        const updateUser = await User.findByIdAndUpdate(
          userId,
          {
            fullName: fullName || user?.fullName,
          },
          { new: true }
        );

        if (!updateUser) {
          logger.error("Failed to update user profile without image");
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to update user",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
      }

      logger.info(`Profile updated successfully for user: userId=${userId}`);
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Profile updated"));
    } catch (error) {
      logger.error(`Error updating profile: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async updatePassword(req: RequestWithFile, res: Response) {
    try {
      const userId = req.user._id;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      logger.info(`Updating password for user: userId=${userId}`);

      const { error } = updatePasswordSchema.validate(req.body);

      if (error) {
        logger.warn(`Validation error for password update: ${error.details[0].message}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      if (newPassword !== confirmPassword) {
        logger.warn("Password confirmation mismatch for user: userId=${userId}");
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(
              "Password and confirm password is not same",
              STATUS_CODES.BAD_REQUEST
            )
          );
      }

      const finduser: any = await User.findById(userId);

      const comparePassword = await finduser.comparePassword(oldPassword);

      if (!comparePassword) {
        logger.warn(`Incorrect old password for user: userId=${userId}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Old password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      finduser.password = confirmPassword;
      await finduser.save({ validateBeforeSave: false });

      logger.info(`Password updated successfully for user: userId=${userId}`);
      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "Password changed successfully")
        );
    } catch (error) {
      logger.error(`Error updating password: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async deleteAccount(req: RequestWithFile, res: Response) {
    try {
      const userId = req.user._id;
      logger.info(`Deleting account for user: userId=${userId}`);

      const user = await User.findById(userId);
      if (!user) {
        logger.warn(`User not found for account deletion: userId=${userId}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }
      user.isDeleted = true;
      await user.save({ validateBeforeSave: false });

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
      };
      logger.info(`Account deleted successfully for user: userId=${userId}`);
      return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "User deleted successfully")
        );
    } catch (error) {
      logger.error(`Error deleting account: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}

export default new UserController();
