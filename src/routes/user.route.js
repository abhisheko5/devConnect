import express from 'express';
import {registerUser,loginUser, refreshAccessToken,logoutUser,getUserInfo,getUserByname,updateUserProfile,followUser} from '../controller/user.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';
const router =express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/logout').post(authMiddleware,logoutUser);

router.route('/user-by-name').get(authMiddleware,getUserByname);

router.route('/update-profile').put(authMiddleware,updateUserProfile);

router.route('/:id/follow').post(authMiddleware,followUser);

router.route('/me').get(authMiddleware,getUserInfo)

export default router;
