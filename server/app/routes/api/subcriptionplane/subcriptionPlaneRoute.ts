import subcriptionPlaneController from "../../../web/subcriptionplane/subcriptionPlaneController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";

const router = express.Router();

router.get(
  "/get-subscriptions-planes",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subcriptionPlaneController.getSubscriptionPlane
);

export default router;
