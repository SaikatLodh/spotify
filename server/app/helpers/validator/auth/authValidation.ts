import Joi from "joi";

export const sendOtpValidation = (data: { email: string }) => {
  const schema = Joi.object({
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
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const validateOtpValidation = (data: { email: string; otp: number }) => {
  const schema = Joi.object({
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
    otp: Joi.number().integer().min(1000).max(9999).required().messages({
      "number.integer": "OTP must be a number value",
      "number.empty": "OTP is required",
      "number.base": "OTP must be a 4-digit number",
      "any.required": "OTP field cannot be empty",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const registerValidation = (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const schema = Joi.object({
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

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const loginValidation = (data: {
  email: string;
  password: string;
  remember: boolean;
}) => {
  const schema = Joi.object({
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
    remember: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const forgotsendemailValidation = (data: { email: string }) => {
  const schema = Joi.object({
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
  });
  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const forgotrestpasswordValidation = (data: {
  password: string;
  confirmPassword: string;
}) => {
  const schema = Joi.object({
    password: Joi.string().required().trim().min(6).max(30).messages({
      "string.base": "Password must be a text value",
      "string.empty": "Password is required",
      "any.required": "Password field cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must be at most 30 characters long",
    }),
    confirmPassword: Joi.string().required().trim().min(6).max(30).messages({
      "string.base": "Password must be a text value",
      "string.empty": "Password is required",
      "any.required": "Password field cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must be at most 30 characters long",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const googleSignUpvalidation = (data: { code: string }) => {
  const schema = Joi.object({
    code: Joi.string().required().trim().messages({
      "string.base": "Code must be a text value",
      "string.empty": "Code is required",
      "any.required": "Code field cannot be empty",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const googleSignInValidation = (data: { code: string }) => {
  const schema = Joi.object({
    code: Joi.string().required().trim().messages({
      "string.base": "Code must be a text value",
      "string.empty": "Code is required",
      "any.required": "Code field cannot be empty",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const facebookSignupValidation = (data: {
  name: string;
  email: string;
  id: string;
  avatar: string;
}) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(3).max(50).messages({
      "string.base": "Name must be a text value",
      "string.empty": "Name is required",
      "any.required": "Name field cannot be empty",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name must be at most 50 characters long",
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
    id: Joi.string().required().trim().messages({
      "string.base": "ID must be a text value",
      "string.empty": "ID is required",
      "any.required": "ID field cannot be empty",
    }),
    avatar: Joi.string().uri().required().trim().messages({
      "string.base": "Avatar must be a valid URL",
      "string.empty": "Avatar is required",
      "any.required": "Avatar field cannot be empty",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};

export const facebookSignInValidation = (data: { id: string }) => {
  const schema = Joi.object({
    id: Joi.string().required().trim().messages({
      "string.base": "ID must be a text value",
      "string.empty": "ID is required",
      "any.required": "ID field cannot be empty",
    }),
  });

  return schema.validate(data, { abortEarly: false }); // abortEarly=false returns all errors
};
