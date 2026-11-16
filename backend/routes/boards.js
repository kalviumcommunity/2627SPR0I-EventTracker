
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Board = require("../models/Board");

const router = express.Router();

// Generate a unique invitation code
function generateInviteCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// CREATE A BOARD
router.post("/create", async (req, res) => {
  try {
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
      boardDate = new Date(date);

      if (Number.isNaN(boardDate.getTime())) {
        return res.status(400).json({
          message: "Please provide a valid event date.",
        });
      }
    }

    let board;
    let attempts = 0;

    while (attempts < 5) {
      attempts++;

      const inviteCode = generateInviteCode();

      try {
        board = await Board.create({
          name: name.trim(),
          date: boardDate,
          location: location?.trim() || "",
          inviteCode,
          createdBy: req.session.userId,
          members: [
            {
              user: req.session.userId,
              role: "organiser",
            },
          ],
        });

        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.inviteCode) {
          continue;
        }

        throw error;
      }
    }

    if (!board) {
      return res.status(500).json({
        message: "Could not generate a unique invitation code.",
      });
    }

    return res.status(201).json({
      message: "Board created successfully!",
      board: {
        id: board._id,
        name: board.name,
        date: board.date,
        location: board.location,
        inviteCode: board.inviteCode,
        createdBy: board.createdBy,
      },
    });
  } catch (error) {
    console.error("Create board error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the board.",
    });
  }
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

    const board = await Board.findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
    });

    if (!board) {
      return res.status(404).json({
        message: "No board found with this invitation code.",
      });
    }

    const alreadyMember = board.members.some(
      (member) => member.user.toString() === req.session.userId
    );

    if (alreadyMember) {
      return res.status(200).json({
        message: "You are already a member of this board.",
        boardId: board._id,
        alreadyMember: true,
      });
    }

    board.members.push({
      user: req.session.userId,
      role: "volunteer",
    });

    await board.save();

    return res.status(200).json({
      message: "You have successfully joined the board!",
      boardId: board._id,
      alreadyMember: false,
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

    const boards = await Board.find({
      "members.user": req.session.userId,
    })
      .select("name date location createdBy members createdAt")
      .sort({ createdAt: -1 });

    const myBoards = boards.map((board) => {
      const membership = board.members.find(
        (member) => member.user.toString() === req.session.userId
      );

      return {
        id: board._id,
        name: board.name,
        date: board.date,
        location: board.location,
        role: membership.role,
        createdAt: board.createdAt,
      };
    });

    return res.status(200).json({
      boards: myBoards,
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

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        message: "Invalid board ID.",
      });
    }

    const board = await Board.findById(boardId)
      .populate("createdBy", "name email picture")
      .populate("members.user", "name email picture");

    if (!board) {
      return res.status(404).json({
        message: "Board not found.",
      });
    }

    // Verify board membership
    const membership = board.members.find(
      (member) => member.user._id.toString() === req.session.userId
    );

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this board.",
      });
    }

    const isOrganiser = membership.role === "organiser";

    const boardDetails = {
      id: board._id,
      name: board.name,
      date: board.date,
      location: board.location,
      createdBy: board.createdBy,
      members: board.members.map((member) => ({
        id: member.user._id,
        name: member.user.name,
        email: member.user.email,
        picture: member.user.picture,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      createdAt: board.createdAt,
    };

    // Only organisers can see the invitation code
    if (isOrganiser) {
      boardDetails.inviteCode = board.inviteCode;
    }

    return res.status(200).json({
      board: boardDetails,
      currentUserRole: membership.role,
    });
  } catch (error) {
    console.error("Fetch board details error:", error);

    return res.status(500).json({
      message: "Could not fetch board details.",
    });
  }
});

module.exports = router;
