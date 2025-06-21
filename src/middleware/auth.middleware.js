import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import {User} from "../models/user.model.js"
;


export const authMiddleware = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if(!token){
        throw new ApiError(401, "unauthorized request, please login");

    }
    console.log(token);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decoded?._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(401,"invalid token");
    }
    req.user= user;
    next();
}
catch(err){
    throw new ApiError(401,"invalid access token");
}
});