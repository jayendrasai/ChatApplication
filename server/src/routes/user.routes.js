import express from 'express'
import { searchUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";


const router = express.Router();


//applying verfiyJWT middleware to this private route
router.get('/search',verifyJWT,searchUsers);
export default router;
