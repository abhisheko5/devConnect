import {Post} from "../models/post.model.js"
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from "../utils/apiResponse.js"
import {uploadOnCloudinary} from "../utils/uploadImage.js"
import {User} from "../models/user.model.js"



const createPost = asyncHandler(async(req,res)=>{

    const{caption , image,tags} =req.body;
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
        tags,

    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,userPost,"user posted successfully")
    );


})

const deletePost = asyncHandler(async(req,res)=>{
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    
    if(!post){
        throw new ApiError(404,"post not found");
    }

    if(post.author.toString()!==userId.toString()){
        throw new ApiError(404,"not allowed");
    }

    const postToDelete = await Post.findByIdAndDelete(postId);

    if(!postToDelete){
        throw new apiError(400,"delete failed");
    }



    return res
    .status(200)
    .json(
        new ApiResponse(200,null,"post deleted  successfully")
   )
})

const getUserPosts = asyncHandler(async(req,res)=>{

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId= req.params.id;

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(400,"user not found");
    }

    const posts = await Post.find({author : userId})
    .skip(skip)
    .limit(limit)
    .populate("author", " name avatar")
    .sort({createdAt: -1});


    return res
    .status(200)
    .json(
        new ApiResponse(200,posts,"all posts fetched successfully")
    );

})

const getallPosts= asyncHandler(async(req,res)=>{
   
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 10;
   const skip = (page - 1) * limit;

   
    const Posts= await Post.find({})
    .skip(skip)
    .limit()
    .populate("author","name avatar")
    .sort({createdAt: -1})
    

    return res
    .status(200)
    .json(
        new ApiResponse(200,Posts,"all posts fetched successfully")
    );

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

const comment = asyncHandler(async(req,res)=>{

    const postId= req.params.id;
    const userId = req.user._id;
    const comment = req.body.text;

    if(!comment){
        throw new ApiError(400,"please enter text to comment");
    }


    const post = await Post.findById(postId);

    await Post.findByIdAndUpdate(postId,
        {
            $push:{
                comments:{
                    
                    text:comment,
                    author: userId,
                    createdAt:new Date(),
                },
            },
        },
        {new: true}
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200,post, "commented succesfully")
    );
})

const deleteComment = asyncHandler(async(req,res)=>{

    const postId = req.params.id;
    const userid = req.user._id;

    const  post = await Post.findById(postId);

    if(!post){
        throw new ApiError(400,"post not available")
    }
    const comment = await Post.findByIdAndUpdate({postId,
        $pull:{
            comment:{
                user: userId,
                text : commentext,
            }
        }
    })


    



})

const singlePost = asyncHandler(async(req,res)=>{
    const postId= req.params.id

    const post= await Post.findById(postId);

    if(!post){
        throw new ApiError(400,"post not found");
    }

    post
    .populate("author"," name avatar")
    .populate("comments.commenter","name avatar")

    return res
    .status(200)
    .json(
        new ApiResponse(200,post,"single post details fetched")
    );

})

const searchpostbytag = asyncHandler(async(req,res)=>{
    const query =req.query.query;

    if(!query){
        throw new ApiError(400,"please provide a tag");
    }

    const posts = await Post.find({
        $or:[
            {caption:{$regex:query, $options:"i"}},
            {tags:{$in:[query]}}

        ]

    
    })
    .populate("author", "name avatar")
    .sort({createdAt:-1});

    return res
    .status(200)
    .json(
        new ApiResponse(200,posts,`Found ${posts.length} post(s) matching "${query}"`)
    );
});

const trendingtag = asyncHandler(async(req,res)=>{

    const posts = await Post.aggregate([
        {$unwind:"$tags" },
        {
            $group:{
                _id:"$tags",count:{$sum:1}
            }
        },
    {$sort:{count:-1}},
    {$limit:10}]
    )


return res
.status(200)
.json( 
    new ApiResponse(200,tags,"trending tags fetched successfully")
)
});

export {createPost,getallPosts,likeandunlikePost,comment,deletePost,getUserPosts,singlePost
    ,searchpostbytag,trendingtag
};