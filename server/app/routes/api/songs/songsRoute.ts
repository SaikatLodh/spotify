import songsController from "../../../web/songs/songsController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";
import express from "express";

const router = express.Router();

router.post(
  "/create-song",
  verifyJwt,
  checkRoles(["artist"]),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  songsController.createSong
);

router.get(
  "/get-songs-by-search",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.getSongsBySearch
);

router
  .route("/get-all-songs-by-album/:albumId")
  .get(
    verifyJwt,
    checkRoles(["artist", "listner"]),
    songsController.getSongByAlbum
  );

router.get(
  "/get-song-by-id/:songId/:albumId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.getSingelSong
);

router.put(
  "/update-song/:songId/:albumId",
  verifyJwt,
  checkRoles(["artist"]),
  upload.single("image"),
  songsController.updateSong
);

router.delete(
  "/delete-song/:songId/:albumId",
  verifyJwt,
  checkRoles(["artist"]),
  songsController.deleteSong
);

router.get(
  "/listen-song/:songId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.listenSong
);

router.get(
  "/download-song/:publicId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.downloadsong
);

export default router;
