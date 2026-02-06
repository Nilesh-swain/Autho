import express from "express";
import {
  signup,
  login,
  verifyOtp,
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
} from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, googleAuthSuccess);

export default router;
