import express from 'express';
import {registerUser,loginUser, refreshAccessToken,logoutUser,getUserInfo,searchUserByname,updateUserProfile,followUser,unfollowUser} from '../controller/user.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';
import {upload} from "../middleware/multer.middleware.js";
const router =express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/logout').post(authMiddleware,logoutUser);

router.route('/user-by-name').get(authMiddleware,searchUserByname);

router.route('/update-profile').patch(authMiddleware,updateUserProfile);

router.route('/:id/follow').post(authMiddleware,followUser);

router.route('/:id/unfollow').post(authMiddleware,unfollowUser);




router.route('/me').get(authMiddleware,getUserInfo);

export default router;
