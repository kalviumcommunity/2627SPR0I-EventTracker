const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Google Login / Registration
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    // Verify Google's identity token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        message: "Google account verification failed",
      });
    }

    const { sub: googleId, name, email, picture } = payload;

    // Find existing user
    let user = await User.findOne({ googleId });

    let isNewUser = false;

    // Create account if user doesn't exist
    if (!user) {
      // Avoid accidentally linking a different Google account
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }

      user = await User.create({
        googleId,
        name,
        email,
        picture: picture || "",
      });

      isNewUser = true;
    }

    // Create a fresh session
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session error:", error);

        return res.status(500).json({
          message: "Could not create login session",
        });
      }

      req.session.userId = user._id.toString();

      req.session.save((error) => {
        if (error) {
          console.error("Session save error:", error);

          return res.status(500).json({
            message: "Could not save login session",
          });
        }

        return res.status(200).json({
          message: isNewUser
            ? "Registration successful"
            : "Login successful",
          isNewUser,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
          },
        });
      });
    });

  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
});

// Check logged-in user
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = await User.findById(req.session.userId).select(
        "name email picture createdAt"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("Session check error:", error.message);

    res.status(500).json({
      message: "Could not verify session",
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    res.clearCookie("eventtracker.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  });
});

module.exports = router;
