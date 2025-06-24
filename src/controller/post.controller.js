import {Post} from "../models/post.model.js"
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from "../utils/apiResponse.js"
import {uploadOnCloudinary} from "../utils/uploadImage.js"



const createPost = asyncHandler(async(req,res)=>{

    const{caption , image} =req.body;
    if(!caption && !image){
        throw new ApiError(400,"please provide either caption or image")
    }

        const postImagelocalpath = req.files?.image[0]?.path;

        if(!postImagelocalpath){
            throw new ApiError(400,"image file is required");
        }

        const Image = await uploadOnCloudinary(postImagelocalpath)

        if(!Image){
            throw new ApiError(400,"image upload failed");
        }
    
     

    const userPost = await Post.create({
        caption,
        image:Image.url,
        author:req.user._id,

    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,userPost,"user posted successfully")
    );


})

const getallPosts= asyncHandler(async(req,res)=>{
    const Posts= await Post.find({})
    .populate("author","name avatar")
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200,Posts,"all posts fetched successfully")
    )

})

const likeandunlikePost = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const postId =req.params.id;

    const post = await Post.findById(postId)
    
    //console.log("likes:", post.likes);
    //console.log("userId:", userId);

    const alreadyliked = post.likes.some(
  (id) => id.toString() === userId.toString()
);

    //console.log("alreadyliked:", alreadyliked);

    if(alreadyliked){
       await Post.findByIdAndUpdate(postId,{
            $pull : {likes:userId}
    });
    return res
    .status(200).
    json(
        new ApiResponse(200,null,"post unliked")
    )
    }
    else{

        await Post.findByIdAndUpdate(postId,{
            $addToSet:{
                likes:userId
            }
        })
        return res.status(200)
        .json(
            new ApiResponse(200,null,"post liked")
        );
    }
    


})
export {createPost,getallPosts,likeandunlikePost};