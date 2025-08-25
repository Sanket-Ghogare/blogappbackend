import  express  from "express";
import Blog from '../Module/Blog.js'
import upload from '../middleware/multer.middleware.js'
import uploadOnCloudnary from '../utils/cloudnary.js';
import User from '../Module/Module.js'

const blogRouter = express.Router();
import authenticateUser from "../middleware/authenticate.js"


// blogRouter.post('/upload', authenticateUser, upload.single('image'), async (req, res) => {
//   try {
//       if (!req.user || !req.user.username) {
//           return res.status(401).json({ error: "Unauthorized", errorMessage: error.message });
//       }
//       const loggedInUname = req.user.username;
//       let imageUrl = "";

//       if (req.file) {
//           const { path } = req.file;
//           const cloudinaryResponse = await uploadOnCloudnary(path);
//           imageUrl = cloudinaryResponse.url; 
//       } else {
//           imageUrl = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";
//       }

//       const newBlogPost = new Blog({
//           user: req.user.id,
//           author: loggedInUname,
//           title: req.body.title,
//           category: req.body.category,
//           content: req.body.content,
//           image: imageUrl,
//       });

//       await newBlogPost.save();

//       res.json({ url: imageUrl });
//   } catch (error) {
//       console.error('Error uploading image:', error);
//       res.status(500).json({ error: "Failed to upload image", errorMessage: error.message });
//   }
// });



blogRouter.post('/upload', authenticateUser, upload.single('file'), async (req, res) => {
  try {
      if (!req.user || !req.user.username) {
          return res.status(401).json({ error: "Unauthorized", errorMessage: error.message });
      }
      const loggedInUname = req.user.username;
      let fileUrl = "";

      if (req.file) {
          const { path } = req.file;
          const cloudinaryResponse = await uploadOnCloudnary(path);
          fileUrl = cloudinaryResponse.url; 
      } else {
          fileUrl = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";
      }

      const newBlogPost = new Blog({
          user: req.user.id,
          author: loggedInUname,
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: fileUrl,
      });

      await newBlogPost.save();

      res.json({ url: fileUrl });
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: "Failed to upload image", errorMessage: error.message });
  }
});

blogRouter.get('/blog',authenticateUser,  async(req , res)=>{
    try {
     const posts=await Blog.find();


        res.json(posts);
        
        
    } catch (error) {
        console.error('Error fetching posts:', error);
       return res.status(500).json({ error: "Failed to  fetching posts ", errorMessage: error.message });
      }
})




blogRouter.get('/category/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const post = await Blog.findOne({_id:id});
     if(post){
        res.json(post);
     }
     else{
        res.status(404).json({error:"Not Found"});
     }
    
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  blogRouter.get("/user/:id", async(req,res,next)=>{
    try{
  const newid = req.params.id;
  const post = await Blog.find({id:_id});
  if(post){
    res.json(post);

  }else{
    res.status(404).json({err0r:"edeed"})
  }
    }
    catch(err){
  res.status(200).json({err:"ededeeede"})
    }
  })

blogRouter.delete('/delete/:id',authenticateUser,async(req , res)=>{
  try {
    const id=req.params.id;
    const blog = await Blog.findOne({ _id: id });


    if( blog && blog.author === req.user.username){
       await Blog.findOneAndDelete({_id:id});
       return   res.json({
        success:"true"
       });
    }
    else {
      return res.status(403).json({ error: 'Unauthorized' });
  }

  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: "failed to delete post", errorMessage: error.message });
  }
})




// blogRouter.put('/update/:id', authenticateUser, upload.single('image'), async (req, res) => {
//   try {
//     const id = req.params.id;
//     const blog = await Blog.findOne({ _id: id });

//     if (!blog) {
//       return res.status(404).json({ error: 'Blog post not found' });
//     }

//     if (blog.author !== req.user.username) {
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     const updatedata = {
//       title: req.body.title,
//       content: req.body.content,
//     };

//     if (req.file || req.body.image) {
//       const { path } = req.file;
//       const cloudinaryResponse = await uploadOnCloudnary(path);
//       updatedata.image = cloudinaryResponse.url;
//     }

//     const edit = await Blog.findByIdAndUpdate(id, updatedata, { new: true });

//     if (!edit) {
//       return res.status(404).json({ error: 'Blog post not found' });
//     }

//     return res.json(edit);
//   } catch (error) {
//     console.error('Error updating post:', error);
//     return res.status(500).json({ error: 'Failed to update post' });
//   }
// });


blogRouter.put('/update/:id', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (blog.author !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedata = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      const { path } = req.file;
      const cloudinaryResponse = await uploadOnCloudnary(path);
      updatedata.image = cloudinaryResponse.url;
    }

    const edit = await Blog.findByIdAndUpdate(id, updatedata, { new: true });

    if (!edit) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.json(edit);
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ error: 'Failed to update post' });
  }
});



blogRouter.get('/searchcategory/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const post = await Blog.find({category:category});
   if(post){
      res.json(post);
   }
   else{
      res.status(404).json({error:"Not Found"});
   }
  
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});


blogRouter.delete('/deletepost/:id',async(req , res)=>{
  try {
    const id=req.params.id;
    const blog = await Blog.findOne({ _id: id });


       await Blog.findOneAndDelete({_id:id});
       return   res.json({
        success:"true"
       });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: "failed to delete post", errorMessage: error.message });
  }
})


blogRouter.get('/getUsers',async(req , res)=>{
  try {
    const user=await User.find({});
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
});


blogRouter.get('/getAnalytics',async(req , res)=>{
  try {
    const movies=await Blog.find({category:'Movies'}).count();
    const tech=await Blog.find({category:'Tech'}).count();
    const fashion=await Blog.find({category:'Fashion'}).count();
    const music=await Blog.find({category:'Music'}).count();
    const sport=await Blog.find({category:'Sports'}).count();
    res.status(200).json({ movies: movies, sports: sport, tech: tech, music: music,fashion:fashion });

  } catch (error) {
    res.status(500).json({ msg: error.message });

  }
})
blogRouter.get('/blogs',async(req , res)=>{
  try {
   const posts=await Blog.find();


      res.json(posts);
      
      
  } catch (error) {
      console.error('Error fetching posts:', error);
     return res.status(500).json({ error: "Failed to upload image", errorMessage: error.message });
    }
})



export default blogRouter;



