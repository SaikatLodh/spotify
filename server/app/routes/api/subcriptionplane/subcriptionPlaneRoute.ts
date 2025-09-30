import subcriptionPlaneController from "../../../web/subcriptionplane/subcriptionPlaneController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/subcriptionplane/get-subscriptions-planes:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Subscription Plane restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription plans fetched successfully
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
 *                       planName:
 *                         type: string
 *                       price:
 *                         type: number
 *                       duration:
 *                         type: string
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                       isDeleted:
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
  "/get-subscriptions-planes",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subcriptionPlaneController.getSubscriptionPlane
);

export default router;
