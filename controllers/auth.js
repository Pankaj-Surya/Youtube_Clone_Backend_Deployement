import mongoose from "mongoose"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createError } from "../error.js"

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const newUser = await User({ ...req.body, password: hash })
    await newUser.save()
    res.status(200).send("User created successfully")
  } catch (error) {
    next(error)
  }
}


export const signin = async (req, res, next) => {
  try {
    // username and password from req.body
    console.log(req.body.name, req.body.password)
    const user = await User.findOne({ name: req.body.name })
    //console.log(user)
    if (!user) return next(createError(404, "User not found"))

    const isCorrect = await bcrypt.compare(req.body.password, user.password)

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token  = jwt.sign({ id: user._id }, process.env.JWT,{ expiresIn: '1d' })

   //Generate an access token
  
   const { password, ...others } = user._doc;

    // send cookies
    res.cookie("access_token",token,{httpOnly:true}).status(200).json({others,access_token : token })
  } catch (error) {
    next(error)
  }
}

export const googleAuth = async (req, res, next) => {
  try {
    //1. find user
    const user = await User.findOne({ email : req.body.email })
    //console.log("user",user)
    //2. if exists send cookie else create user
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({others : user._doc,access_token:token });
      
    } else {
      const newUser = await new User({
        ...req.body,
        fromGoogle: true,
      })

      const savedUser = await newUser.save();
      //console.log(savedUser)

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
  
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({others : savedUser._doc,access_token:token });
      }

  } catch (error) {
  next(error)
}
}

let refreshTokens = [];

export const refresh =async   (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //console.log("refresh token: " + refreshToken)
  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  // if (!refreshTokens.includes(refreshToken)) {
  //   return res.status(403).json("Refresh token is not valid!");
  // }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    console.log("user",user)
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, "myRefreshSecretKey");
};