import  mongoose from'mongoose'
const Schema = mongoose.Schema;

const dataModel = new Schema({
    user:{
        type:String, 
        required:true,
        maxlength:50
    },
    reposName:{
        type:String,
         required:true,
         maxlength:100

        },
    reposStart:{
        type:Number,
        min:0
    },
    reposDescription:{
        type:String,
        maxlenght:500
       
    },
    reposUrl:{
        type:String,
        required:true,
        match: /https?:\/\/(www\.)?github\.com\/.+/
        },

    tags:{
        type:[String],
         default:[]
        }
}, {timeStamp:true});

const Repos  = mongoose.model('Repositories',dataModel)
export  default Repos;