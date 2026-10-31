# EventTracker PRD

## 1. Product Overview

EventTracker is a web application that helps event organisers assign duties to volunteers and track their completion status through a centralized board.

The application provides a shared view of all event duties, their assigned owners, and their current progress. Organisers can access the latest board from different devices without depending on the laptop used to create it.

**Product Type:** Web Application\
**Target Environment:** Single Campus Event\
**Version:** MVP 1.0

## 2. Business Problem Statement

During campus events, organisers communicate volunteer assignments and progress updates through multiple channels, including chats and personal messages.

As a result:

- Organisers cannot easily identify incomplete duties.
- It is difficult to track who is responsible for each duty.
- Updates are scattered across different conversations.
- Organisers must spend additional time following up with volunteers.
- Assignment information may become unavailable when it is stored only on an individual's laptop.

**Goal:** Provide a centralized duty board where organisers can assign responsibilities, identify task owners, and monitor completion status.

**Primary Users:** Campus event organisers.

**Secondary Users:** Volunteers participating in the event.

**Success Criteria:** Organisers can view all assigned duties, identify incomplete work, access the latest board from another device, and retain saved assignments after an application restart or failed release.





## 3. Stakeholder Identification

| **Stakeholder**    | **Role**                                              |
| ------------------ | ----------------------------------------------------- |
| Event Organisers   | Create duties, assign volunteers and monitor progress |
| Volunteers         | View assigned duties and update completion status     |
| Project Developers | Build, test and maintain the application              |

**Primary Decision Maker:** Event organiser, who confirms whether the board meets the event's requirements.

## 4. Business Impact

**Operational Impact:** Organisers can view duty assignments and completion statuses in one place instead of searching through multiple conversations.

**User Impact:** Volunteers have a clear view of their responsibilities and organisers can identify duties that still require attention.

**Reliability Impact:** Centralized, persistent storage prevents assignment information from depending on a single laptop or being lost during an application redeployment.

*Note: Financial impact and time savings have not been quantified because no user research or baseline measurements have been conducted.*

## 5. Data Requirements

| **Data**       | **Description**                         |
| -------------- | --------------------------------------- |
| Duty ID        | Unique identifier for each duty         |
| Duty Title     | Name of the assigned task               |
| Description    | Details about the duty                  |
| Volunteer Name | Person responsible for the duty         |
| Event ID       | Identifies the associated event         |
| Status         | Current completion status               |
| Created At     | Date and time the duty was created      |
| Updated At     | Date and time the duty was last updated |

The application will store the following information:**Data Source:** Information entered by event organisers and status updates submitted by users.

**Storage:** A persistent database.

**Data Ownership:** The project team is responsible for implementing and maintaining the application data.

**Validation Status:** The data fields are proposed for the MVP. Their final structure will be confirmed during implementation.

## 6. KPIs and Success Metrics

The following are proposed MVP acceptance targets, not measured business outcomes.

| **Metric**          | **Measurement**                                             | **Target**                     | **Timeline**   |
| ------------------- | ----------------------------------------------------------- | ------------------------------ | -------------- |
| Duty Creation       | Successfully created duties                                 | 100% of valid test submissions | Before release |
| Assignment Accuracy | Duties displaying the correct owner                         | 100% of test cases             | Before release |
| Status Updates      | Updated statuses correctly displayed                        | 100% of test cases             | Before release |
| Cross-Device Access | Latest board accessible from another device                 | Successful verification        | Before release |
| Data Persistence    | Saved assignments retained after restart and failed release | 100% of test cases             | Before release |

## 7. User Stories

**US-01: Create a Duty**

As an event organiser, I want to create a duty with a title and description, so that volunteer responsibilities can be recorded centrally.

**Acceptance Criteria:**

- The organiser can enter a duty title and description.
- The system saves the duty.
- The created duty appears on the board.

**US-02: Assign a Volunteer**

As an event organiser, I want to assign a volunteer to a duty, so that responsibility for each task is clear.

**Acceptance Criteria:**

- The organiser can specify a volunteer's name.
- The assigned volunteer is displayed alongside the duty.
- Each duty has a clearly identifiable owner.

**US-03: Update Duty Status**

As a volunteer, I want to update the status of my assigned duty, so that organisers can track its progress.

**Acceptance Criteria:**

- A duty can have Pending, In Progress, or Completed status.
- The updated status is saved.
- The latest status is visible on the board.

**US-04: View the Duty Board**

As an event organiser, I want to view all duties, owners, and statuses in one place, so that I can quickly identify incomplete work.

**Acceptance Criteria:**

- All saved duties appear on the board.
- Each duty displays its title, owner, and status.
- Incomplete duties can be identified easily.

**US-05: Access the Latest Board**

As an event organiser, I want to access the board from another device, so that I do not depend on the original author's laptop.

**Acceptance Criteria:**

- The application is accessible through a deployed web address.
- The latest saved assignments are visible from another device.

**US-06: Preserve Saved Assignments**

As an event organiser, I want saved assignments to remain intact after application restarts or failed releases, so that event information is not lost.

**Acceptance Criteria:**

- Assignments are stored in persistent database storage.
- Restarting the application does not delete assignments.
- Deploying a new application version does not overwrite or erase existing assignments.
- A failed release can be rolled back without losing saved assignments.

