const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: null,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    // Unique invitation code for joining this board
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // User who created the board
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Users who belong to this board
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["organiser", "volunteer"],
          required: true,
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Board", boardSchema);
