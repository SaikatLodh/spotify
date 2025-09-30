import likeSong from "../../../web/likesong/likeSong";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/v1/likesong/like-song/{songId}:
 *   get:
 *     summary: Like or unlike a song
 *     tags: [LikeSong restful API]
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
 *         description: Song liked or unliked successfully
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
  "/like-song/:songId",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  likeSong.likeSong
);
/**
 * @swagger
 * /api/v1/likesong/get-liked-songs:
 *   get:
 *     summary: Get liked songs for the user
 *     tags: [LikeSong restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liked songs fetched successfully
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
 *                       song:
 *                         type: object
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
  "/get-liked-songs",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  likeSong.getLikedSongs
);

export default router;
