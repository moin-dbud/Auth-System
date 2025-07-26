import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerificationOtp, verifyEmail } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register );
authRouter.post('/login', login );
authRouter.post('/logout', logout );
authRouter.post('/send-verify-otp', userAuth, sendVerificationOtp );
authRouter.post('/verify-account', userAuth, verifyEmail );
authRouter.get('/is-authenticate', userAuth, isAuthenticated)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)

export default authRouter;