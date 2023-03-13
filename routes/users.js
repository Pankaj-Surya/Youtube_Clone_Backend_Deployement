import express from "express";
import {updateUser,deleteUser,subscribe,unsubscribe,like,dislike,test,getUser} from "../controllers/user.js" 
import { verifyToken } from "../verifyToken.js";

const router = express.Router();    

router.get('/test',test)
router.put('/:id',verifyToken,updateUser)
router.delete('/:id',verifyToken,deleteUser)
router.get('/find/:id',getUser)
router.put('/sub/:id',verifyToken,subscribe)
router.put('/unsub/:id',verifyToken,unsubscribe)
router.put('/like/:videoId',verifyToken,like)
router.put('/dislike/:videoId',verifyToken,dislike)



export default router;