import jwt from "jsonwebtoken";
import User from "../models/userModel";
import ApiError from "../config/apiError";
import STATUS_CODES from "../config/httpStatusCode";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.headers["x-access-token"];

    if (!token) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json(new ApiError("Unauthorized", STATUS_CODES.UNAUTHORIZED));
    }

    const decode = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    if (!decode || typeof decode === "string" || !decode.id) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json(new ApiError("Invalid token", STATUS_CODES.UNAUTHORIZED));
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(new ApiError("User not found", STATUS_CODES.NOT_FOUND));
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log(error.message);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(new ApiError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
  }
};

export default verifyJwt;
