import songsController from "../../../web/songs/songsController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import upload from "../../../middleware/multer";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/songs/create-song:
 *   post:
 *     summary: Create a new song
 *     tags: [Songs restful API]
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
 *               albumId:
 *                 type: string
 *               audio:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - albumId
 *               - audio
 *               - image
 *     responses:
 *       201:
 *         description: Song created successfully
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

/**
 * @swagger
 * /api/v1/songs/get-songs-by-search:
 *   get:
 *     summary: Search songs by name
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Song name to search
 *     responses:
 *       200:
 *         description: Songs fetched successfully
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
 *                       artist:
 *                         type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Songs not found
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
router.get(
  "/get-songs-by-search",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.getSongsBySearch
);

/**
 * @swagger
 * /api/v1/songs/get-all-songs-by-album/{albumId}:
 *   get:
 *     summary: Get all songs by album
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Songs fetched successfully
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
 *                       artist:
 *                         type: object
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Songs not found
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

/**
 * @swagger
 * /api/v1/songs/get-song-by-id/{songId}/{albumId}:
 *   get:
 *     summary: Get single song by ID and album ID
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Song fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     artistId:
 *                       type: object
 *                     audioUrl:
 *                       type: object
 *                       properties:
 *                         publicId:
 *                           type: string
 *                         url:
 *                           type: string
 *                     imageUrl:
 *                       type: object
 *                       properties:
 *                         publicId:
 *                           type: string
 *                         url:
 *                           type: string
 *                     duration:
 *                       type: number
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Song not found
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
router.get(
  "/get-song-by-id/:songId/:albumId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.getSingelSong
);

/**
 * @swagger
 * /api/v1/songs/update-song/{songId}/{albumId}:
 *   put:
 *     summary: Update song
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
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
 *     responses:
 *       200:
 *         description: Song updated successfully
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
router.put(
  "/update-song/:songId/:albumId",
  verifyJwt,
  checkRoles(["artist"]),
  upload.single("image"),
  songsController.updateSong
);

/**
 * @swagger
 * /api/v1/songs/delete-song/{songId}/{albumId}:
 *   delete:
 *     summary: Delete song
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Song deleted successfully
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
  "/delete-song/:songId/:albumId",
  verifyJwt,
  checkRoles(["artist"]),
  songsController.deleteSong
);

/**
 * @swagger
 * /api/v1/songs/listen-song/{songId}:
 *   get:
 *     summary: Listen to a song (add to listeners)
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song listened successfully
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
 *       404:
 *         description: Song not found
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
router.get(
  "/listen-song/:songId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.listenSong
);

/**
 * @swagger
 * /api/v1/songs/download-song/{publicId}:
 *   get:
 *     summary: Download a song
 *     tags: [Songs restful API]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID of the song audio
 *     responses:
 *       200:
 *         description: Song download initiated
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
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
  "/download-song/:publicId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  songsController.downloadsong
);

export default router;
