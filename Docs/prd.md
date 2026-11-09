# EventTracker – Product Requirements Document (PRD)

---

## 1. Product Overview

**EventTracker** is a web application that helps campus event organisers create event boards, assign duties to volunteers, and track their progress through a centralized platform.

Organisers can create boards, assign tasks, and invite volunteers using invitation codes. Volunteers can join boards, view their responsibilities, update task statuses, and submit progress updates. The application provides a shared platform for managing event duties and monitoring their completion.

- **Product Type:** Web Application
- **Target Environment:** Campus Events
- **Version:** MVP 1.0

---

## 2. Business Problem Statement

During campus events, organisers manage volunteer assignments and progress updates through multiple channels, such as chats and personal messages. This creates difficulties in tracking responsibilities, identifying incomplete tasks, and monitoring volunteer progress.

- **Goal:** Provide a centralized platform where organisers can assign duties, invite volunteers, and monitor event progress.
- **Primary Users:** Campus event organisers.
- **Secondary Users:** Volunteers participating in the event.
- **Success Criteria:** Organisers can manage assignments, monitor progress, and access the latest event information across devices without losing saved data.

---

## 3. Stakeholder & User Identification

### Stakeholder Roles

| Stakeholder | Role |
| :--- | :--- |
| **Event Organisers** | Create boards, assign tasks, and monitor progress. |
| **Volunteers** | Join boards, view duties, and submit updates. |
| **Project Developers** | Develop and maintain the application. |
| **Event Coordinator** | Reviews and approves the application. |

**Primary Decision Maker:** Event organiser or event coordinator.

### User Identification and Roles
- Every user must register and log in using an individual account.
- During registration, users must select their role: **Organiser** or **Volunteer**.
- The selected role will be stored in the user's account information.
- Organisers can create and manage their own event boards.
- Volunteers can join existing boards using valid invitation codes.
- Each registered user will receive a unique MongoDB `ObjectId`, which will serve as their permanent system identifier.
- User names will only be used for display purposes and will not be used to identify users or distinguish between accounts.
- The same account cannot register multiple times using the same email address.

**Authentication Scope:** User registration and login are included in MVP 1.0. Authentication will be implemented using JWT, with `bcrypt` used for password hashing.

---

## 4. Business Impact

- **Operational Impact:** Centralizes event assignments and reduces the need to track duties through multiple conversations.
- **User Impact:** Gives volunteers clear responsibilities and organisers better visibility into task progress.
- **Reliability Impact:** Keeps event information accessible across devices and protects saved data through persistent database storage.

> **Note:** Financial impact and time savings have not been quantified.

---

## 5. Product Objectives

### Primary Objectives
- Centralize event duty assignments.
- Allow organisers to create boards and assign tasks.
- Enable volunteers to join boards through invitation codes.
- Allow volunteers to update task statuses and submit progress updates.
- Help organisers monitor task completion.
- Allow organisers to edit and delete duties when required.
- Maintain saved information across application restarts.

### Expected Outcomes
- Organisers can view all duties and their current status.
- Volunteers can access and update their responsibilities.
- Progress updates remain available to organisers.
- Event information remains accessible across supported devices.

---

## 6. Data Requirements

### Categories of Information
- **User Information:** Unique user ID, name, email address, hashed password, and assigned role.
- **Board Information:** Board details, owner ID, members, and invitation codes.
- **Task Information:** Task descriptions, assigned volunteer IDs, deadlines, statuses, and update versions.
- **Progress Information:** Written updates, submission timestamps, and the IDs of users who submitted them.

### Storage & Security Technicals
- **Data Source:** Information entered by organisers and volunteers.
- **Database Technology:** MongoDB.
- **Storage:** MongoDB with persistent storage through a Docker named volume.
- **Data Validation:** The application will validate user inputs, invitation codes, task assignments, and progress updates.
- **Data Security:**
  - Passwords will be securely hashed using `bcrypt`.
  - JWT will be used for authenticated API access.
  - Access to boards and tasks will be restricted according to user roles and board membership.
  - Users will only be allowed to perform operations for which they have permission.

