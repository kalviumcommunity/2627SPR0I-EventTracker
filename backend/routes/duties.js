const express = require("express");
const { pool } = require("../config/db");

const {
  isValidUUID,
  validateDutyFields,
} = require("../utils/dutyValidation");

const router = express.Router();

async function findMembership(boardId, userId) {
  const result = await pool.query(
    `SELECT
       b.id,
       b.name,
       bm.role
     FROM boards b
     JOIN board_members bm ON bm.board_id = b.id
     WHERE b.id = $1 AND bm.user_id = $2`,
    [boardId, userId]
  );

  if (result.rows.length === 0) {
    const boardResult = await pool.query(
      "SELECT id FROM boards WHERE id = $1",
      [boardId]
    );

    if (boardResult.rows.length === 0) {
      return {
        error: { status: 404, message: "Board not found." },
      };
    }

    return {
      error: {
        status: 403,
        message: "You are not a member of this board.",
      },
    };
  }

  return {
    board: result.rows[0],
    membership: { role: result.rows[0].role },
  };
}

async function validateVolunteer(boardId, volunteerId) {
  const result = await pool.query(
    `SELECT 1
     FROM board_members
     WHERE board_id = $1
       AND user_id = $2
       AND role = 'volunteer'`,
    [boardId, volunteerId]
  );

  return result.rows.length > 0;
}

function serializeDuty(duty, currentUserRole, currentUserId) {
  return {
    id: duty.id,
    boardId: duty.board_id,
    boardName: duty.board_name,
    createdBy: duty.created_by,
    currentUserRole,
    canEdit:
      currentUserRole === "organiser" ||
      (currentUserRole === "volunteer" &&
        duty.assigned_volunteer_id === currentUserId),
    canDelete: currentUserRole === "organiser",
    title: duty.title,
    description: duty.description,
    assignedVolunteer: {
      id: duty.assigned_volunteer_id,
      name: duty.volunteer_name,
      email: duty.volunteer_email,
      picture: duty.volunteer_picture,
    },
    dueDate: duty.due_date,
    status: duty.status,
    priority: duty.priority,
    createdAt: duty.created_at,
    updatedAt: duty.updated_at,
  };
}

async function getDutyDetails(dutyId) {
  const result = await pool.query(
    `SELECT
       d.*,
       b.name AS board_name,
       u.name AS volunteer_name,
       u.email AS volunteer_email,
       u.picture AS volunteer_picture
     FROM duties d
     JOIN boards b ON b.id = d.board_id
     JOIN users u ON u.id = d.assigned_volunteer_id
     WHERE d.id = $1`,
    [dutyId]
  );

  return result.rows[0] || null;
}

// List duties for a board. Any current board member may view them.
router.get("/boards/:boardId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to view duties.",
      });
    }

    const { boardId } = req.params;

    if (!isValidUUID(boardId)) {
      return res.status(400).json({ message: "Invalid board ID." });
    }

    const access = await findMembership(boardId, req.session.userId);

    if (access.error) {
      return res
        .status(access.error.status)
        .json({ message: access.error.message });
    }

    const result = await pool.query(
      `SELECT
         d.*,
         b.name AS board_name,
         u.name AS volunteer_name,
         u.email AS volunteer_email,
         u.picture AS volunteer_picture
       FROM duties d
       JOIN boards b ON b.id = d.board_id
       JOIN users u ON u.id = d.assigned_volunteer_id
       WHERE d.board_id = $1
       ORDER BY d.created_at DESC`,
      [boardId]
    );

    return res.status(200).json({
      duties: result.rows.map((duty) =>
        serializeDuty(duty, access.membership.role, req.session.userId)
      ),
    });
  } catch (error) {
    console.error("Fetch board duties error:", error);

    return res.status(500).json({
      message: "Could not fetch board duties.",
    });
  }
});

