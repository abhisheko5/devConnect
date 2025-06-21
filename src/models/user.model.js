import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },

    bio:{
        type:String,
        default:"",
        trim:true
    },
    skills:{
        type:[String],
        default:[],
    },
    githubUsername:{
        type:String,
        default:"",
        trim:true
    },
    avatar:{
        type:String,// cloudinary url
    },

    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],

    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    refreshToken:{
        type:String,
    },

},{
    timestamps:true
}
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();

    this.password= await bcrypt.hash(this.password,10);
    next();
})



userSchema.methods.matchPassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);

};

userSchema.methods.getAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            name:this.name,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30mins"
        }
    );
}

userSchema.methods.getRefreshToken = function (){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
}



export const User = mongoose.model("user", userSchema);

