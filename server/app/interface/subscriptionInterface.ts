import { Types } from "mongoose";

interface SubscriptionInterface {
  plan: "Standard" | "Pro" | "Premium";
  price: 199 | 399 | 499;
  duration: "3 months" | "6 months" | "12 months";
  userId: Types.ObjectId;
  expitreDate: Date;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  status: "pending" | "success" | "failed" | "expired";
}

export { SubscriptionInterface };
