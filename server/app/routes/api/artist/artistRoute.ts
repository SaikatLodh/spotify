import artistController from "../../../web/artist/artistController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/artist/dashboard:
 *   get:
 *     summary: Get artist dashboard
 *     tags: [Artist restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
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
 *                     totalAlbums:
 *                       type: integer
 *                     totalSongs:
 *                       type: integer
 *                     totalListensCount:
 *                       type: integer
 *                     totalLikedSongCount:
 *                       type: integer
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
 */
router.get(
  "/dashboard",
  verifyJwt,
  checkRoles(["artist"]),
  artistController.getDashboard
);

export default router;
