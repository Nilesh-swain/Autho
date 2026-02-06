import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env");
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// --- 1. SIGNUP / LOGIN / OTP ---
export const signup = async (req, res) => {
  const { name, email, password, resend } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (resend && userExists) {
      if (userExists.isVerified)
        return res.status(400).json({ message: "Already verified." });
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      userExists.otp = otp;
      userExists.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await userExists.save();
      await sendVerificationEmail(email, otp);
      return res.status(200).json({ success: true, message: "New OTP sent." });
    }

    if (!name || !email || !password)
      return res.status(400).json({ message: "Fields missing" });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await User.create({
      name,
      email,
      password,
      otp,
      otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendVerificationEmail(email, otp);
    res.status(201).json({ success: true, message: "OTP Sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      user: { _id: user._id.toString(), name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      if (!user.isVerified)
        return res.status(401).json({ message: "Verify email first" });
      res.json({
        success: true,
        user: { _id: user._id.toString(), name: user.name, email: user.email },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. PASSPORT / GOOGLE CONFIGURATION ---
export const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️ Google Credentials missing. Google Auth will not work.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                isVerified: true,
              });
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

// --- 3. GOOGLE AUTH HANDLERS ---
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "http://localhost:5173/login?error=auth_failed",
  session: false,
});

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect("http://localhost:5173/login?error=no_user_found");
  }

  const token = generateToken(req.user._id);

  // FIX: Force _id to be a string to prevent JSON parsing errors on frontend
  const userData = {
    _id: req.user._id.toString(),
    name: req.user.name,
    email: req.user.email,
  };

  const userQuery = encodeURIComponent(JSON.stringify(userData));

  res.redirect(
    `http://localhost:5173/overview?token=${token}&user=${userQuery}`,
  );
};
