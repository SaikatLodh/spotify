import Joi from "joi";

export const createAlbumSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    "string.base": "Title should be a type of 'text'",
    "string.empty": "Title cannot be an empty field",
    "any.required": "Title is a required field",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be at most 50 characters long",
  }),
  artistName: Joi.string().min(3).max(50).required().messages({
    "string.base": "Artist name should be a type of 'text'",
    "string.empty": "Artist name cannot be an empty field",
    "any.required": "Artist name is a required field",
    "string.min": "Artist name must be at least 3 characters long",
    "string.max": "Artist name must be at most 50 characters long",
  }),
});
