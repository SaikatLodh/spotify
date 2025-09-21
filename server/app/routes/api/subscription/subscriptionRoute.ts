import subscriptionController from "../../../web/subscription/subscriptionController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";

const router = express.Router();

router.post(
  "/create-subscription",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subscriptionController.createSubscription
);
router.get(
  "/get-keys",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subscriptionController.getKeys
);
router.post(
  "/verify-subscription/:subscriptionId/:userId",
  subscriptionController.verifySubscription
);
router.get(
  "/expire-subscription",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subscriptionController.expireSubscription
);

export default router;
