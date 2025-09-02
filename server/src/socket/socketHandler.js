import { Server } from "socket.io";
import JWT from 'jsonwebtoken';
import { saveMessage } from "../controllers/message.controller.js";

export const initializeSocketServer = (server) => {
    const io = new Server(server , {
        cors:{
            origin: "http://localhost:5173",
            methods:["GET" , "POST"],
        },
    });

    io.use((socket , next ) => {
        const token = socket.handshake.auth.token;
        if(!token){
            return next(new Error("Authentication error: Token not provided"));
        }

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err , decoded) => {
            if(err){    
                 return next(new Error("Authentication error: Invalid token"));
            }
        socket.userId = decoded.userId;
        next();
        });
        
    });


    io.on("connection" , (socket) => {
      //  console.log(`User connection : ${socket.id} with user ID: ${socket.userId}`);

        socket.on("join_room" , (chatRoomId) => {
            socket.join(chatRoomId);
         //   console.log(`User ${socket.userId} joined room: ${chatRoomId}`);
        });
        socket.on("leave_room" , (chatRoomId) => {
            socket.leave(chatRoomId);
         //   console.log(`User ${socket.userId} joined room: ${chatRoomId}`);
        });

        socket.on("send_message", async (message) => {
      try {
        // Expecting: { chatroomId, encryptedText }
        if (!message?.chatroomId) {
          console.error("❌ Missing chatroomId in payload:", message);
          return;
        }
        if (typeof message.encryptedText !== "string") {
          console.error(
            "❌ encryptedText must be a stringified JSON:",
            message.encryptedText
          );
          return;
        }

        const messageData = {
          chatroomId: message.chatroomId,
          sender: socket.userId,
          encryptedText: message.encryptedText,
        };

        const savedMessage = await saveMessage(messageData);
        if (!savedMessage) return;

        // ✅ Send to everyone EXCEPT the sender
        socket.to(message.chatroomId).emit("receive_message", savedMessage);
      } catch (err) {
        console.error("🔥 Error handling message:", err);
      }
    });
        socket.on("disconnect" , ()=> {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    
    return io;
};