### Unique User Identification Rules
- Every registered user will have a unique MongoDB `ObjectId`.
- The `ObjectId` will be used as the reference when assigning volunteers to tasks and associating users with boards.
- Two volunteers may have the same name, but their unique user IDs will distinguish their accounts.
- Task assignments and progress updates will reference user IDs instead of names.

---

## 7. KPIs and Success Metrics

| Metric | Success Measure |
| :--- | :--- |
| **Board Creation** | Organisers can successfully create boards. |
| **Task Management** | Tasks can be created, edited, deleted, and assigned correctly. |
| **Progress Tracking** | Task statuses and written updates are saved and displayed. |
| **User Access** | Organisers and volunteers can access their authorized boards. |
| **Cross-Device Access** | Latest information is accessible from another device. |
| **Data Persistence** | Saved information remains available after container restarts. |

---

## 8. User Stories and Acceptance Criteria

### US-01: User Authentication
**As a** user, **I want to** register and log in **so that** I can securely access the application.

*Acceptance Criteria:*
- Users can register and log in successfully.
- Users must select either Organiser or Volunteer during registration.
- Each account receives a unique user ID.
- Duplicate email registrations are rejected.
- Passwords are stored securely using `bcrypt` hashing.
- Authenticated API requests are verified using JWT.

### US-02: Board Management
**As an** organiser, **I want to** create boards and invite volunteers **so that** event responsibilities can be managed centrally.

*Acceptance Criteria:*
- Organisers can create boards.
- Each board has a designated owner.
- Unique invitation codes are generated for boards.
- Volunteers can join using valid invitation codes.
- Invalid invitation codes are rejected.
- Board membership is associated with unique user IDs.

### US-03: Task Assignment
**As an** organiser, **I want to** create tasks and assign volunteers **so that** responsibilities are clearly distributed.

*Acceptance Criteria:*
- Organisers can create tasks on their own boards.
- Organisers can assign tasks to volunteers who are members of the respective board.
- Each task will have one assigned volunteer in MVP 1.0.
- Assigned volunteers and task details are displayed.
- Organisers can edit task descriptions, deadlines, and assignments after creation.
- Organisers can delete tasks from their boards.
- Deleted tasks will be archived or soft-deleted instead of permanently removed, preserving their existing progress history.
- Volunteers cannot create, edit, or delete tasks.

### US-04: Progress Tracking
**As a** volunteer, **I want to** update my task status and submit progress updates.

*Acceptance Criteria:*
- Volunteers can update their assigned tasks.
- Available statuses are **Pending**, **In Progress**, and **Completed**.
- Volunteers can submit written progress updates.
- Written progress updates are saved with their submission timestamps and user IDs.
- Previous progress updates remain available as history.
- Volunteers cannot update tasks assigned to other users.

### US-05: Board Monitoring
**As an** organiser, **I want to** view all tasks and their progress.

*Acceptance Criteria:*
- Organisers can view assignments, volunteers, and task statuses on their own boards.
- Organisers can view submitted progress updates.
- Organisers can identify incomplete and completed tasks.
- Organisers can view the latest saved information.

### US-06: Data Availability
**As a** user, **I want** my event information to remain available across devices and application restarts.

*Acceptance Criteria:*
- The latest saved information is accessible across devices.
- Application and database container restarts do not erase saved information when the existing persistent volume is retained.

### US-07: Concurrent Update Handling
**As a** user, **I want** conflicting updates to be handled safely **so that** another user's changes are not accidentally overwritten.

*Acceptance Criteria:*
- Each task will maintain a version number.
- The version number will increment whenever a task is successfully updated.
- An update must include the version number of the task that the user last retrieved.
- If another user has already modified the task, the outdated update will be rejected.
- The application will display a message informing the user that the task has been updated by someone else.
- The user must refresh the task to view the latest information before submitting another update.

