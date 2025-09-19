import likeSong from "../../../web/likesong/likeSong";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";
const router = express.Router();

router.get(
  "/like-song/:songId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  likeSong.likeSong
);
router.get(
  "/get-liked-songs",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  likeSong.getLikedSongs
);

export default router;
