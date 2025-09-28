import User from "../../models/userModel";
import generateAccessAndRefreshToken from "../../config/generatedToken";
import { Request, Response } from "express";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import {
  forgotsendemailValidation,
  loginValidation,
} from "../../helpers/validator/auth/authValidation";
import sendEmail from "../../helpers/sendEmail";
import logger from "../../helpers/logger";

class AuthController {
  async renderLogin(req: Request, res: Response) {
    try {
      const rememberedEmail = req.cookies.email || "";
      const rememberedPassword = req.cookies.password || "";
      const remember = req.cookies.remember || false;

      return res.render("auth/login", {
        title: "Login",
        rememberedEmail,
        rememberedPassword,
        remember,
      });
    } catch (error) {
      req.flash(
        "error",
        error instanceof Error ? error.message : String(error)
      );
      return res.redirect("/login");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, remember } = req.body;

      logger.info(`Login attempt for email: ${email}`);

      if (remember) {
        JSON.parse(remember);
      }

      const { error } = loginValidation(req.body);

      if (error) {
        logger.warn(
          `Login validation failed for email: ${email}: ${error.details[0].message}`
        );
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkUser: any = await User.findOne({ email: email });

      if (!checkUser) {
        logger.warn(`Login failed: Email does not exist: ${email}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Email does not exist", STATUS_CODES.NOT_FOUND));
      }

      if (!checkUser.isVerified) {
        logger.warn(`Login failed: User not verified: ${email}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError("User is deleted", STATUS_CODES.BAD_REQUEST));
      }

      const comparePassword = await checkUser.comparePassword(password);

      if (!comparePassword) {
        logger.warn(`Login failed: Incorrect password for email: ${email}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Password is incorrect", STATUS_CODES.BAD_REQUEST)
          );
      }

      if (comparePassword) {
        logger.info(`User logged in successfully: ${email}`);
        const tokens = await generateAccessAndRefreshToken(
          checkUser._id as string
        );

        if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to generate tokens",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const { accessToken, refreshToken } = tokens;

        const isProduction = process.env.NODE_ENV === "production";
        const accessOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? ("none" as const) : ("lax" as const),
          partitioned: isProduction,
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        };

        const refreshOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? ("none" as const) : ("lax" as const),
          partitioned: isProduction,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: "/",
        };

        if (remember) {
          return res
            .status(STATUS_CODES.OK)
            .cookie("accessToken", accessToken, accessOptions)
            .cookie("refreshToken", refreshToken, refreshOptions)
            .cookie("email", email)
            .cookie("password", password)
            .cookie("remember", remember)
            .json(
              new ApiResponse(
                STATUS_CODES.OK,
                { accessToken: accessToken, refreshToken: refreshToken },
                "User login successfully"
              )
            );
        } else {
          return res
            .cookie("accessToken", accessToken, accessOptions)
            .cookie("refreshToken", refreshToken, refreshOptions)
            .clearCookie("email")
            .clearCookie("password")
            .clearCookie("remember")
            .json(
              new ApiResponse(
                STATUS_CODES.OK,
                { accessToken: accessToken, refreshToken: refreshToken },
                "User login successfully"
              )
            );
        }
      }
    } catch (error) {
      logger.error(
        `Login error : ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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

  async renderSedEmail(req: Request, res: Response) {
    try {
      const email = req.cookies.email || "";
      res.render("auth/send-email", {
        title: "Send Email",
        email,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash(
        "error",
        error instanceof Error ? error.message : String(error)
      );
      return res.redirect("/sendemail");
    }
  }

  async forgotsendemail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      logger.info(`Password reset request for email: ${email}`);

      const { error } = forgotsendemailValidation(req.body);

      if (error) {
        logger.warn(
          `Password reset validation failed for email: ${email}: ${error.details[0].message}`
        );
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const checkEmail = await User.findOne({ email: email });
      if (!checkEmail) {
        logger.warn(`Password reset failed: Invalid email: ${email}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError("Enter the valid email", STATUS_CODES.BAD_REQUEST)
          );
      }

      const generateToken = (checkEmail as any).getResetPasswordToken();
      await checkEmail.save({ validateBeforeSave: false });

      const resetPasswordUrl = `${process.env.CLIENT_URL_ADMIN}/forgotpassword/${generateToken}`;

      const message = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 30px;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <h2 style="color: green;">SPOTIFY</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="color: #333333; margin: 0; font-size: 24px;">Password Reset</h1>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>Hello ${checkEmail.fullName},</p>
                                        <p>We received a request to reset the password for your account associated with this email address. If you made this request, click the button below to set a new password.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <a href="${resetPasswordUrl}" target="_blank" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>This password reset link is valid for **15 minutes**. After that, it will expire and you will need to request a new one.</p>
                                        <p>If the button above doesn't work, you can copy and paste this URL into your web browser:</p>
                                        <p><a href="${resetPasswordUrl}" target="_blank" style="color: #007bff; word-break: break-all;">${resetPasswordUrl}</a></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <hr style="border: none; border-top: 1px solid #dddddd;">
                                        <p style="color: #888888; font-size: 14px; margin-top: 20px;">
                                            <strong>Didn't request this?</strong> If you did not request a password reset, please ignore this email. Your password is safe and will not be changed.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center" style="color: #999999; font-size: 12px; line-height: 1.5;">
                            <p>&copy; 2025 LMS APP. All rights reserved.</p>
                            <p>[Your Company Address, e.g., 123 Main Street, Anytown, USA 12345]</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

      try {
        await sendEmail({
          email: checkEmail.email,
          subject: "LMS App Reset Password",
          message: message,
        });

        logger.info(`Password reset email sent to: ${email}`);

        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "Email sent successfully")
          );
      } catch (error: any) {
        logger.error(
          `Failed to send password reset email to ${email}: ${error.message}`
        );
        checkEmail.forgotPasswordToken = undefined;
        checkEmail.forgotPasswordExpiry = undefined;
        await checkEmail.save({ validateBeforeSave: false });
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }
    } catch (error: any) {
      logger.error(`Password reset error: ${error.message}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
  }

  async renderForegotPassword(req: Request, res: Response) {
    const { token } = req.params;
    try {
      res.render("auth/forgot-password", {
        title: "Forgot Password",
        token,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash(
        "error",
        error instanceof Error ? error.message : String(error)
      );
      return res.redirect(`/forgotpassword/${token}`);
    }
  }
}

export default new AuthController();
