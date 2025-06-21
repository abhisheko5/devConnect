import express from 'express';
import {registerUser,loginUser, refreshAccessToken,logoutUser,getUserInfo} from '../controller/user.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';
const router =express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/logout').post(authMiddleware,logoutUser);
export default router;

router.route('/me').get(authMiddleware,getUserInfo)