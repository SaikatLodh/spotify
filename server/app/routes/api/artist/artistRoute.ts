import artistController from "../../../web/artist/artistController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";

const router = express.Router();

router.get(
  "/dashboard",
  verifyJwt,
  checkRoles(["artist"]),
  artistController.getDashboard
);

export default router;
