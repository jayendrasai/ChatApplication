import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js';
import { Server } from 'socket.io';
import { saveMessage } from './controllers/message.controller.js';
import { initializeSocketServer } from './socket/socketHandler.js';
//---Routes import-----
import authRoute from './routes/auth.routes.js'
import userRoute from './routes/user.routes.js'
import chatRoute from './routes/chat.routes.js'
//import messageRoute from './routes/message.route.js'

try{
  await connectDB();
  console.log(`db connected`)
}
catch(error) {
   console.log(`failed to connect database`,error)
   process.exit(1);
}


const app = express();
const PORT = 3000;
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:5173", // explicitly allow your frontend
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

//public routes with access Token
app.get('/', (req, res) => {
  res.send('Hello from Express with TypeScript!');
});
app.use('/api/auth' , authRoute);


// 9. SPECIAL AUTHENTICATION ROUTES (Must come BEFORE verifyJWT)
app.use('/api/users',userRoute)
app.use('/api/chatroom',chatRoute)
//app.use('/api/mesages',messageRoute)


// These routes handle authentication tasks and do not require a valid access token.


// Initialize socket server
initializeSocketServer(server);
//----listening
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

