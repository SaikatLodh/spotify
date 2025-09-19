import Joi from "joi";

export const createSubscriptionSchema = Joi.object({
  plan: Joi.string().valid("Standard", "Pro", "Premium").required().messages({
    "string.base": "Plan name must be a text value",
    "any.only": "Plan name must be one of: Standard, Pro, Premium",
    "any.required": "Plan name is required",
  }),
  price: Joi.number().valid(199, 399, 499).required().messages({
    "number.base": "Price must be a number",
    "any.only": "Price must be one of: 199, 399, 499",
    "any.required": "Price is required",
  }),
  duration: Joi.string()
    .valid("3 months", "6 months", "12 months")
    .required()
    .messages({
      "string.base": "Duration must be a text value",
      "any.only": "Duration must be one of: 3 months, 6 months, 12 months",
      "any.required": "Duration is required",
    }),
});

export const verifySubscriptionSchema = Joi.object({
  razorpay_payment_id: Joi.string().required().messages({
    "string.base": "Razorpay payment ID must be a text value",
    "any.required": "Razorpay payment ID is required",
  }),
  razorpay_order_id: Joi.string().required().messages({
    "string.base": "Razorpay order ID must be a text value",
    "any.required": "Razorpay order ID is required",
  }),
  razorpay_signature: Joi.string().required().messages({
    "string.base": "Razorpay signature must be a text value",
    "any.required": "Razorpay signature is required",
  }),
});
