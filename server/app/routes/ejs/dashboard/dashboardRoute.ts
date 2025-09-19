import dashboardController from "../../../controllers/dashboard/dashboardController";
import adminVerifyJwt from "../../../middleware/adminMiddleware";
import adminCheckRoles from "../../../middleware/AdminPermissionMiddleware";
import upload from "../../../middleware/multer";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderDashboard
  );

router
  .route("/createartist")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderArtist
  );

router
  .route("/admin/createartist")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.createArtist
  );

router
  .route("/createplans")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderPlans
  );

router
  .route("/admin/createplanes")
  .post(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.createPlans
  );

router
  .route("/plans")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.rendergetPlans
  );

router
  .route("/admin/getplans")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.getPlans
  );

router
  .route("/updateplanes/:slugId")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderUpdatePlans
  );

router
  .route("/admin/updateplanes/:slugId")
  .put(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.updatePlans
  );

router
  .route("/admin/deleteplanes/:slugId")
  .delete(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.deletePlans
  );

router
  .route("/albums")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderAlbum
  );

router
  .route("/songs")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderSongs
  );

router
  .route("/users")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renserUsers
  );

router
  .route("/admin/profile")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.getprofile
  );

router
  .route("/updateprofile")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderUpdateProfile
  );

router
  .route("/admin/updateprofile")
  .put(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    upload.single("profilePicture"),
    dashboardController.updateProfile
  );

router
  .route("/changepassword")
  .get(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.renderChangePassword
  );

router
  .route("/admin/changepassword")
  .put(
    adminVerifyJwt,
    adminCheckRoles(["admin"]),
    dashboardController.changePassword
  );

router
  .route("/admin/logout")
  .get(adminVerifyJwt, adminCheckRoles(["admin"]), dashboardController.logout);

export default router;
