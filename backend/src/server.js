import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import connectDB from "./config/db.js";
import authRoutes from "./routers/authRoutes.js";
import { configurePassport } from "./controller/authController.js";

dotenv.config();
connectDB();

const app = express();

/* =========================
   CORS (EXPRESS 5 SAFE)
   ========================= */
const corsOptions = {
  origin: "https://autho-1.onrender.com",
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ FIX: regex instead of "*"
app.options(/.*/, cors(corsOptions));

/* =========================
   Body parsers
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Session
   ========================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "render_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

/* =========================
   Passport
   ========================= */
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   Routes
   ========================= */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running fine 🚀");
});

/* =========================
   Error handler
   ========================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =========================
   Start server
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
