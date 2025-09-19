import STATUS_CODES from "../config/httpStatusCode";
import apiError from "../config/apiError";
import { NextFunction, Request, Response } from "express";

const checkRoles = (userRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user.role;

    if (!req.user || !role) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json(new apiError(" Role not found", STATUS_CODES.FORBIDDEN));
    }

    if (userRole.includes(role)) {
      next();
    } else {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json(new apiError("Access denied", STATUS_CODES.FORBIDDEN));
    }
  };
};

export default checkRoles;
