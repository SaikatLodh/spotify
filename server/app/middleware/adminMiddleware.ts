import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const adminVerifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      return res.redirect("/login");
    }

    const decode: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    if (!decode) {
      req.flash("error", "Invalid token");
      return res.redirect("/login");
    }

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordExpire -resetPasswordToken"
    );

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    req.flash("error", error instanceof Error ? error.message : String(error));
    return res.redirect("/login");
  }
};

export default adminVerifyJwt;
