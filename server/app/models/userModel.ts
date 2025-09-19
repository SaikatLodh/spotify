import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../interface/userInterface";

const userSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 50 });
          },
          message: "Full name must be between 3 and 50 characters long",
        },
      ],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [
        {
          validator: function (v) {
            return validator.isEmail(v);
          },
          message: "Please enter a valid email",
        },
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (v) {
            return validator.isLength(v, { min: 6, max: 30 });
          },
          message: "Password must be between 6 and 20 characters long",
        },
      ],
    },
    profilePicture: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    gooleavatar: {
      type: String,
    },
    faceBookavatar: {
      type: String,
    },
    fbId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["listner", "artist", "admin"],
      default: "listner",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordExpiry: {
      type: Date,
      default: null,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscription",
    },
    subscriptionStatus: {
      type: String,
      enum: ["Free", "Standard", "Pro", "Premium"],
      default: "Free",
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id.toString(), role: this.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME as string,
    } as any
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id.toString(), role: this.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME as string,
    } as any
  );
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model<User>("user", userSchema);

export default User;
