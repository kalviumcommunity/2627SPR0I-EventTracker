const express = require("express");
const crypto = require("crypto");
const { pool } = require("../config/db");

const router = express.Router();

// Validate PostgreSQL UUIDs before querying.
function isValidUUID(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

// Generate a six-character uppercase invitation code.
function generateInviteCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// CREATE A BOARD
router.post("/create", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Please log in to create a board.",
    });
  }

  const { name, date, location } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Event name is required.",
    });
  }

  let boardDate = null;

  if (date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid event date.",
      });
    }

    boardDate = parsedDate.toISOString().slice(0, 10);
  }

  let attempts = 0;

  while (attempts < 5) {
    attempts++;

    const client = await pool.connect();

    try {
      const inviteCode = generateInviteCode();

      await client.query("BEGIN");

      const boardResult = await client.query(
        `INSERT INTO boards (name, date, location, invite_code, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, date, location, invite_code, created_by`,
        [
          name.trim(),
          boardDate,
          location?.trim() || "",
          inviteCode,
          req.session.userId,
        ]
      );

      const board = boardResult.rows[0];

      // Add the creator as an organiser in this board.
      await client.query(
        `INSERT INTO board_members (board_id, user_id, role)
         VALUES ($1, $2, $3)`,
        [board.id, req.session.userId, "organiser"]
      );

      await client.query("COMMIT");

      return res.status(201).json({
        message: "Board created successfully!",
        board: {
          id: board.id,
          name: board.name,
          date: board.date,
          location: board.location,
          inviteCode: board.invite_code,
          createdBy: board.created_by,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");

      // Retry only if the invitation code collided with an existing one.
      if (
        error.code === "23505" &&
        error.constraint === "boards_invite_code_key"
      ) {
        continue;
      }

      console.error("Create board error:", error);

      return res.status(500).json({
        message: "Something went wrong while creating the board.",
      });
    } finally {
      client.release();
    }
  }

  return res.status(500).json({
    message: "Could not generate a unique invitation code.",
  });
});

// JOIN A BOARD
router.post("/join", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to join a board.",
      });
    }

    const { inviteCode } = req.body;

    if (!inviteCode || !inviteCode.trim()) {
      return res.status(400).json({
        message: "Invitation code is required.",
      });
    }

    const boardResult = await pool.query(
      `SELECT id
       FROM boards
       WHERE invite_code = $1`,
      [inviteCode.trim().toUpperCase()]
    );

    if (boardResult.rows.length === 0) {
      return res.status(404).json({
        message: "No board found with this invitation code.",
      });
    }

    const boardId = boardResult.rows[0].id;

    // ON CONFLICT handles duplicate joins safely, including simultaneous requests.
    const membershipResult = await pool.query(
      `INSERT INTO board_members (board_id, user_id, role)
       VALUES ($1, $2, 'volunteer')
       ON CONFLICT (board_id, user_id) DO NOTHING
       RETURNING id`,
      [boardId, req.session.userId]
    );

    const alreadyMember = membershipResult.rows.length === 0;

    return res.status(200).json({
      message: alreadyMember
        ? "You are already a member of this board."
        : "You have successfully joined the board!",
      boardId,
      alreadyMember,
    });
  } catch (error) {
    console.error("Join board error:", error);

    return res.status(500).json({
      message: "Something went wrong while joining the board.",
    });
  }
});

// GET ALL BOARDS BELONGING TO THE LOGGED-IN USER
router.get("/my-boards", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to view your boards.",
      });
    }

    const result = await pool.query(
      `SELECT
         b.id,
         b.name,
         b.date,
         b.location,
         bm.role,
         b.created_at
       FROM boards b
       INNER JOIN board_members bm ON bm.board_id = b.id
       WHERE bm.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.session.userId]
    );

    return res.status(200).json({
      boards: result.rows.map((board) => ({
        id: board.id,
        name: board.name,
        date: board.date,
        location: board.location,
        role: board.role,
        createdAt: board.created_at,
      })),
    });
  } catch (error) {
    console.error("Fetch my boards error:", error);

    return res.status(500).json({
      message: "Could not fetch your boards.",
    });
  }
});

// GET DETAILS OF A PARTICULAR BOARD
router.get("/:boardId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to view this board.",
      });
    }

    const { boardId } = req.params;

    if (!isValidUUID(boardId)) {
      return res.status(400).json({
        message: "Invalid board ID.",
      });
    }

    // Fetch the board and its creator's profile.
    const boardResult = await pool.query(
      `SELECT
         b.id,
         b.name,
         b.date,
         b.location,
         b.invite_code,
         b.created_at,
         u.id AS creator_id,
         u.name AS creator_name,
         u.email AS creator_email,
         u.picture AS creator_picture
       FROM boards b
       INNER JOIN users u ON u.id = b.created_by
       WHERE b.id = $1`,
      [boardId]
    );

    if (boardResult.rows.length === 0) {
      return res.status(404).json({
        message: "Board not found.",
      });
    }

    const board = boardResult.rows[0];

    // Check whether the current user belongs to this board.
    const membershipResult = await pool.query(
      `SELECT role
       FROM board_members
       WHERE board_id = $1 AND user_id = $2`,
      [boardId, req.session.userId]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(403).json({
        message: "You are not a member of this board.",
      });
    }

    const currentUserRole = membershipResult.rows[0].role;

    // Fetch member profiles for this board.
    const membersResult = await pool.query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.picture,
         bm.role,
         bm.joined_at
       FROM board_members bm
       INNER JOIN users u ON u.id = bm.user_id
       WHERE bm.board_id = $1
       ORDER BY bm.joined_at ASC`,
      [boardId]
    );

    const boardDetails = {
      id: board.id,
      name: board.name,
      date: board.date,
      location: board.location,
      createdBy: {
        id: board.creator_id,
        name: board.creator_name,
        email: board.creator_email,
        picture: board.creator_picture,
      },
      members: membersResult.rows.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        picture: member.picture,
        role: member.role,
        joinedAt: member.joined_at,
      })),
      createdAt: board.created_at,
    };

    // Only organisers can see the invitation code.
    if (currentUserRole === "organiser") {
      boardDetails.inviteCode = board.invite_code;
    }

    return res.status(200).json({
      board: boardDetails,
      currentUserRole,
    });
  } catch (error) {
    console.error("Fetch board details error:", error);

    return res.status(500).json({
      message: "Could not fetch board details.",
    });
  }
});

module.exports = router;
