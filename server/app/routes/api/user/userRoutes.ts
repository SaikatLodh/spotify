import userController from "../../../web/user/userController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";

import express from "express";
const router = express.Router();

router.get(
  "/profile",
  verifyJwt,
  checkRoles(["listner", "artist"]),
  userController.getProfile
);

router.put(
  "/update-profile",
  verifyJwt,
  checkRoles(["listner", "artist"]),
  upload.single("profilePicture"),
  userController.updateProfile
);

router.put(
  "/update-password",
  verifyJwt,
  checkRoles(["listner", "artist"]),
  userController.updatePassword
);

router.delete(
  "/delete-account",
  verifyJwt,
  checkRoles(["listner", "artist"]),
  userController.deleteAccount
);

export default router;
