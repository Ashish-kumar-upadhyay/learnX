import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().min(1).required(),
  role: Joi.string().valid('student', 'teacher', 'admin').required(),
  class_name: Joi.string().allow('', null),
  batch: Joi.string().allow('', null),
  username: Joi.string().min(2).allow('', null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const welcomeLoginSchema = Joi.object({
  token: Joi.string().min(32).required(),
});

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(1),
  avatar_url: Joi.string().uri().allow('', null),
  batch: Joi.string().allow('', null),
  class_name: Joi.string().allow('', null),
  username: Joi.string().min(2).allow('', null),
});

export const createUserAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().required(),
  role: Joi.string().valid('student', 'teacher', 'admin').required(),
  batch: Joi.string().allow('', null),
  is_approved: Joi.boolean(),
});

export const roleAssignSchema = Joi.object({
  role: Joi.string().valid('student', 'teacher', 'admin').required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export { objectId };
