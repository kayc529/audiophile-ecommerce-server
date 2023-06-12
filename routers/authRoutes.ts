import express from 'express';
import { register, login, logout } from '../controllers/authController';
import { getSession } from '../middleware/session';

const authRouter = express.Router();

authRouter.post('/register', getSession, register);
authRouter.post('/login', getSession, login);
authRouter.get('/logout', getSession, logout);

export default authRouter;
