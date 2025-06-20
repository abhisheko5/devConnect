import mongoose from "mongoose";

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
        unique:true,
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

    followers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:0
    },

    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:0
    }

})

const User = mongoose.model("User", userSchema);