// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import passport from "passport";
// import session from "express-session";

// import connectDB from "./config/db.js";
// import authRoutes from "./routers/authRoutes.js";
// import { configurePassport } from "./controller/authController.js";

// dotenv.config();
// connectDB();

// const app = express();

// /* =========================
//    CORS (PRODUCTION SAFE)
//    ========================= */
// const allowedOrigins = [
//   "http://localhost:5173",           // dev frontend
//   "https://autho-1.onrender.com",    // deployed frontend
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     // allow requests with no origin (like Postman)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// // Apply CORS
// app.use(cors(corsOptions));

// // Preflight requests
// app.options("*", cors(corsOptions));

// /* =========================
//    Body parsers
//    ========================= */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* =========================
//    Session
//    ========================= */
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "render_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // HTTPS only in prod
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     },
//   })
// );

// /* =========================
//    Passport
//    ========================= */
// configurePassport();
// app.use(passport.initialize());
// app.use(passport.session());

// /* =========================
//    Routes
//    ========================= */
// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend running fine 🚀");
// });

// /* =========================
//    Error handler
//    ========================= */
// app.use((err, req, res, next) => {
//   console.error("Server Error:", err.message);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// /* =========================
//    Start server
//    ========================= */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import connectDB from "./config/db.js";
import authRoutes from "./routers/authRoutes.js";
import { configurePassport } from "./controller/authController.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/* =========================
   CORS CONFIGURATION
   ========================= */
const allowedOrigins = [
  "http://localhost:5173",           // Local dev frontend
  "https://autho-1.onrender.com",    // Deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman or mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Error: Not allowed by origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS globally
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

/* =========================
   BODY PARSERS
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   SESSION CONFIGURATION
   ========================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "render_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

/* =========================
   PASSPORT
   ========================= */
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
