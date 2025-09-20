import playlistController from "../../../web/playlist/playlistController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";
import express from "express";
const router = express.Router();

router.post(
  "/create-playlist",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  playlistController.createPlaylist
);
router.get(
  "/get-playlists",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.getPlaylists
);
router.get(
  "/get-playlist-by-id/:slugId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.getSinglePlaylist
);

router.patch(
  "/update-playlist/:slugId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  playlistController.updatePlaylist
);

router.delete(
  "/delete-playlist/:slugId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.deletePlaylist
);

router.get(
  "/add-and-remove-songs/:slugId/:songId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.addAndRemoveSongToPlaylist
);
export default router;
