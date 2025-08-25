import mongoose from "mongoose";
const {Schema}=mongoose

const BlogSchema = new Schema({
 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ,
    author:{
        type:String,
        required:true  
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        
        // default:"https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
    content:{
        type:String,
        required:true
    },
    date:{
        type:Date,
       default:Date.now
       },
});

const Blog = mongoose.model("blog",BlogSchema); // Define Blog model

export default Blog; 
