import albumController from "../../../web/album/albumController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/album/create-album:
 *   post:
 *     summary: Create a new album
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artistName:
 *                 type: string
 *               imageFile:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - artistName
 *               - imageFile
 *     responses:
 *       201:
 *         description: Album created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.post(
  "/create-album",
  verifyJwt,
  checkRoles(["artist"]),
  upload.single("imageFile"),
  albumController.createAlbum
);

/**
 * @swagger
 * /api/v1/album/get-all-albums:
 *   get:
 *     summary: Get all published albums
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Albums fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       isPublished:
 *                         type: boolean
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router
  .route("/get-all-albums")
  .get(
    verifyJwt,
    checkRoles(["artist", "listner"]),
    albumController.getAllAlbums
  );

/**
 * @swagger
 * /api/v1/album/get-all-recent-albums:
 *   get:
 *     summary: Get recent albums
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent albums fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       isPublished:
 *                         type: boolean
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/get-all-recent-albums",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getRecentAllAlbums
);

/**
 * @swagger
 * /api/v1/album/get-all-trending-albums:
 *   get:
 *     summary: Get trending albums
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trending albums fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       isPublished:
 *                         type: boolean
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/get-all-trending-albums",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getTendAllAlbums
);

/**
 * @swagger
 * /api/v1/album/get-all-made-for-you-albums:
 *   get:
 *     summary: Get made for you albums
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Made for you albums fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       isPublished:
 *                         type: boolean
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/get-all-made-for-you-albums",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getMadeForYouAllAlbums
);

/**
 * @swagger
 * /api/v1/album/get-album-by-id/{id}:
 *   get:
 *     summary: Get single album by slug
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album slug
 *     responses:
 *       200:
 *         description: Album fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       songs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             title:
 *                               type: string
 *                             artist:
 *                               type: object
 *                       artist:
 *                         type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Album not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/get-album-by-id/:id",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.getSingelAlbum
);

/**
 * @swagger
 * /api/v1/album/get-albums-by-artist:
 *   get:
 *     summary: Get all albums by artist
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Albums fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       isPublished:
 *                         type: boolean
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/get-albums-by-artist",
  verifyJwt,
  checkRoles(["artist"]),
  albumController.getAllAlbumsBYArtist
);

/**
 * @swagger
 * /api/v1/album/get-single-albums-by-artist/{id}:
 *   get:
 *     summary: Get single album by artist
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album slug
 *     responses:
 *       200:
 *         description: Album fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       artistName:
 *                         type: string
 *                       imageUrl:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           url:
 *                             type: string
 *                       songs:
 *                         type: array
 *                         items:
 *                           type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Album not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/get-single-albums-by-artist/:id",
  verifyJwt,
  checkRoles(["artist"]),
  albumController.getSingelAlbumByArtist
);

/**
 * @swagger
 * /api/v1/album/update-album/{id}:
 *   patch:
 *     summary: Update album
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album slug
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artistName:
 *                 type: string
 *               imageFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Album updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.patch(
  "/update-album/:id",
  verifyJwt,
  checkRoles(["artist"]),
  upload.single("imageFile"),
  albumController.updateAlbum
);

/**
 * @swagger
 * /api/v1/album/delete-album/{id}/{slug}:
 *   delete:
 *     summary: Delete album
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Album slug
 *     responses:
 *       200:
 *         description: Album deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.delete(
  "/delete-album/:id/:slug",
  verifyJwt,
  checkRoles(["artist"]),
  albumController.deleteAlbum
);

/**
 * @swagger
 * /api/v1/album/is-published-album/{id}/{slug}:
 *   get:
 *     summary: Toggle publish status of album
 *     tags: [Album restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Album slug
 *     responses:
 *       200:
 *         description: Publish status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
router.get(
  "/is-published-album/:id/:slug",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  albumController.isPublishedAlbum
);

export default router;
