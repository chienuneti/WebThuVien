# Backend Implementation Guide

## Overview

This guide provides instructions for implementing the backend API to support the Angular authentication system.

## Technology Stack (Recommended)

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **Validation**: joi or express-validator

## Installation

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-validator
npm install -D nodemon @types/express @types/node typescript
```

## Environment Variables

Create `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Database Models

### User Schema (MongoDB)

```javascript
// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide full name"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide valid email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number"],
    match: [/^(\+84|0)[0-9]{9,10}$/, "Please provide valid Vietnamese phone number"],
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username cannot exceed 20 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric and underscore"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Don't return password by default
  },
  avatar: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

## Authentication Routes

### Basic Setup

```javascript
// routes/auth.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Helper function to create tokens
const createTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

  return { accessToken, refreshToken };
};

// Validation middleware
const validateRegister = [
  body("fullName").trim().isLength({ min: 3, max: 100 }).withMessage("Full name must be 3-100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide valid email"),
  body("phoneNumber")
    .matches(/^(\+84|0)[0-9]{9,10}$/)
    .withMessage("Please provide valid Vietnamese phone number"),
  body("username")
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must be 3-20 alphanumeric/underscore"),
  body("password")
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage("Password must contain uppercase, lowercase, number, special char (@$!%*?&)"),
];

// REGISTER ENDPOINT
router.post("/register", validateRegister, async (req, res) => {
  try {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation error",
        errors: errors.array().reduce((acc, err) => {
          acc[err.param] = [err.msg];
          return acc;
        }, {}),
      });
    }

    // Check if user exists
    const { fullName, email, phoneNumber, username, password } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      const errors = {};
      if (user.email === email) errors.email = ["Email already registered"];
      if (user.username === username) errors.username = ["Username already exists"];

      return res.status(409).json({
        success: false,
        message: "User already exists",
        errors,
      });
    }

    // Create user
    user = new User({
      fullName,
      email,
      phoneNumber,
      username,
      password,
    });

    await user.save();

    // Create tokens
    const { accessToken, refreshToken } = createTokens(user._id);

    // Return response (don't include password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userResponse,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// LOGIN ENDPOINT
router.post("/login", [body("username").notEmpty().withMessage("Username is required"), body("password").notEmpty().withMessage("Password is required")], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation error",
        errors: errors.array().reduce((acc, err) => {
          acc[err.param] = [err.msg];
          return acc;
        }, {}),
      });
    }

    const { username, password } = req.body;

    // Find user (including password field)
    const user = await User.findOne({
      $or: [{ email: username }, { username }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create tokens
    const { accessToken, refreshToken } = createTokens(user._id);

    // Return response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GOOGLE LOGIN ENDPOINT (Example)
router.post("/google-login", async (req, res) => {
  try {
    // Note: This is a simplified example
    // In production, verify the token with Google's API
    const { googleToken } = req.body;

    // TODO: Verify token with Google
    // const decodedToken = await verifyGoogleToken(googleToken);

    // For now, return placeholder
    res.status(501).json({
      success: false,
      message: "Google login not implemented yet",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
```

## Middleware

### Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = auth;
```

## Server Setup

```javascript
// server.js or index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
  }),
);

// Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Additional Endpoints to Implement

### Profile Endpoint

```javascript
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      success: true,
      message: "Profile retrieved",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Refresh Token Endpoint

```javascript
router.post("/refresh-token", (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});
```

## Next Steps

1. **Database Setup**: Install and run MongoDB locally or use MongoDB Atlas
2. **Frontend Integration**: Update `auth.service.ts` with your backend URL
3. **Google OAuth**: Implement Google OAuth verification (use `google-auth-library`)
4. **Rate Limiting**: Add `express-rate-limit` to prevent abuse
5. **Email Verification**: Add nodemailer for email confirmation
6. **Password Reset**: Implement forgot password flow
7. **Logging**: Add winston or morgan for request logging
8. **Testing**: Write tests with Jest or Mocha

## Example Startup Script (package.json)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

Run development: `npm run dev`
