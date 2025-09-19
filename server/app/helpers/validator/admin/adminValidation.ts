import Joi from "joi";

export const createArtistschema = Joi.object({
  fullName: Joi.string().required().trim().min(3).max(50).messages({
    "string.base": "Full name must be a text value",
    "string.empty": "Full name is required",
    "any.required": "Full name field cannot be empty",
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must be at most 50 characters long",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
    .required()
    .trim()
    .messages({
      "string.base": "Email must be a text value",
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
      "any.required": "Email field cannot be empty",
      "string.tlds":
        "Email must end with a valid domain (e.g., .com, .net, .in)",
    }),
  password: Joi.string().required().trim().min(6).max(30).messages({
    "string.base": "Password must be a text value",
    "string.empty": "Password is required",
    "any.required": "Password field cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password must be at most 30 characters long",
  }),
});

export const createPlansSchema = Joi.object({
  planName: Joi.string()
    .valid("Standard", "Pro", "Premium")
    .required()
    .messages({
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
  features: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Features must be an array",
    "any.required": "Features is required",
    "string.base": "Each feature must be a string",
  }),
});
