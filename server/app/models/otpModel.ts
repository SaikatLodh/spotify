import mongoose from "mongoose";
import { Otp } from "../interface/otpInterface";

const otpSchema = new mongoose.Schema<Otp>(
  {
    email: {
      type: String,
      unique: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    otpExpire: {
      type: Date,
      default: null,
      required: true,
    },
    isotpsend: {
      type: Boolean,
      default: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model<Otp>("otp", otpSchema);

export default Otp;
