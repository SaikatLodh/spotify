import authController from "../../../controllers/auth/authController";
import express from "express";

const router = express.Router();

router.route("/login").get(authController.renderLogin);
router.route("/sendemail").get(authController.renderSedEmail);
router.route("/forgotpassword/:token").get(authController.renderForegotPassword);

router.route("/admin/login").post(authController.login);
router.route("/admin/sendemail").post(authController.forgotsendemail);

export default router;
