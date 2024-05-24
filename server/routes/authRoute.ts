import express from 'express';
import { signUpGoogle } from '../controllers/authController';
import { createUser, loginUser } from '../controllers/AHMController';

const authRouter = express.Router();

//localhost:8000/auth/google
authRouter.route('/google').post(signUpGoogle, createUser);
authRouter.route('/google/login').post(loginUser);

export default authRouter;