// Create a duty. Only the board organiser can create one.
router.post("/boards/:boardId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to create a duty.",
      });
    }

    const { boardId } = req.params;

    if (!isValidUUID(boardId)) {
      return res.status(400).json({ message: "Invalid board ID." });
    }

    const access = await findMembership(boardId, req.session.userId);

    if (access.error) {
      return res
        .status(access.error.status)
        .json({ message: access.error.message });
    }

    if (access.membership.role !== "organiser") {
      return res.status(403).json({
        message: "Only the board organiser can create duties.",
      });
    }

    const validated = validateDutyFields(req.body || {});

    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }

    const {
      assignedVolunteerId,
      ...fields
    } = validated.fields;

    if (!(await validateVolunteer(boardId, assignedVolunteerId))) {
      return res.status(400).json({
        message: "The assigned volunteer must be a member of this board.",
      });
    }

    const result = await pool.query(
      `INSERT INTO duties (
         board_id,
         assigned_volunteer_id,
         created_by,
         title,
         description,
         due_date,
         status,
         priority
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        boardId,
        assignedVolunteerId,
        req.session.userId,
        fields.title,
        fields.description,
        fields.dueDate,
        fields.status,
        fields.priority,
      ]
    );

    const duty = await getDutyDetails(result.rows[0].id);

    return res.status(201).json({
      message: "Duty created successfully.",
      duty: serializeDuty(
        duty,
        access.membership.role,
        req.session.userId
      ),
    });
  } catch (error) {
    console.error("Create duty error:", error);

    return res.status(500).json({
      message: "Could not create duty.",
    });
  }
});

// Fetch one duty. Only members of its board may view it.
router.get("/:dutyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to view this duty.",
      });
    }

    const { dutyId } = req.params;

    if (!isValidUUID(dutyId)) {
      return res.status(400).json({ message: "Invalid duty ID." });
    }

    const duty = await getDutyDetails(dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found." });
    }

    const access = await findMembership(
      duty.board_id,
      req.session.userId
    );

    if (access.error) {
      return res
        .status(access.error.status)
        .json({ message: access.error.message });
    }

    return res.status(200).json({
      duty: serializeDuty(
        duty,
        access.membership.role,
        req.session.userId
      ),
    });
  } catch (error) {
    console.error("Fetch duty error:", error);

    return res.status(500).json({
      message: "Could not fetch this duty.",
    });
  }
});

// Organisers may edit any board duty.
// Volunteers may edit only their assigned duty's description and status.
router.put("/:dutyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to update this duty.",
      });
    }

    const { dutyId } = req.params;

    if (!isValidUUID(dutyId)) {
      return res.status(400).json({ message: "Invalid duty ID." });
    }

    const duty = await getDutyDetails(dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found." });
    }

    const access = await findMembership(
      duty.board_id,
      req.session.userId
    );

    if (access.error) {
      return res
        .status(access.error.status)
        .json({ message: access.error.message });
    }

    const isOrganiser = access.membership.role === "organiser";

    const isAssignedVolunteer =
      access.membership.role === "volunteer" &&
      duty.assigned_volunteer_id === req.session.userId;

    if (!isOrganiser && !isAssignedVolunteer) {
      return res.status(403).json({
        message: "You cannot update this duty.",
      });
    }

    const body = req.body || {};

    if (
      isAssignedVolunteer &&
      Object.keys(body).some(
        (field) => !["description", "status"].includes(field)
      )
    ) {
      return res.status(403).json({
        message:
          "Volunteers may only update their assigned duty's description and status.",
      });
    }

    if (Object.keys(body).length === 0) {
      return res.status(400).json({
        message: "Provide at least one duty field to update.",
      });
    }

    const validated = validateDutyFields(body, true, duty.due_date);

    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }

    const {
      assignedVolunteerId,
      ...updates
    } = validated.fields;

    if (
      assignedVolunteerId &&
      !(await validateVolunteer(duty.board_id, assignedVolunteerId))
    ) {
      return res.status(400).json({
        message: "The assigned volunteer must be a member of this board.",
      });
    }

    const columnNames = {
      title: "title",
      description: "description",
      dueDate: "due_date",
      status: "status",
      priority: "priority",
    };

    const updateEntries = Object.entries(updates);

    if (assignedVolunteerId) {
      updateEntries.push([
        "assignedVolunteerId",
        assignedVolunteerId,
      ]);
    }

    const setClauses = [];
    const values = [];

    for (const [field, value] of updateEntries) {
      const column = columnNames[field] || (
        field === "assignedVolunteerId"
          ? "assigned_volunteer_id"
          : null
      );

      if (!column) continue;

      values.push(value);
      setClauses.push(`${column} = $${values.length}`);
    }

    values.push(dutyId);

    await pool.query(
      `UPDATE duties
       SET ${setClauses.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length}`,
      values
    );

    const updatedDuty = await getDutyDetails(dutyId);

    return res.status(200).json({
      message: "Duty updated successfully.",
      duty: serializeDuty(
        updatedDuty,
        access.membership.role,
        req.session.userId
      ),
    });
  } catch (error) {
    console.error("Update duty error:", error);

    return res.status(500).json({
      message: "Could not update duty.",
    });
  }
});

// Delete a duty. Only the board organiser can delete it.
router.delete("/:dutyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Please log in to delete this duty.",
      });
    }

    const { dutyId } = req.params;

    if (!isValidUUID(dutyId)) {
      return res.status(400).json({ message: "Invalid duty ID." });
    }

    const duty = await getDutyDetails(dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found." });
    }

    const access = await findMembership(
      duty.board_id,
      req.session.userId
    );

    if (access.error) {
      return res
        .status(access.error.status)
        .json({ message: access.error.message });
    }

    if (access.membership.role !== "organiser") {
      return res.status(403).json({
        message: "Only the board organiser can delete duties.",
      });
    }

    await pool.query("DELETE FROM duties WHERE id = $1", [dutyId]);

    return res.status(200).json({
      message: "Duty deleted successfully.",
    });
  } catch (error) {
    console.error("Delete duty error:", error);

    return res.status(500).json({
      message: "Could not delete duty.",
    });
  }
});

module.exports = router;