---

## 9. Feature Scope

### In Scope – MVP 1.0
- User registration and login.
- Organiser and Volunteer roles.
- Unique user identification.
- Event board creation.
- Invitation code generation and board joining.
- Task creation and volunteer assignment.
- Task editing and deletion by authorized organisers.
- Task status management.
- Written progress updates and history.
- Concurrent update conflict handling.
- Centralized event duty board.
- MongoDB data storage.
- Docker containerization and Docker Compose.
- Application and database health checks.

### Out of Scope – MVP 1.0
- AI-based task assignment.
- Automated notifications.
- Volunteer attendance tracking.
- Payment management.
- Advanced analytics.
- Real-time chat.
- Dedicated mobile application.
- File attachments.
- Multi-volunteer assignment to a single task.

> **MVP Limitation:** The initial version focuses on event duty management and progress tracking rather than a complete event management platform.

---

## 10. Application Workflow

1. A user registers and selects either **Organiser** or **Volunteer**.
2. The user logs in to the application.
3. The organiser creates an event board.
4. The system generates a unique invitation code.
5. Volunteers join using the invitation code.
6. The organiser creates tasks and assigns them to board members.
7. The organiser can edit or delete duties when necessary.
8. Volunteers view their assigned tasks and update their progress.
9. The system saves task statuses and written progress updates.
10. The organiser monitors task statuses and progress updates.
11. All information is stored in MongoDB and remains accessible across supported devices.

---

## 11. Technical Workflow

### Proposed Application Architecture
- **Frontend:** User interface for authentication, board management, and task tracking.
- **Backend:** Handles application logic, authentication, board management, and task operations.
- **Database:** MongoDB stores user, board, task, and progress information.
- **Deployment:** Makes the application accessible through a shared web address.

### Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT and bcrypt |
| **API Communication** | REST APIs |
| **Containerization** | Docker |
| **Service Orchestration** | Docker Compose |
| **Deployment** | Vercel / Render |

### API Requirements
The backend will provide REST APIs for:
- User registration and authentication.
- Board creation and management.
- Volunteer board joining.
- Task creation, editing, deletion, and assignment.
- Task status updates.
- Progress submission and retrieval.

The APIs will enforce authentication, input validation, and access permissions.
*External API Integration:* No external third-party APIs are required or used in the initial MVP. The application uses its own REST APIs for frontend and backend communication.

### Authentication and Authorization
- Users register with their name, email address, password, and selected role.
- Passwords are hashed using `bcrypt` before storage.
- After successful login, the backend generates a JWT.
- Protected API endpoints verify the JWT before processing requests.
- Organisers can manage only the boards they own.
- Volunteers can access boards they have joined.
- Volunteers can update only their assigned tasks.
- Unauthorized operations will return appropriate HTTP error responses.

### Database Design and Identification
MongoDB will be used as the primary database throughout the application.

**Proposed Collections:**
- `Users`: Stores account information, roles, and unique user IDs.
- `Boards`: Stores board details, organiser IDs, invitation codes, and member IDs.
- `Tasks`: Stores task descriptions, assigned volunteer IDs, deadlines, statuses, and version numbers.
- `ProgressUpdates`: Stores written progress updates, associated task IDs, user IDs, and timestamps.

Relationships between records will be maintained using MongoDB `ObjectIds`.

### Concurrent Update Handling
The application will use optimistic concurrency control to prevent simultaneous updates from overwriting one another.
- Every task document will contain a `version` field.
- When a user retrieves a task, its current version is returned.
- When submitting an update, the client sends the version it last retrieved.
- The backend performs an atomic MongoDB update that checks both the task ID and expected version.
- If the version matches, the update succeeds and the version increments.
- If the version does not match, the update is rejected with **HTTP 409 Conflict**.
- The frontend displays a message asking the user to refresh and review the latest task information.

