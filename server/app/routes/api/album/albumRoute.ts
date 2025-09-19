import albumController from "../../../web/album/albumController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";

import express from "express";

const router = express.Router();

router.post(
  "/create-album",
  verifyJwt,
  checkRoles(["artist"]),
  upload.single("imageFile"),
  albumController.createAlbum
);

router
  .route("/get-all-albums")
  .get(
    verifyJwt,
    checkRoles(["artist", "listner"]),
    albumController.getAllAlbums
  );

router.get(
  "/get-all-recent-albums",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getRecentAllAlbums
);

router.get(
  "/get-all-trending-albums",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getTendAllAlbums
);

router.get(
  "/get-all-made-for-you-albums",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getMadeForYouAllAlbums
);

router.get(
  "/get-album-by-id/:id",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getSingelAlbum
);

router.get(
  "/get-albums-by-artist",
  verifyJwt,
  checkRoles(["artist"]),
  albumController.getAllAlbumsBYArtist
);

router.get(
  "/get-single-albums-by-artist/:id",
  verifyJwt,
  checkRoles(["artist"]),
  albumController.getSingelAlbumByArtist
);

router.patch(
  "/update-album/:id",
  verifyJwt,
  checkRoles(["artist"]),
  upload.single("imageFile"),
  albumController.updateAlbum
);

router.delete(
  "/delete-album/:id/:slug",
  verifyJwt,
  checkRoles(["artist"]),
  albumController.deleteAlbum
);

router.get(
  "/is-published-album/:id/:slug",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.isPublishedAlbum
);

export default router;
