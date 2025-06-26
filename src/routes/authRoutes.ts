import express from "express"
import {validateRequestOTP, validateVerifyOTP, checkValidationResult } from "../middleware/validate"
import AuthController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Define routes
router.post('/request-otp', validateRequestOTP, checkValidationResult, AuthController.requestOTP);
router.post('/verify-otp', validateVerifyOTP, checkValidationResult, AuthController.verifyOTP);
router.get('/profile', requireAuth, AuthController.getProfile);

export default router;