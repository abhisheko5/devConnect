import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

    caption:{
        type:String
    },

    image:{
        type:String   //cloudinary url
    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    }],

    comments:[{
        text:{
            type:String ,
            required:true
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },

        createdAt:{
            type:Date,
            default:Date.now
        }
    }],

    

},
{timestamps:true}
)

export const Post = mongoose.model("Post",postSchema);