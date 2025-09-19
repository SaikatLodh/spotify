import { Types } from "mongoose";
interface User {
  fullName: string;
  email: string;
  password: string;
  profilePicture?: {
    public_id?: string;
    url?: string;
  };
  gooleavatar?: string;
  faceBookavatar?: string;
  fbId?: string;
  role?: "listner" | "artist" | "admin";
  isVerified?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  subscription?: Types.ObjectId;
  subscriptionStatus?: "Free" | "Standard" | "Pro" | "Premium";
  subscribed?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export { User };
