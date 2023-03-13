import express from "express";
import {test,addVideo,updateVideo,deleteVideo,getVideo,addView,trend,random,sub,getByTag,search, getAllVideo} from "../controllers/video.js"
import { verifyToken } from "../verifyToken.js";

const router = express.Router()

router.get('/', test)
router.post('/',verifyToken,addVideo)
router.put('/:id',verifyToken,updateVideo)
router.delete('/:id',verifyToken,deleteVideo)
router.get('/sub/:token',verifyToken,sub)
router.get('/find/:id',getVideo)
router.put('/view/:id',addView)
router.get('/trend/:token',trend)
router.get('/random/:token',random)
router.get('/tags',getByTag)
router.get('/search',search)
router.get('/allVideos',getAllVideo)


export default router