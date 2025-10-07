import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt, {decode} from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
//import generateKeyPair from '../utilis/cryptoUtils.js'


const handleLogin = async (req , res ) => {
    // Load environment variables from a .env file
     dotenv.config({path:'../../.env'});
   const {email , password } = req.body;
   
   if(!email || !password) return res.status(403).json({message : "Invalid credentials"});

   try {
   const foundUser = await User.findOne({email : email}).exec();
   if(!foundUser) return res.status(401).json({message : "Invalid email or password"});

   const match = await bcrypt.compare(password , foundUser.password);
 
   if(match) {
   
      const accessToken = jwt.sign(
  { "username": foundUser.username, "userId": foundUser._id },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '15min' }
);

    const refreshToken = jwt.sign(
      { "username": foundUser.username, "userId": foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    foundUser.refreshToken = refreshToken;
        await foundUser.save();
        res.cookie('jwt' , refreshToken , {httpOnly: true, maxAge: 24*60*60*1000});
    
        res.json({
            accessToken,
            success: `User ${foundUser.username} logged in`
            });

   }
   else{
    return res.status(401).json({message : "Invalid password"})
   }


   }catch(error){
   
    return res.status(504).json({message:"Internal server Error"});
   }
}

const handleLogout = async (req , res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(204).json({message : "No content"})
    const refreshToken = cookies.jwt;
   // console.log(refreshToken);
    //Is refresh Token in DB
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec();
    if(!foundUser) {

        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' }); 
        res.sendStatus(204);
    }

    await User.updateOne({username : foundUser.username }, {$set : {refreshToken : ""}});
    
     res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' }); 
    res.status(204).json({success : `${foundUser.username } is logged out`});

}

// const handleRefreshToken = async (req , res) => {
//    const cookies = req.cookies;
//   // console.log(cookies)
//    if(!cookies) return res.status(401).json({message : "unAuthorized"})
//     let refreshToken = cookies.jwt;

//     try {
//         const foundUser = await User.findOne({refreshToken : refreshToken}).exec();
//         if(!foundUser) {
//             return res.status(403);
//         }
//         let decoded;
//                 try{
//                     decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);
//                 }catch(error){
//                     console.log(error)
//                     res.status(403)
//                 }
//         if(decoded.username !== foundUser.username){
         
//                 return res.sendStatus(403);
//         }
      
//         const accessToken = jwt.sign(
//             { "username": foundUser.username, "userId": foundUser._id },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '15min' }
// );

//             const refreshToken = jwt.sign(
//             { "username": foundUser.username, "userId": foundUser._id },
//             process.env.REFRESH_TOKEN_SECRET,
//             { expiresIn: "7d" }
//             );
        
//          foundUser.refreshToken = refreshToken;
//         // console.log(`refresh Token:`,refreshToken)
//         // console.log(`Access Token`,accessToken)
//         res.json({accessToken})


//     } catch (error) {
//         console.log(error);
//      res.sendStatus(500);
//     }




// }

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const oldRefreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken: oldRefreshToken }).exec();
    if (!foundUser) {
      return res.sendStatus(403); // Forbidden
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }

    if (decoded.username !== foundUser.username) {
      return res.sendStatus(403);
    }

    // Issue new tokens
    const accessToken = jwt.sign(
      { username: foundUser.username, userId: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const newRefreshToken = jwt.sign(
      { username: foundUser.username, userId: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Save new refresh token in DB
    foundUser.refreshToken = newRefreshToken;
    await foundUser.save();

    // Send new refresh token back in httpOnly cookie
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,      // set false if testing on localhost without HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in response
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const handleRegister =async (req , res) => {
   const {userName , Email  ,Password , publicKey } = req.body;
  // console.log(`sass------${Password} , ${userName,Email}`)
   if(!userName || !Password || !Email || !publicKey) return res.status(403).json({message : "Invalid credentials"});
   try {

    const duplicateUser = await User.findOne({
        username:userName,
        email:Email,
    });
   if(duplicateUser) return res.status(409).json({message : "conflict"});

   const hashedPwd =await bcrypt.hash(Password , 10)
  
    // Create a new user ID ahead of time to use in JWTs
    const newUserId = new mongoose.Types.ObjectId();


          const accessToken = jwt.sign(
  { "username": userName, "userId": newUserId },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '15min' }
);

    const refreshToken = jwt.sign(
      { "username": userName, "userId": newUserId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

   const newUser = new User({
       _id : newUserId,
        username:userName,
        email : Email,
        password : hashedPwd,
        publicKey : publicKey,
        refreshToken: refreshToken
   });
   await newUser.save();
  // console.log('newUser: '+ newUser);

   res.status(201).json({
            accessToken,
            success: `User ${newUser.username} logged in`
            });


   } catch (error) {
    console.log(error);
    return res.status(504).json({message:"Internal server Error"});
   }
   


}

export default {handleLogin , handleLogout , handleRefreshToken , handleRegister};