import mongoose from "mongoose";
import { PaymentPlans } from "../interface/PaymentPlans";
import slugify from "slugify";

const PaymentPlansSchema = new mongoose.Schema<PaymentPlans>(
  {
    planName: {
      type: String,
      required: true,
      enum: ["Standard", "Pro", "Premium"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      enum: [199, 399, 499],
    },
    duration: {
      type: String,
      required: true,
      enum: ["3 months", "6 months", "12 months"],
    },
    features: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PaymentPlansSchema.pre("validate", async function (next) {
  if (this.isModified("planName")) {
    let newSlug = slugify(this.planName, { lower: true, strict: true });
    let slugExists = await PaymentPlans.findOne({ slug: newSlug });
    let counter = 1;

    while (slugExists) {
      newSlug = `${slugify(this.planName, {
        lower: true,
        strict: true,
      })}-${counter}`;
      counter++;
      slugExists = await PaymentPlans.findOne({ slug: newSlug });
    }
    this.slug = newSlug;
  }
  next();
});

const PaymentPlans = mongoose.model<PaymentPlans>(
  "paymentplans",
  PaymentPlansSchema
);

export default PaymentPlans;
