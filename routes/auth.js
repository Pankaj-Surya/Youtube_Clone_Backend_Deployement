import express from "express";
import {signin,signup,googleAuth,refresh} from "../controllers/auth.js"
const router= express.Router()

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/google',googleAuth)
router.post('/refresh',refresh)

export default router