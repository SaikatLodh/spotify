import User from "../../models/userModel";
import Album from "../../models/albumModel";
import Song from "../../models/songModel";
import PaymentPlans from "../../models/PaymentPlaneModel";
import Subscription from "../../models/subscriptionModel";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { Request, Response } from "express";
import sendEmail from "../../helpers/sendEmail";
import {
  createArtistschema,
  createPlansSchema,
} from "../../helpers/validator/admin/adminValidation";
import { RequestWithFile } from "../../interface/requestWithFile";
import { updateUserSchema } from "../../helpers/validator/user/userValidator";
import { deleteImage, uploadFile } from "../../helpers/cloudinary";
import fs from "fs";

class DashboardController {
  async renderDashboard(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        totalAlbums,
        totalSongs,
        totalArtists,
        totalListners,
        totalEarningsByMonth,
      ] = await Promise.all([
        User.countDocuments({ isDeleted: false, role: { $ne: "admin" } }),
        Album.countDocuments({ isDeleted: false }),
        Song.countDocuments({ isDeleted: false }),
        User.countDocuments({ role: "artist", isDeleted: false }),
        User.countDocuments({ role: "listner", isDeleted: false }),
        Subscription.aggregate([
          { $match: { status: "success" } },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              totalEarnings: { $sum: "$price" },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]),
      ]);

      if (
        !totalUsers ||
        !totalAlbums ||
        !totalSongs ||
        !totalArtists ||
        !totalListners ||
        !totalEarningsByMonth
      ) {
        req.flash("error", "Something went wrong");
        return res.redirect("/");
      }

      return res.render("dashboard", {
        title: "Dashboard",
        totalUsers,
        totalAlbums,
        totalSongs,
        totalArtists,
        totalListners,
        totalEarningsByMonth,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash(
        "error",
        error instanceof Error ? error.message : String(error)
      );
      return res.redirect("/");
    }
  }

