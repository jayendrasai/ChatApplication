import express from 'express';

import authController from '../controllers/auth.controller.js';
const router = express.Router();

router.route('/login').post(authController.handleLogin);
router.route('/register').post(authController.handleRegister);
router.route('/logout').get(authController.handleLogout);
router.route('/refresh').get(authController.handleRefreshToken);


export default router;
