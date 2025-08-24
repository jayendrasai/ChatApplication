import express from 'express'
import { createChatRoom } from "../controllers/chatroom.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";


const router = express.Router();


//applying verfiyJWT middleware to this private route
router.post('/',verifyJWT,createChatRoom);
export default router;
