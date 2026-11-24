const test = require("node:test");
const assert = require("node:assert/strict");

const {
  isValidUUID,
  validateDutyFields,
} = require("../utils/dutyValidation");

const validUUID = "550e8400-e29b-41d4-a716-446655440000";

const today = new Date().toISOString().slice(0, 10);

const validDuty = {
  title: "Manage Event Registration",
  description: "Handle registrations for the college event.",
  dueDate: today,
  status: "Pending",
  priority: "High",
  assignedVolunteerId: validUUID,
};

// UUID validation tests

test("should accept a valid UUID", () => {
  assert.equal(isValidUUID(validUUID), true);
});

test("should reject an invalid UUID", () => {
  assert.equal(isValidUUID("invalid-id"), false);
});

// Duty title tests

test("should accept a valid duty title", () => {
  const result = validateDutyFields(validDuty);

  assert.equal(result.fields.title, validDuty.title);
});

test("should reject an empty duty title", () => {
  const result = validateDutyFields({
    ...validDuty,
    title: "",
  });

  assert.equal(result.error, "Duty title is required.");
});

test("should reject a duty title longer than 120 characters", () => {
  const result = validateDutyFields({
    ...validDuty,
    title: "A".repeat(121),
  });

  assert.equal(
    result.error,
    "Duty title must be 120 characters or fewer."
  );
});

// Description tests

test("should reject an empty duty description", () => {
  const result = validateDutyFields({
    ...validDuty,
    description: "   ",
  });

  assert.equal(result.error, "Duty description is required.");
});

test("should reject a description longer than 3000 characters", () => {
  const result = validateDutyFields({
    ...validDuty,
    description: "A".repeat(3001),
  });

  assert.equal(
    result.error,
    "Duty description must be 3000 characters or fewer."
  );
});

// Due date tests

test("should accept today's date as a due date", () => {
  const result = validateDutyFields(validDuty);

  assert.equal(result.fields.dueDate, today);
});

test("should reject an invalid due date", () => {
  const result = validateDutyFields({
    ...validDuty,
    dueDate: "2026-02-30",
  });

  assert.equal(
    result.error,
    "Choose a valid due date that is today or later."
  );
});

test("should reject a past due date", () => {
  const result = validateDutyFields({
    ...validDuty,
    dueDate: "2000-01-01",
  });

  assert.equal(
    result.error,
    "Choose a valid due date that is today or later."
  );
});

// Status tests

test("should accept Pending status", () => {
  const result = validateDutyFields({
    ...validDuty,
    status: "Pending",
  });

  assert.equal(result.fields.status, "Pending");
});

test("should accept In Progress status", () => {
  const result = validateDutyFields({
    ...validDuty,
    status: "In Progress",
  });

  assert.equal(result.fields.status, "In Progress");
});

test("should accept Completed status", () => {
  const result = validateDutyFields({
    ...validDuty,
    status: "Completed",
  });

  assert.equal(result.fields.status, "Completed");
});

test("should reject an invalid duty status", () => {
  const result = validateDutyFields({
    ...validDuty,
    status: "Started",
  });

  assert.equal(result.error, "Choose a valid duty status.");
});

// Priority tests

test("should accept High priority", () => {
  const result = validateDutyFields({
    ...validDuty,
    priority: "High",
  });

  assert.equal(result.fields.priority, "High");
});

test("should reject an invalid priority", () => {
  const result = validateDutyFields({
    ...validDuty,
    priority: "Urgent",
  });

  assert.equal(result.error, "Choose a valid duty priority.");
});

// Volunteer assignment tests

test("should accept a valid volunteer UUID", () => {
  const result = validateDutyFields(validDuty);

  assert.equal(result.fields.assignedVolunteerId, validUUID);
});

test("should reject an invalid volunteer UUID", () => {
  const result = validateDutyFields({
    ...validDuty,
    assignedVolunteerId: "not-a-uuid",
  });

  assert.equal(
    result.error,
    "Choose a valid volunteer from this board."
  );
});

// Partial update tests

test("should allow updating only the duty status", () => {
  const result = validateDutyFields(
    { status: "Completed" },
    true
  );

  assert.deepEqual(result.fields, {
    status: "Completed",
  });
});

test("should allow updating only the duty description", () => {
  const result = validateDutyFields(
    { description: "Updated event instructions" },
    true
  );

  assert.deepEqual(result.fields, {
    description: "Updated event instructions",
  });
});

test("should reject an invalid status during a partial update", () => {
  const result = validateDutyFields(
    { status: "Started" },
    true
  );

  assert.equal(result.error, "Choose a valid duty status.");
});
