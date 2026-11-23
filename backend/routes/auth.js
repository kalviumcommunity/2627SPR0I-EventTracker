const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const { pool } = require("../config/db");

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

    const {
      sub: googleId,
      name,
      email,
      picture,
    } = payload;

    // Find existing user using Google ID
    const existingUser = await pool.query(
      `SELECT id, name, email, picture
       FROM users
       WHERE google_id = $1`,
      [googleId]
    );

    let user;
    let isNewUser = false;

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      // Prevent linking a different Google account to an existing email
      const existingEmail = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }

      // Create new user
      const result = await pool.query(
        `INSERT INTO users (google_id, name, email, picture)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, picture`,
        [googleId, name, email, picture || ""]
      );

      user = result.rows[0];
      isNewUser = true;
    }

    // Create a fresh login session
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session error:", error);

        return res.status(500).json({
          message: "Could not create login session",
        });
      }

      req.session.userId = user.id;

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
            id: user.id,
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

    const result = await pool.query(
      `SELECT id, name, email, picture, created_at
       FROM users
       WHERE id = $1`,
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Session check error:", error.message);

    return res.status(500).json({
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

    return res.status(200).json({
      message: "Logged out successfully",
    });
  });
});

module.exports = router;
