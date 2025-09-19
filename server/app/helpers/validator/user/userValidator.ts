import Joi from "joi";

export const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Full name should be a type of 'text'",
    "string.empty": "Full name cannot be an empty field",
    "string.min": "Full name should have a minimum length of {#limit}",
    "string.max": "Full name should have a maximum length of {#limit}",
  }),
});

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(30).required().messages({
    "string.base": "Old password should be a type of 'text'",
    "string.empty": "Old password cannot be an empty field",
    "string.min": "Old password should have a minimum length of {#limit}",
    "string.max": "Old password should have a maximum length of {#limit}",
  }),
  newPassword: Joi.string().min(6).max(30).required().messages({
    "string.base": "New password should be a type of 'text'",
    "string.empty": "New password cannot be an empty field",
    "string.min": "New password should have a minimum length of {#limit}",
    "string.max": "New password should have a maximum length of {#limit}",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password does not match",
      "string.empty": "Confirm password cannot be an empty field",
    }),
});
