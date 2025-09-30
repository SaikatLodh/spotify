import subscriptionController from "../../../web/subscription/subscriptionController";
import verifyJwt from "../../../middleware/authMiddleware";
import checkRoles from "../../../middleware/checkPermissionMiddleware";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/subscription/create-subscription:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscription restful API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *             required:
 *               - plan
 *               - price
 *               - duration
 *     responses:
 *       201:
 *         description: Subscription created successfully
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
 *                     razorpayOrderDetails:
 *                       type: object
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
  "/create-subscription",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subscriptionController.createSubscription
);
/**
 * @swagger
 * /api/v1/subscription/get-keys:
 *   get:
 *     summary: Get Razorpay keys
 *     tags: [Subscription restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Keys fetched successfully
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
 *                     key:
 *                       type: string
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
  "/get-keys",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subscriptionController.getKeys
);
/**
 * @swagger
 * /api/v1/subscription/verify-subscription/{subscriptionId}/{userId}:
 *   post:
 *     summary: Verify subscription payment
 *     tags: [Subscription restful API]
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *             required:
 *               - razorpay_payment_id
 *               - razorpay_order_id
 *               - razorpay_signature
 *     responses:
 *       302:
 *         description: Redirect to payment success or failure page
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
 *       404:
 *         description: Subscription not found
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
  "/verify-subscription/:subscriptionId/:userId",
  subscriptionController.verifySubscription
);
/**
 * @swagger
 * /api/v1/subscription/expire-subscription:
 *   get:
 *     summary: Expire subscription
 *     tags: [Subscription restful API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription expired successfully
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
 *       404:
 *         description: User not found
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
  "/expire-subscription",
  verifyJwt,
  checkRoles(["artist", "listner"]),
  subscriptionController.expireSubscription
);

export default router;
