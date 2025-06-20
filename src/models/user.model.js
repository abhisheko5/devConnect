import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:0
    }],

    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:0
    }]

},{
    timestamps:true
}
)

userSchema.pre("save",async function(next){
    if(!this.isModified())return next();

    this.password= await bcrypt.hash(this.password,10);
    next();
})


userSchema.methods.matchPassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);

};

export const User = mongoose.model("User", userSchema);

