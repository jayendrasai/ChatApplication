import express from 'express';
// Make sure to import getChatRooms
import { createChatRoom, getChatRooms , getChatMessages , markChatAsRead } from '../controllers/chatroom.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

const router = express.Router();

// Route to create a new chat room (already exists)
router.post('/', verifyJWT, createChatRoom);

// Route to get all of the user's chat rooms (new)
router.get('/', verifyJWT, getChatRooms);

// NEW: Route to get all messages for a specific chat room
router.get("/:chatroomId/messages", verifyJWT, getChatMessages);

router.put("/:chatroomId/read", verifyJWT, markChatAsRead);

export default router;