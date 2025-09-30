import playlistController from "../../../web/playlist/playlistController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/v1/playlist/create-playlist:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlist restful API]
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
 *               image:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Playlist created successfully
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
 *         description: Unauthorized (subscription required)
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
  "/create-playlist",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  playlistController.createPlaylist
);
/**
 * @swagger
 * /api/v1/playlist/get-playlists:
 *   get:
 *     summary: Get all playlists for the user
 *     tags: [Playlist restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Playlists fetched successfully
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
 *                       slug:
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
 *                           type: string
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized (subscription required)
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
  "/get-playlists",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.getPlaylists
);
/**
 * @swagger
 * /api/v1/playlist/get-playlist-by-id/{slugId}:
 *   get:
 *     summary: Get single playlist by slug
 *     tags: [Playlist restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slugId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist slug
 *     responses:
 *       200:
 *         description: Playlist fetched successfully
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
 *                       slug:
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
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized (subscription required)
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
 *         description: Playlist not found
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
  "/get-playlist-by-id/:slugId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.getSinglePlaylist
);

/**
 * @swagger
 * /api/v1/playlist/update-playlist/{slugId}:
 *   patch:
 *     summary: Update playlist
 *     tags: [Playlist restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slugId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist slug
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Playlist updated successfully
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
 *         description: Unauthorized (subscription required or not owner)
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
  "/update-playlist/:slugId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  playlistController.updatePlaylist
);

/**
 * @swagger
 * /api/v1/playlist/delete-playlist/{slugId}:
 *   delete:
 *     summary: Delete playlist
 *     tags: [Playlist restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slugId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist slug
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
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
 *         description: Unauthorized (subscription required or not owner)
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
  "/delete-playlist/:slugId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.deletePlaylist
);

/**
 * @swagger
 * /api/v1/playlist/add-and-remove-songs/{slugId}/{songId}:
 *   get:
 *     summary: Add or remove song from playlist
 *     tags: [Playlist restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slugId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist slug
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song added or removed successfully
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
 *         description: Unauthorized (subscription required or not owner)
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
  "/add-and-remove-songs/:slugId/:songId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  playlistController.addAndRemoveSongToPlaylist
);
export default router;