## 8. Feature Scope

### In Scope — MVP 1.0

1. Create volunteer duties.
2. Assign volunteers to duties.
3. Display duty owners and descriptions.
4. Track Pending, In Progress, and Completed statuses.
5. View all assignments on a centralized board.
6. Access the latest board through a deployed web application.
7. Store assignments in persistent database storage.

### Out of Scope — MVP 1.0

1. AI-based volunteer assignment.
2. Automated email, SMS, or push notifications.
3. Volunteer attendance tracking.
4. Payment management.
5. Advanced analytics and reporting.
6. Automated scheduling.
7. Multiple event management.
8. Mobile application.

## 9. Application Workflow

1. The organiser opens the web application.
2. The organiser creates a duty.
3. The organiser assigns a volunteer to the duty.
4. The application saves the assignment in the database.
5. The duty appears on the centralized board.
6. The volunteer views the assigned duty and updates its status.
7. The updated status is saved and displayed on the board.
8. The organiser accesses the latest board from any supported device.

## 10. Technical Workflow

**Proposed application architecture:**

1. **Frontend:** Displays the duty board and provides forms for creating assignments and updating statuses.
2. **Backend:** Handles duty creation, assignment, retrieval, and status updates.
3. **Database:** Stores duties, volunteer assignments, and completion statuses persistently.
4. **Deployment:** Hosts the application so that organisers can access it through a shared web address.

**Data Flow:**

User → Frontend → Backend API → Database

When information is requested:

Database → Backend API → Frontend → Updated Duty Board

**Data Persistence Requirement:** Application deployment and database storage must be independent. Application restarts, updates, or rollbacks must not delete previously saved assignments.

**Dockerization:** The application will be containerized using Docker so that it can run consistently across development and deployment environments.

- Create a Dockerfile to define the application image and its runtime dependencies.
- Use Docker Compose to configure and run the frontend, backend, and database services together.
- Configure the services to communicate through a Docker network.
- Store configuration such as ports and database connection details in environment variables rather than hard-coding them.
- Use a named Docker volume for MongoDB data so that assignments remain available when database containers are restarted or recreated.
- Configure a health check to verify that the application is running correctly.

**Release Failure Handling:** Application containers and database storage must remain separate. If a new application image fails, the team should be able to return to the previous working image while reconnecting to the existing database volume. Deployment or rollback commands must not remove the persistent database volume.

## 11. Risks and Assumptions

| **Risk / Assumption**                          | **Impact**                                              | **Mitigation**                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Internet connectivity may be unavailable       | Users may not access or update the board                | Clearly communicate the requirement for internet access                                                        |
| Database storage may be incorrectly configured | Saved assignments could be lost during deployment       | Use persistent database storage and test redeployment                                                          |
| Volunteers may not update statuses             | Organisers may see outdated progress                    | Keep status updates simple and easy to access                                                                  |
| Multiple users may update the same duty        | Conflicting updates may occur                           | Ensure updates are saved and the latest stored value is displayed                                              |
| Docker configuration or container failure      | The application may fail to start or become unavailable | Validate Docker images and Compose configuration, and use health checks and a known working image for recovery |

**Assumptions to Validate:**

- Organisers are willing to use a centralized board.
- Volunteers can access the board through a shared web address.
- Three simple completion statuses are sufficient for the event.
- A single-event duty board is sufficient for the initial version.

## 12. Basic Interface / Wireframe Plan

The initial application will contain one main duty board.

**Header:**

- Application name: EventTracker.
- Event name.

**Duty Board:**

| **Duty**          | **Assigned To** | **Status**  |
| ----------------- | --------------- | ----------- |
| Stage Setup       | Volunteer A     | Pending     |
| Registration Desk | Volunteer B     | In Progress |
| Decoration        | Volunteer C     | Completed   |

**Main Actions:**

- Add Duty
- Assign Volunteer
- Update Status

The interface will prioritize clear task ownership and easy status identification.

## 13. Dependencies

- A working frontend and backend.
- A database with persistent storage.
- A deployment environment accessible to organisers and volunteers.
- Docker installed in the development and deployment environments, with Docker Compose available.
- Persistent storage support for the database container.
- Internet connectivity for accessing and updating the board.

## 14. Release and Validation Plan

Before the MVP is considered complete, the team will verify:

1. A new duty can be created.
2. A volunteer can be assigned to a duty.
3. Duty status can be updated.
4. The latest status is displayed correctly.
5. The board can be accessed from another device.
6. The application images build successfully and the services start using Docker Compose.
7. The frontend, backend, and database containers can communicate as expected.
8. Saved assignments remain after an application and database container restart.
9. Saved assignments remain available after database container recreation using the existing persistent volume.
10. A failed application release can be rolled back to the previous working image without deleting or losing saved assignments.

## 15. Final Acceptance Criteria

The MVP is ready for release when:

- Organisers can create and assign volunteer duties.
- Each duty displays its owner and completion status.
- Incomplete duties can be identified from the board.
- Volunteers can update their assigned duties.
- The latest board is accessible without the original author's laptop.
- Saved assignments survive application restarts and failed releases.

**Final Product Scope:** A simple, shared, web-based duty management board for one campus event, providing clear volunteer responsibilities, completion tracking, and reliable assignment storage.


