// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import { sendVerificationEmail } from "../utils/sendEmail.js";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// /* ================== JWT ================== */
// const generateToken = (id) => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET missing");
//   }
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

// /* ================== SIGNUP ================== */
// export const signup = async (req, res) => {
//   const { name, email, password, resend } = req.body;

//   try {
//     const userExists = await User.findOne({ email });

//     if (resend && userExists) {
//       if (userExists.isVerified) {
//         return res.status(400).json({ message: "Already verified" });
//       }

//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       userExists.otp = otp;
//       userExists.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
//       await userExists.save();
//       await sendVerificationEmail(email, otp);

//       return res.json({ success: true, message: "OTP resent" });
//     }

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await User.create({
//       name,
//       email,
//       password,
//       otp,
//       otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
//     });

//     await sendVerificationEmail(email, otp);

//     res.status(201).json({ success: true, message: "OTP sent" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================== VERIFY OTP ================== */
// export const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (
//       user.otp !== otp ||
//       !user.otpExpiresAt ||
//       user.otpExpiresAt < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save();

//     res.json({
//       success: true,
//       user: { _id: user._id.toString(), name: user.name, email: user.email },
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================== LOGIN ================== */
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!user.isVerified) {
//       return res.status(401).json({ message: "Verify email first" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({
//       success: true,
//       user: { _id: user._id.toString(), name: user.name, email: user.email },
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================== GOOGLE PASSPORT ================== */
// export const configurePassport = () => {
//   if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return;

//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
//       },
//       async (_, __, profile, done) => {
//         try {
//           let user = await User.findOne({ googleId: profile.id });

//           if (!user) {
//             user = await User.findOne({ email: profile.emails[0].value });

//             if (user) {
//               user.googleId = profile.id;
//               await user.save();
//             } else {
//               user = await User.create({
//                 name: profile.displayName,
//                 email: profile.emails[0].value,
//                 googleId: profile.id,
//                 isVerified: true,
//               });
//             }
//           }

//           done(null, user);
//         } catch (err) {
//           done(err, null);
//         }
//       }
//     )
//   );
// };

// /* ================== GOOGLE ROUTES ================== */
// export const googleAuth = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// export const googleAuthCallback = passport.authenticate("google", {
//   session: false,
//   failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
// });

// export const googleAuthSuccess = (req, res) => {
//   const token = generateToken(req.user._id);

//   const userData = encodeURIComponent(
//     JSON.stringify({
//       _id: req.user._id.toString(),
//       name: req.user.name,
//       email: req.user.email,
//     })
//   );

//   res.redirect(
//     `${process.env.CLIENT_URL}/overview?token=${token}&user=${userData}`
//   );
// };


import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

/* ================== JWT TOKEN GENERATOR ================== */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/* ================== SIGNUP ================== */
export const signup = async (req, res) => {
  const { name, email, password, resend } = req.body;

  try {
    const userExists = await User.findOne({ email });

    // Handle OTP resend
    if (resend && userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ success: false, message: "User already verified" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      userExists.otp = otp;
      userExists.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await userExists.save();
      await sendVerificationEmail(email, otp);

      return res.status(200).json({ success: true, message: "OTP resent successfully" });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendVerificationEmail(email, otp);

    res.status(201).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== VERIFY OTP ================== */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
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
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== LOGIN ================== */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified) return res.status(401).json({ success: false, message: "Please verify your email first" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.status(200).json({
      success: true,
      user: { _id: user._id.toString(), name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== PASSPORT GOOGLE ================== */
export const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials missing. Google login won't work.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async (_, __, profile, done) => {
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

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
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

/* ================== GOOGLE ROUTES ================== */
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  session: false,
  failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
});

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user_found`);
  }

  const token = generateToken(req.user._id);

  const userData = encodeURIComponent(
    JSON.stringify({
      _id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
    })
  );

  res.redirect(`${process.env.CLIENT_URL}/overview?token=${token}&user=${userData}`);
};
