import Joi from "joi";

export const createSongSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  albumId: Joi.string().required().messages({
    "any.required": "Album ID is required",
    "string.empty": "Album ID cannot be empty",
  }),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().min(3).max(50).optional(),
});
