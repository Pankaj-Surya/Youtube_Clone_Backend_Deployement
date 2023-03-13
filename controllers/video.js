import User from "../models/User.js";
import Video from "../models/Video.js";
import {createError} from "../error.js";
import { request } from "express";

//1. add Video
export const addVideo =async (req,res,next)=>{
    const newVideo = new Video({userId : req.user.id,...req.body})
    try {
    const savedVideo =  await newVideo.save();
     return res.status(200).json(newVideo)
    } catch (error) {
    throw(error)
  }
}

//2.update Video
export const updateVideo =async (req,res,next)=>{
    try {
     const video  = await Video.findById(req.params.id)
     if(!video) return next(createError(404,"Video not found"))
     // logged user ==  video owner
     let updatedVideo ;
     if(req.user.id === video.user.id){
         updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            {
                $set : req.body ,
            },
            {new : true}
        )
     }
     res.status(200).json(updatedVideo)
    } catch (error) {
      throw(error)
    }
}

//3.delete Video
export const deleteVideo =async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("The video has been deleted.");
          } else {
            return next(createError(403, "You can delete only your video!"));
          }
          res.status(200).json("The video has been deleted")
    } catch (error) {
      throw(error)
    }
  }

  
//4.get VideobyId
export const getVideo =async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);    
    } catch (error) {
      throw(error)
    }
  }


//5.putView byId   
export const addView = async (req,res,next)=>{
    try {
        const video = await Video.findByIdAndUpdate(req.params.id,
            {
                $inc : { views : 1}
            });
        res.status(200).json(video);
    } catch (error) {
      throw(error)
    }
  }

//6.Trending Video
export const trend =async (req,res,next)=>{
    try {
      const videos = await await Video.find().sort({ views: -1})
      return res.status(200).json(videos)
    } catch (error) {
      throw(error)
    }
  }
  
//7.random Video
export const random =async (req,res,next)=>{
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
    } catch (error) {
      throw(error)
    }
  }

//8.subscribed Videos
// show all subscribed videos to user who subscribed
export const sub =async (req,res,next)=>{
    try {
     //1. looged in =>  user.id
     const user = await User.findById(req.user.id);

     //2. from user => got subscribedUsers array 
     const subscribedChannels = await user.subscribedUsers;
     //console.log("subscribedChannels => ",subscribedChannels)
     //3. foreach subscribedUsers => compared with Videos.id
    const list = await Promise.all(
        subscribedChannels.map(async (channelId)=>{
           return await Video.find({userId: channelId})
        })
    )
    // sorted in descending order of videos
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      throw(error)
    }
  }

//9.get Video By Tag
export const getByTag = async (req, res, next) => {
    //1. tags?tags=js,py =>   
    const tags = req.query.tags.split(",");
    //console.log(tags)
    try {
    //2. find 
      const videos = await Video.find({ tags: { $in: tags } }).limit(20);
      res.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };
  
//10.search Video
export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getAllVideo = async (req,res,next)=>{
  try {
    const videos = await Video.find()
    res.status(200).json(videos)
  } catch (error) {
    next(error);
  }
}


export const test =  (req,res)=>{
    //console.log("test is working")
    res.json("Test comment is working " )
 }

