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
    return res
    .status(200)
    .json(

        new ApiResponse(200,req.user,"user details fetched successfully")
    );
})


export {registerUser, loginUser, refreshAccessToken,logoutUser,getUserInfo};