### Dockerization
- Separate Dockerfiles for frontend and backend.
- MongoDB running as a separate service using its official Docker image.
- Docker Compose to manage all application services.
- Dedicated Docker network for service communication.
- Environment variables for application configuration and credentials.
- Named Docker volume for persistent MongoDB storage.
- Health checks for service availability and database connectivity.
- Service dependencies configured to ensure that dependent services start only after their required services are healthy.

*Data Persistence Requirement:* Recreating or restarting application containers must not delete saved database information. MongoDB data must remain available through its existing named volume.

### Application Health Checks
Docker health checks will be configured to verify that the application services are operational.

- **Frontend Health Check:**
  - Verify that the frontend application is running.
  - Send an HTTP request to its health endpoint or configured application route.
  - Confirm that the frontend responds successfully.
- **Backend Health Check:**
  - Verify that the Node.js/Express server is running.
  - Send an HTTP request to the backend `/health` endpoint.
  - Confirm that the backend can communicate with MongoDB through a database ping.
  - Return a healthy response only when the backend is responsive and the database connection is available.
- **MongoDB Health Check:**
  - Execute MongoDB's `ping` command.
  - Confirm that the database server is accepting requests and responding successfully.

**Expected Behaviour:**
- Docker should report each service as healthy only after its configured checks succeed.
- If a service becomes unavailable, Docker should report it as unhealthy.
- Backend-dependent services should wait for MongoDB to become healthy before starting.
- Health checks will verify service availability and connectivity; they will not replace full application workflow testing.

---

## 12. Risks, Security, and Assumptions

### Risks & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| **Internet connectivity issues** | Require internet access for application usage. |
| **Database data loss** | Configure persistent MongoDB storage. |
| **Unauthorized board access** | Enforce authentication and board membership permissions. |
| **Incorrect task updates** | Restrict updates to assigned volunteers. |
| **Duplicate user identification** | Use unique MongoDB `ObjectIds` instead of names. |
| **Conflicting task updates** | Implement optimistic concurrency control using version numbers. |
| **Unauthorized task modification**| Allow only the board owner to edit or delete duties. |
| **Invalid user input** | Validate data on frontend and backend. |
| **Docker service failure** | Configure health checks and service dependencies. |
| **Exposed credentials** | Store secrets in environment variables and exclude them from version control. |

### Assumptions
- Organisers and volunteers can access the application through a web address.
- Users will select their roles during registration.
- Volunteers will join boards using invitation codes.
- Each user account will have a unique system-generated ID.
- Three task statuses are sufficient for the MVP.
- Each task will have one assigned volunteer.
- Only the board owner can create, edit, or delete duties.
- All board members can view tasks, but only authorized users can modify them.
- Internet connectivity will be available.
- MongoDB's existing named Docker volume will be retained for data persistence.

> **Privacy Consideration:** Only information required for user accounts and event management will be collected.

---

## 13. Basic Wireframe Plan

The interface will prioritize simplicity, clear task ownership, and easy progress tracking.

**Main Screens:**
- Registration and Login Pages
- Organiser Dashboard
- Create Board Page
- Join Board Page
- Board Tasks Page
- Create and Edit Task Page
- Task Details Page
- Progress Updates Section

---

## 14. Dependencies

- React.js and Node.js/Express.js development environments.
- MongoDB database.
- JWT and bcrypt authentication dependencies.
- Docker and Docker Compose.
- Environment variables for application configuration.
- Persistent storage for MongoDB.
- Deployment environment supporting the selected application services.
- Internet connectivity.

---

## 15. Delivery and Release Plan

### Team Responsibilities and Delivery Timeline

