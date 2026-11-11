# DEMO Incident: Volunteers cannot join a board with a valid invitation code

> **Practice scenario only.** This is a fictional incident created to demonstrate an incident pointer in the team workflow. It is not an actual production incident or an assigned course incident.

**Status:** To do  
**Severity:** Medium (demo)  
**Affected area:** Board invitations

## Summary

A volunteer enters a valid invitation code but does not become a member of the event board.

## User impact

The volunteer cannot see the event's task assignments or post progress updates, so the organiser may need to share the information through another channel.

## Reproduction outline

1. Create an event board and copy its invitation code.
2. Sign in as a different user.
3. Enter the valid code to join the board.
4. Check whether the board appears in the volunteer's board list.

## Expected result

The volunteer joins the board and can view its tasks and updates.

## Actual result in this demo

Not verified. This is a scenario for workflow practice, not a confirmed application bug.

## Done when

- A valid invitation code adds the volunteer to the corresponding board.
- An invalid code shows a clear error and does not add the volunteer to a board.
- The behavior is covered by an appropriate test.
