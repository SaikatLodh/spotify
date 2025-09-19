import express from "express";
import authController from "../../../web/auth/authController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";

const router = express.Router();

router.route("/sendotp").post(authController.sendOtp);
router.route("/verifyotp").post(authController.verifyOtp);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router
  .route("/logout")
  .get(verifyJwt, checkRoles(["listner", "artist"]), authController.logout);
router.route("/forgotsendemail").post(authController.forgotsendemail);
router
  .route("/forgotresetpassword/:token")
  .post(authController.forgotresetpassword);
router.route("/googlesignup").get(authController.googlesignup);
router.route("/googlesignin").get(authController.googlesignin);

router.route("/refreshtoken").get(authController.refreshToken);

export default router;