  async renderArtist(req: Request, res: Response) {
    try {
      return res.render("create-artist", {
        title: "Create Artist",
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/createartist");
    }
  }

  async createArtist(req: Request, res: Response) {
    try {
      const { fullName, email, password } = req.body;

      const { error } = createArtistschema.validate(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Email already exists", STATUS_CODES.BAD_REQUEST));
      }

      const createUser = await User.create({
        fullName: fullName,
        email: email,
        password: password,
        role: "artist",
        isVerified: true,
      });

      if (!createUser) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("Faild to create user", STATUS_CODES.BAD_REQUEST));
      }
      const frontendUrl = process.env.SEND_EMAIL_ARTIST;
      const options = {
        email: email,
        subject:
          "Your account is created successfully! Please verify your email address to login.",
        message: `
          <!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333">
    <div
      style="
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
      "
    >
      <h2 style="color: #4caf50">Welcome to SPOTIFY🎉</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>
        Your account has been successfully created. Below are your login
        credentials:
      </p>

      <div
        style="
          background: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #ddd;
        "
      >
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p style="color: #d9534f; font-size: 14px">
        <strong>Important:</strong> Please change your password after your first
        login to keep your account secure.
      </p>

      <p>
        You can log in here:<a href="${frontendUrl}" style="color: #4caf50">${frontendUrl}</a>
      </p>

      <p>
        Thank you,<br />
        <strong>Spotify Team</strong>
      </p>
    </div>
  </body>
</html>
`,
      };

      try {
        await sendEmail(options);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Email sent"));
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

  async renderPlans(req: Request, res: Response) {
    try {
      return res.render("create-plans", {
        title: "Plans",
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/plans");
    }
  }

  async createPlans(req: Request, res: Response) {
    try {
      const { planName, price, duration, features } = req.body;

      const { error } = createPlansSchema.validate(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }
      const createPlan = await PaymentPlans.create({
        planName: planName,
        price: price,
        duration: duration,
        features: features,
      });
      if (!createPlan) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Failed to create plan", STATUS_CODES.BAD_REQUEST)
          );
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "Plan created successfully")
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

  async rendergetPlans(req: Request, res: Response) {
    try {
      res.render("get-plans", {
        title: "Plans",

        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/plans");
    }
  }

  async getPlans(req: Request, res: Response) {
    try {
      const plans = await PaymentPlans.find({ isDeleted: false }).sort({
        price: 1,
      });
      if (!plans) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to get plans",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, plans, "Plans fetched"));
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

  async renderUpdatePlans(req: Request, res: Response) {
    const slugId = req.params.slugId;
    try {
      const getPlan = await PaymentPlans.findOne({ slug: slugId });

      if (!getPlan) {
        req.flash("error", "Something went wrong");
      }
      return res.render("update-plans", {
        title: "Update Plans",
        getPlan,
        slugId,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect(`/updateplans/${slugId}`);
    }
  }

  async updatePlans(req: Request, res: Response) {
    try {
      const slugId = req.params.slugId;
      const { planName, price, duration, features } = req.body;

      const { error } = createPlansSchema.validate(req.body);

      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }
      const updatePlan = await PaymentPlans.findOneAndUpdate(
        { slug: slugId },
        {
          planName: planName,
          price: price,
          duration: duration,
          features: features,
        }
      );
      if (!updatePlan) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to update plan",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "Plan updated successfully")
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

  async deletePlans(req: Request, res: Response) {
    try {
      const slugId = req.params.slugId;

      const deletePlan = await PaymentPlans.findOneAndUpdate(
        {
          slug: slugId,
        },
        {
          isDeleted: true,
        }
      );

      if (!deletePlan) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to delete plan",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, {}, "Plan deleted successfully")
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

  async renderAlbum(req: Request, res: Response) {
    try {
      const getAurtists = await Album.aggregate([
        { $match: { isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "artistId",
            foreignField: "_id",
            as: "artist",
          },
        },
        { $unwind: "$artist" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _v: 0,
            "artist._v": 0,
            "artist.password": 0,
            "artist.isDeleted": 0,
            "artist.isVerified": 0,
            "artist.createdAt": 0,
            "artist.updatedAt": 0,
            "artist.forgotPasswordToken": 0,
            "artist.forgotPasswordExpiry": 0,
            "artist.fbId": 0,
          },
        },
      ]);

      if (!getAurtists) {
        req.flash("error", "Something went wrong");
      }

      req.flash("success", "Album created successfully");
      return res.render("album", {
        title: "Create Album",
        getAurtists,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/album");
    }
  }

  async renderSongs(req: Request, res: Response) {
    try {
      const getSongs = await Song.aggregate([
        { $match: { isDeleted: false } },
        {
          $lookup: {
            from: "albums",
            localField: "albumId",
            foreignField: "_id",
            as: "album",
          },
        },
        { $unwind: "$album" },
        {
          $lookup: {
            from: "users",
            localField: "artistId",
            foreignField: "_id",
            as: "artist",
          },
        },
        { $unwind: "$artist" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _v: 0,
            "artist._v": 0,
            "artist.password": 0,
            "artist.isDeleted": 0,
            "artist.isVerified": 0,
            "artist.createdAt": 0,
            "artist.updatedAt": 0,
            "artist.forgotPasswordToken": 0,
            "artist.forgotPasswordExpiry": 0,
            "artist.fbId": 0,
          },
        },
      ]);

      if (!getSongs) {
        req.flash("error", "Something went wrong");
      }

      return res.render("songs", {
        title: "Songs",
        getSongs,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/songs");
    }
  }

  async renserUsers(req: Request, res: Response) {
    try {
      const users = await User.find({ role: { $ne: "admin" } });
      if (!users) {
        req.flash("error", "Something went wrong");
      }
      return res.render("users", {
        title: "Users",

        users,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/users");
    }
  }

  async renderUpdateProfile(req: Request, res: Response) {
    try {
      return res.render("update-profile", {
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash(
        "error",
        error instanceof Error ? error.message : String(error)
      );
      return res.redirect("/profile");
    }
  }

  async getprofile(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const findUser = await User.findById(userId);

      if (!findUser) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
      }
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, findUser, "User found"));
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

  async updateProfile(req: RequestWithFile, res: Response) {
    try {
      const { fullName } = req.body;
      const file = req?.file?.path;
      const userId = req.user._id;

      const { error } = updateUserSchema.validate(req.body);

      if (error) {
        if (file) fs.unlinkSync(file);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const user = await User.findById(userId);

      if (file) {
        if (user?.profilePicture?.public_id) {
          const deleteimage =
            user &&
            user.profilePicture?.public_id &&
            (await deleteImage(user.profilePicture.public_id));

          if (!deleteimage) {
            fs.unlinkSync(file);
            return res
              .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
              .json(
                new ApiError(
                  "Failed to delete old profile picture",
                  STATUS_CODES.INTERNAL_SERVER_ERROR
                )
              );
          }
        }

        const uploadPicture = await uploadFile(file);

        if (!uploadPicture) {
          fs.unlinkSync(file);
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to upload new profile picture",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            fullName: fullName || user?.fullName,
            profilePicture: {
              public_id:
                uploadPicture?.publicId || user?.profilePicture?.public_id,
              url: uploadPicture?.url || user?.profilePicture?.url,
            },
          },
          {
            new: true,
          }
        );

        if (!updatedUser) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to update user",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "Profile updated successfully")
          );
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            fullName: fullName || user?.fullName,
          },
          {
            new: true,
          }
        );

        if (!updatedUser) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to update user",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "Profile updated successfully")
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            {},
            error instanceof Error ? error.message : String(error)
          )
        );
    }
  }

  async renderChangePassword(req: Request, res: Response) {
    try {
      return res.render("change-password", {
        title: "Change Password",
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      req.flash(
        "error",
        error instanceof Error ? error.message : String(error)
      );
      return res.redirect("/changepassword");
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(
              "New password and confirm password does not match",
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

      finduser.password = newPassword;
      await finduser.save({ validateBeforeSave: false });

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Password changed"));
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

  async logout(req: Request, res: Response) {
    try {
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
      };
      return res
        .status(STATUS_CODES.OK)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "User logout successfully"));
    } catch (error: any) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }
}

export default new DashboardController();
