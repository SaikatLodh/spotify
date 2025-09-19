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

class UserController {
  async getProfile(req: RequestWithFile, res: Response) {
    try {
      const userId = req.user._id;

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
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, user, "User fetched"));
    } catch (error) {
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

      const { error } = updateUserSchema.validate(req.body);

      if (error) {
        if (file) unlinkSync(file!);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const user = await User.findOne({ _id: userId, isDeleted: false });

      if (!user) {
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

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Profile updated"));
    } catch (error) {
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

      const { error } = updatePasswordSchema.validate(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      if (newPassword !== confirmPassword) {
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
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Old password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      finduser.password = confirmPassword;
      await finduser.save({ validateBeforeSave: false });

      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "Password changed successfully")
        );
    } catch (error) {
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
      const user = await User.findById(userId);
      if (!user) {
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
      return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "User deleted successfully")
        );
    } catch (error) {
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
