const express = require("express");
const mongoose = require("mongoose");
const Board = require("../models/Board");
const Duty = require("../models/Duty");

const router = express.Router();
const STATUSES = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

function getDueDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  return value < today ? null : date;
}

async function findMembership(boardId, userId) {
  const board = await Board.findById(boardId).select("name members");
  if (!board) {
    return { error: { status: 404, message: "Board not found." } };
  }

  const membership = board.members.find(
    (member) => member.user.toString() === userId
  );
  if (!membership) {
    return { error: { status: 403, message: "You are not a member of this board." } };
  }

  return { board, membership };
}

function serializeDuty(duty, currentUserRole, currentUserId) {
  const assignedVolunteerId =
    duty.assignedVolunteer?._id || duty.assignedVolunteer;

  return {
    id: duty._id,
    boardId: duty.board._id || duty.board,
    boardName: duty.board.name,
    createdBy: duty.createdBy,
    currentUserRole,
    canEdit:
      currentUserRole === "organiser" ||
      (currentUserRole === "volunteer" &&
        assignedVolunteerId?.toString() === currentUserId),
    canDelete: currentUserRole === "organiser",
    title: duty.title,
    description: duty.description,
    assignedVolunteer: duty.assignedVolunteer,
    dueDate: duty.dueDate,
    status: duty.status,
    priority: duty.priority,
    createdAt: duty.createdAt,
    updatedAt: duty.updatedAt,
  };
}

function validateDutyFields(body, partial = false, existingDueDate = null) {
  const fields = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

  if (!partial || has("title")) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "Duty title is required." };
    }
    if (body.title.trim().length > 120) {
      return { error: "Duty title must be 120 characters or fewer." };
    }
    fields.title = body.title.trim();
  }

  if (!partial || has("description")) {
    if (typeof body.description !== "string" || !body.description.trim()) {
      return { error: "Duty description is required." };
    }
    if (body.description.trim().length > 3000) {
      return { error: "Duty description must be 3000 characters or fewer." };
    }
    fields.description = body.description.trim();
  }

  if (!partial || has("dueDate")) {
    const dueDate = getDueDate(body.dueDate);
    if (!dueDate) {
      const unchangedExistingDate =
        existingDueDate &&
        body.dueDate === existingDueDate.toISOString().slice(0, 10);
      if (!unchangedExistingDate) {
        return { error: "Choose a valid due date that is today or later." };
      }
      fields.dueDate = existingDueDate;
    } else {
      fields.dueDate = dueDate;
    }
  }

  if (!partial || has("status")) {
    if (!STATUSES.includes(body.status)) {
      return { error: "Choose a valid duty status." };
    }
    fields.status = body.status;
  }

  if (!partial || has("priority")) {
    if (!PRIORITIES.includes(body.priority)) {
      return { error: "Choose a valid duty priority." };
    }
    fields.priority = body.priority;
  }

  if (!partial || has("assignedVolunteerId")) {
    if (!mongoose.Types.ObjectId.isValid(body.assignedVolunteerId)) {
      return { error: "Choose a valid volunteer from this board." };
    }
    fields.assignedVolunteerId = body.assignedVolunteerId;
  }

  return { fields };
}

async function validateVolunteer(board, volunteerId) {
  const member = board.members.find(
    (item) => item.user.toString() === volunteerId && item.role === "volunteer"
  );
  return Boolean(member);
}

// List duties for a board. Any current board member may view them.
router.get("/boards/:boardId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Please log in to view duties." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board ID." });
    }

    const access = await findMembership(req.params.boardId, req.session.userId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }

    const duties = await Duty.find({ board: access.board._id })
      .populate("assignedVolunteer", "name email picture")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      duties: duties.map((duty) =>
        serializeDuty(duty, access.membership.role, req.session.userId)
      ),
    });
  } catch (error) {
    console.error("Fetch board duties error:", error);
    return res.status(500).json({ message: "Could not fetch board duties." });
  }
});

