import PaymentPlansSchema from "../../models/PaymentPlaneModel";
import { Request, Response } from "express";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";

class SubcriptionControllerPlane {
  async getSubscriptionPlane(req: Request, res: Response) {
    try {
      const subcription = await PaymentPlansSchema.find({
        isDeleted: false,
      }).sort({
        price: 1,
      });
      if (!subcription) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to get subcription",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(STATUS_CODES.OK, subcription, "Subcription fetched")
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
}

export default new SubcriptionControllerPlane();
