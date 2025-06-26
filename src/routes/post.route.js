import express from "express";
import {authMiddleware} from '../middleware/auth.middleware.js';
import {createPost,getallPosts,likeandunlikePost,comment} from "../controller/post.controller.js"
import {upload} from "../middleware/multer.middleware.js";

const router =express.Router();

router.route('/post').post(authMiddleware,
    upload.fields([
        {
            name:"image",
            maxcount:5
        }
    ]),
    createPost);
router.route('/all-posts').get(authMiddleware,getallPosts)
router.route('/:id/like-unlike-post').post(authMiddleware,likeandunlikePost);

router.route('/comment').post(authMiddleware,comment);
export default router;