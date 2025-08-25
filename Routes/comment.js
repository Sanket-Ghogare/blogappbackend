
import  express  from "express";
import comment from "../Module/Commit.js"
const commentRouter = express.Router();


commentRouter.post('/newcomment',async(req ,res)=>{
   
        try {
            const newcomment=new comment({
                name:req.body.name,
                postId:req.body.postId,
                comments:req.body.comments,

            })
           const data= await newcomment.save();
           res.json(data)
        } catch (error) {
            console.error('Failed to comment', error);
            res.status(500).json({ error: "Failed to create a comment", errorMessage: error.message });
       
        }
    });

commentRouter.get('/getcomment',async(req,res)=>{
    try {
        const comments= await comment.find();
        res.json(comments);
    } catch (error) {
        console.error('Failed to fetch comment', error);
            res.status(500).json({ error: "Failed to get a comment", errorMessage: error.message });
       
    }
});

commentRouter.delete('/deletecomment/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        const comments=await comment.findOneAndDelete({_id:id});
        return   res.json({
            success:"true"
           });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: "failed to delete comment", errorMessage: error.message });
    }
})

export default commentRouter;