// Create a duty. Only the board organiser can create one.
router.post("/boards/:boardId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Please log in to create a duty." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board ID." });
    }

    const access = await findMembership(req.params.boardId, req.session.userId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }
    if (access.membership.role !== "organiser") {
      return res.status(403).json({ message: "Only the board organiser can create duties." });
    }

    const validated = validateDutyFields(req.body || {});
    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }
    if (!(await validateVolunteer(access.board, validated.fields.assignedVolunteerId))) {
      return res.status(400).json({ message: "The assigned volunteer must be a member of this board." });
    }

    const { assignedVolunteerId, ...fields } = validated.fields;
    const duty = await Duty.create({
      board: access.board._id,
      assignedVolunteer: assignedVolunteerId,
      createdBy: req.session.userId,
      ...fields,
    });
    await duty.populate("assignedVolunteer", "name email picture");

    return res.status(201).json({
      message: "Duty created successfully.",
      duty: serializeDuty(
        { ...duty.toObject(), board: access.board },
        access.membership.role,
        req.session.userId
      ),
    });
  } catch (error) {
    console.error("Create duty error:", error);
    return res.status(500).json({ message: "Could not create duty." });
  }
});

// Fetch one duty. Only members of its board may view it.
router.get("/:dutyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Please log in to view this duty." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.dutyId)) {
      return res.status(400).json({ message: "Invalid duty ID." });
    }

    const duty = await Duty.findById(req.params.dutyId)
      .populate("board", "name")
      .populate("assignedVolunteer", "name email picture");
    if (!duty) {
      return res.status(404).json({ message: "Duty not found." });
    }

    const access = await findMembership(duty.board._id, req.session.userId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }
    return res.status(200).json({
      duty: serializeDuty(duty, access.membership.role, req.session.userId),
    });
  } catch (error) {
    console.error("Fetch duty error:", error);
    return res.status(500).json({ message: "Could not fetch duty." });
  }
});

// Organisers may edit any board duty; volunteers may edit their own description and status.
router.put("/:dutyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Please log in to update this duty." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.dutyId)) {
      return res.status(400).json({ message: "Invalid duty ID." });
    }

    const duty = await Duty.findById(req.params.dutyId);
    if (!duty) {
      return res.status(404).json({ message: "Duty not found." });
    }
    const access = await findMembership(duty.board, req.session.userId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }
    const isOrganiser = access.membership.role === "organiser";
    const isAssignedVolunteer =
      access.membership.role === "volunteer" &&
      duty.assignedVolunteer.toString() === req.session.userId;
    if (!isOrganiser && !isAssignedVolunteer) {
      return res.status(403).json({ message: "You cannot update this duty." });
    }

    const body = req.body || {};
    if (
      isAssignedVolunteer &&
      Object.keys(body).some((field) => !["description", "status"].includes(field))
    ) {
      return res.status(403).json({
        message: "Volunteers may only update their assigned duty's description and status.",
      });
    }
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Provide at least one duty field to update." });
    }

    const validated = validateDutyFields(body, true, duty.dueDate);
    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }
    if (
      validated.fields.assignedVolunteerId &&
      !(await validateVolunteer(access.board, validated.fields.assignedVolunteerId))
    ) {
      return res.status(400).json({ message: "The assigned volunteer must be a member of this board." });
    }

    const { assignedVolunteerId, ...updates } = validated.fields;
    Object.assign(duty, updates);
    if (assignedVolunteerId) {
      duty.assignedVolunteer = assignedVolunteerId;
    }
    await duty.save();
    await duty.populate("assignedVolunteer", "name email picture");

    return res.status(200).json({
      message: "Duty updated successfully.",
      duty: serializeDuty(
        { ...duty.toObject(), board: access.board },
        access.membership.role,
        req.session.userId
      ),
    });
  } catch (error) {
    console.error("Update duty error:", error);
    return res.status(500).json({ message: "Could not update duty." });
  }
});

// Delete a duty. Only the board organiser can delete it.
router.delete("/:dutyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Please log in to delete this duty." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.dutyId)) {
      return res.status(400).json({ message: "Invalid duty ID." });
    }

    const duty = await Duty.findById(req.params.dutyId);
    if (!duty) {
      return res.status(404).json({ message: "Duty not found." });
    }
    const access = await findMembership(duty.board, req.session.userId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }
    if (access.membership.role !== "organiser") {
      return res.status(403).json({ message: "Only the board organiser can delete duties." });
    }

    await duty.deleteOne();
    return res.status(200).json({ message: "Duty deleted successfully." });
  } catch (error) {
    console.error("Delete duty error:", error);
    return res.status(500).json({ message: "Could not delete duty." });
  }
});

module.exports = router;
