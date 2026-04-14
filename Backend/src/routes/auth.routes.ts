import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema, loginSchema, welcomeLoginSchema, updateProfileSchema } from '../utils/validation';

const r = Router();

r.post('/register', validateBody(registerSchema), auth.register);
r.post('/login', validateBody(loginSchema), auth.login);
r.post('/welcome-login', validateBody(welcomeLoginSchema), auth.welcomeLogin);
r.post('/logout', authMiddleware, auth.logout);
r.post('/refresh-token', auth.refreshToken);
r.get('/profile', authMiddleware, auth.getProfile);
r.put('/profile', authMiddleware, validateBody(updateProfileSchema), auth.updateProfile);

export default r;
