const STATUSES = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value) {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function getDueDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  return value < today ? null : value;
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
      return {
        error: "Duty description must be 3000 characters or fewer.",
      };
    }

    fields.description = body.description.trim();
  }

  if (!partial || has("dueDate")) {
    const dueDate = getDueDate(body.dueDate);

    if (!dueDate) {
      const unchangedExistingDate =
        existingDueDate &&
        body.dueDate ===
          (existingDueDate instanceof Date
            ? existingDueDate.toISOString().slice(0, 10)
            : String(existingDueDate).slice(0, 10));

      if (!unchangedExistingDate) {
        return {
          error: "Choose a valid due date that is today or later.",
        };
      }

      fields.dueDate =
        existingDueDate instanceof Date
          ? existingDueDate.toISOString().slice(0, 10)
          : String(existingDueDate).slice(0, 10);
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
    if (!isValidUUID(body.assignedVolunteerId)) {
      return {
        error: "Choose a valid volunteer from this board.",
      };
    }

    fields.assignedVolunteerId = body.assignedVolunteerId;
  }

  return { fields };
}

module.exports = {
  isValidUUID,
  validateDutyFields,
};
