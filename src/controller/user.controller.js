import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from "../utils/apiResponse.js"


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

    return res
    .status(200)
    .json(
        new ApiResponse(200,"user created successfullly")
    );
});

export {registerUser};