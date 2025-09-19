import Joi from "joi";

export const createPlaylistSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title cannot be an empty field",
    "any.required": "Title is a required field",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be at most 50 characters long",
  }),
});
