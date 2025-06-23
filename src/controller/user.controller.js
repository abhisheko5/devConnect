import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from "../utils/apiResponse.js"
import jwt from 'jsonwebtoken';

// function to register a new user
const registerUser =asyncHandler(async(req,res)=>{

    const {name, email,password}= req.body;

    if(!name || !email || !password){
        throw new ApiError(400,"Please provide all fields");
    }

    const userExists = await User.findOne({
        $or: [{email}, {name}]
    });

    if(userExists){
        throw new ApiError(400,"User already exists with this email or username");
    }
    console.log("user does not exist, creating new user");
    const user = await User.create({
        name,
        email,
        password
    })
    console.log("user created successfully", user);


    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser){
        throw new ApiError(500,"user creation failed");
    }

    const {accessToken, refreshToken} = await generateAccessTokenandRefreshToken(user._id);

    const option= {
        httpOnly:true,
        secure:true
    }

    return res
    .status(201)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
        new ApiResponse(200,
            {user,accessToken, refreshToken},
            "user created successfullly")
    );
});

// function to generate access and refresh tokens
const generateAccessTokenandRefreshToken = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.getAccessToken();
        const refreshToken = user.getRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken};
    }
    catch(error){
        throw new ApiError(500, "Error generating tokens");
    }
}

//function to login a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;


    if(!email || !password){
        throw new ApiError(400, "please provide all fields");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401, "Invalid email");
    }
    const isPasswordCorrect = await user.matchPassword(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"invalid password");
    }

    const {accessToken, refreshToken} =await generateAccessTokenandRefreshToken(user._id);

    const option = {
        httpOnly:true,
        secure:true,
    };
    

    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(200,
            {user, accessToken, refreshToken},
            "user logged in successfully"
        )
    )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const newrefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if(!newrefreshToken){
        throw new ApiError(401, "No refresh token found");
    }

    const decoded = jwt.verify(
        newrefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );


    

    const user = await User.findById(decoded?._id);

    if(!user){
        throw new ApiError(401,"user not found");

    }

    if(user.refreshToken !== newrefreshToken){
        throw new ApiError(401," invalid refresh token or expired");
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    const {accessToken, refreshToken} = await generateAccessTokenandRefreshToken(user._id);

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {accessToken, refreshToken},
            "Access token refreshed successfully"
        )
    );
})

const logoutUser = asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{refreshToken:1}
        },
        {
            new:true,
        }
    )

    const options = {
        httpOnly:true,
        secure:true,
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(
    new ApiResponse(200,null,"User logged out successfully")
)
});

const getUserInfo = asyncHandler(async(req,res)=>{

    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(400,"user not found");
    }


    return res
    .status(200)
    .json(

        new ApiResponse(200,user,"user details fetched successfully")
    );
})

const updateAccountdeatils =asyncHandler(async(req,res)=>{

    const {name,email} = req.body;

    if(!name || !email){
        throw new ApiError(400, "all fields are required");
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                name,email
            }
        },
        {
            new:true,
        }
    ).select("-password")

    return res.
    status(200)
    .json(
        new ApiResponse(200,req.user,"user details updated successfully")
    )
})

const getUserByname = asyncHandler(async(req,res)=>{

    const {name} = req.body ;

    if(!name){
        throw new ApiError(400, "name is required");
    }

    const user = await User.findOne({name}).select("-password -refreshToken") 

    if(!user){
        throw new ApiError(404,"user not found");
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"user details fetched successfully")
    )
})

const updateUserProfile = asyncHandler(async(req,res)=>{

    
    const {bio, skills,githubUsername, avatar} = req.body;

    if(!bio && !skills && !githubUsername && !avatar){
        throw new ApiError(400,"please provide at least one field to update");
    }

    const updates = {};
    if(bio) updates.bio = bio;
    if(skills) updates.skills = skills;
    if(githubUsername) updates.githubUsername = githubUsername;
    if(avatar) updates.avatar = avatar;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:
                updates
            
        },
        {new:true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(200,updatedUser,"user details updated successfully")
})

const followUser = asyncHandler(async (req, res) => {
  const followeeId = req.params.id;
  const followerId = req.user._id;

  if (followerId.toString() === followeeId) {
    throw new ApiError(400, "You can't follow yourself");
  }

  const followerUser = await User.findById(followerId);
  const followeeUser = await User.findById(followeeId);

  if (!followerUser || !followeeUser) {
    throw new ApiError(404, "User not found");
  }


  // Add followerId to followee's followers array
  await User.findByIdAndUpdate(followeeId, {
    $addToSet: { followers: followerId },
  });

  // Add followeeId to follower's following array
  await User.findByIdAndUpdate(followerId, {
    $addToSet: { following: followeeId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Followed user successfully"));
});

const unfollowUser = asyncHandler(async(req,res)=>{

    const followerId=req.user._id;
    const followeeId = req.params.id;

    if(followerId.toString() === followeeId){
        throw new ApiError(400,"you can't unfollow yourself")
    }
    const followerUser = await User.findById(
        followerId
    );
    const followeeUser = await User.findById(
        followeId
    );

    if(!followerUser || followeeUser){
        throw new ApiError(404,"user not found");
    }

    await User.findByIdAndUpdate(followeeId,{
        $pull:{
            followers:followerId
        },
    })

    await User.findByIdAndUpdate(followerId,
        {
           $pull:{ following:followeeId}
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,null,"user unfollowed successfully")
    );


})
export {registerUser, loginUser, refreshAccessToken,logoutUser,getUserInfo,getUserByname,updateUserProfile,followUser};