| Week | Development Area | Responsible Member | Assigned Tasks | Deadline |
| :--- | :--- | :--- | :--- | :--- |
| **1st Week** | Backend API Development | Yohan | Authentication functionality | 1st week |
| | | Ain | Board management functionality | 1st week |
| | | Rishitha | Task management and progress tracking functionality | 1st week |
| **2nd Week** | Frontend Development | Yohan | Signup Page and Login Page | 2nd week |
| | | Ain | Dashboard Page, Create Board Page, and Join Board Page | 2nd week |
| | | Rishitha | Board Tasks Page, Create Task Page, Task Details Page, and Progress Updates Section | 2nd week |
| **3rd Week** | Database Design & Integration | Yohan | `Users` collection and authentication data | 3rd week |
| | | Ain | `Boards` collection, invitation codes, owners, and members | 3rd week |
| | | Rishitha | `Tasks` and `ProgressUpdates` collections | 3rd week |
| **4th Week** | Docker & Containerization | Yohan | Frontend Dockerfile | 4th week |
| | | Ain | Docker Compose, MongoDB service, network, and persistent volume | 4th week |
| | | Rishitha | Backend Dockerfile, environment variables, and database connection configuration | 4th week |
| **5th Week** | Application Integration & Delivery | Project Team | Integrate all components, verify workflows, and prepare final deployment | 5th week |

### Delivery Approach

#### Phase 1 – Application Development (Weeks 1–3)
- Develop backend functionality.
- Build the required frontend pages.
- Design and integrate MongoDB collections.
- Implement authentication and role-based access.
- Connect the frontend, backend, and database.
- Implement task management and progress tracking.

#### Phase 2 – Containerization (Week 4)
- Create frontend and backend Dockerfiles.
- Configure Docker Compose.
- Configure MongoDB persistent storage.
- Set up service communication and health checks.
- Verify container startup and database connectivity.

#### Phase 3 – Integration and Final Delivery (Week 5)
- Integrate all application components.
- Verify the main application workflows.
- Test concurrent task updates.
- Run the application using Docker Compose.
- Demonstrate data persistence after container restarts.
- Prepare the final application deployment.

### Validation and Demonstration
The team will validate the main application workflows, including:
- User registration and login.
- Organiser and Volunteer role identification.
- Unique user identification.
- Board creation and volunteer joining.
- Task creation and assignment.
- Task editing and deletion by organisers.
- Task status and progress updates.
- Concurrent update conflict handling.
- Organiser access to task progress.
- Access restrictions for unauthorized users.
- Cross-device access.
- Frontend, backend, and database health checks.
- Data persistence after container restarts.

### Expected Deliverables
- Working EventTracker web application.
- Frontend and backend source code.
- MongoDB integration.
- REST API implementation.
- Authentication and authorization functionality.
- Frontend and backend Dockerfiles.
- Docker Compose configuration.
- Persistent database storage configuration.
- Service health check configuration.
- Deployed application.
- `README.md` with setup and execution instructions.

> **Deployment Environment:** To be finalized.

---

## 16. Final Acceptance Criteria

The MVP will be considered ready for release when:
- Users can register and log in.
- Users can select their roles during registration.
- Every user receives a unique system-generated ID.
- Organisers can create boards and invite volunteers.
- Volunteers can join boards using invitation codes.
- Organisers can create, edit, and delete duties on their own boards.
- Organisers can assign tasks to board members.
- Volunteers can update their assigned task statuses.
- Volunteers can submit written progress updates.
- Organisers can view all assignments and progress.
- Previous progress history is preserved when tasks are deleted.
- Conflicting updates are detected and handled without silently overwriting data.
- Unauthorized users cannot access or modify restricted information.
- The application runs using Docker Compose.
- Frontend, backend, and database services communicate correctly.
- Health checks correctly verify service availability and database connectivity.
- MongoDB uses persistent storage.
- Saved information remains available after application and database container restarts, provided the existing volume is retained.

---

**Final Product Scope:** EventTracker is a centralized campus event duty management application that simplifies volunteer assignments, task tracking, and progress monitoring through a web-based platform with user authentication, role-based access, MongoDB data storage, Docker-based deployment, and persistent data storage.