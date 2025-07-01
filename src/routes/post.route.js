import express from "express";
import {authMiddleware} from '../middleware/auth.middleware.js';
import {createPost,getallPosts,likeandunlikePost,comment,deletePost,getUserPosts,singlePost,searchpostbytag,trendingtag} from "../controller/post.controller.js"
import {upload} from "../middleware/multer.middleware.js";

const router =express.Router();

router.route('/create-post').post(authMiddleware,
    upload.fields([
        {
            name:"image",
            maxcount:5
        }
    ]),
    createPost);
router.route('/all-posts').get(authMiddleware,getallPosts)
router.route('/:id/like-unlike-post').post(authMiddleware,likeandunlikePost);

router.route('/:id/comment').post(authMiddleware,comment);

router.route('/:id/delete-post').post(authMiddleware,deletePost);

router.route('/:id/user-posts').get(authMiddleware,getUserPosts);

router.route('/:id/detailed-post').get(authMiddleware,singlePost);

router.route("/postbytag/query").get(authMiddleware,searchpostbytag);

router.route("/trending-tag").get(authMiddleware,trendingtag);

export default router;