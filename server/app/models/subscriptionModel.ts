import mongoose from "mongoose";
import { SubscriptionInterface } from "../interface/subscriptionInterface";

const subscriptionSchema = new mongoose.Schema<SubscriptionInterface>(
  {
    plan: {
      type: String,
      enum: ["Standard", "Pro", "Premium"],
    },
    price: {
      type: Number,
      enum: [199, 399, 499],
    },
    duration: {
      type: String,
      enum: ["3 months", "6 months", "12 months"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    expitreDate: {
      type: Date,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model<SubscriptionInterface>(
  "subscription",
  subscriptionSchema
);

export default Subscription;
