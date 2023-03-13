import Comment from "../models/Comment.js";

export const test =  (req,res)=>{
    //console.log("test is working")
    res.json("Test comment is working " )
}

// 1. create comment  
export const addComment =async (req,res,next)=>{
    try {
    //1. first need video => got from params
     const userId  = req.user.id;
     //2. comments model -> create comment
    const newComment = await Comment.create({
     userId: userId,...req.body
    }) 
    res.status(200).json(newComment)
   } catch (error) {
        next(error)
    }
}

// 2. delete
export const deleteComment =async (req,res,next)=>{
    try {
     const comment = await Comment.findById(req.params.commentId)        
     
     //const video = comment.videoId
     //const video = await Video.findById({videoId:comment.videoId})   
     
     //console.log("Video =>",video)
     // logged in user must be comment owner or video creater
     if (req.user.id === comment.userId || req.user.id === video.userId) {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json("The comment has been deleted.");
      } else {
        return next(createError(403, "You can delete ony your comment!"));
      }
    } catch (error) {
        next(error)
    }
}

// get all video comments
export const getAllVidComment =async (req,res,next)=>{
    try {
      //console.log(req.params)
      const comments = await Comment.find({videoId : req.params.videoId}).sort({ createdAt: -1 });
      res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}