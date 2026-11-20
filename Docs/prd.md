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

- Every user must authenticate using their Google account through Google OAuth.
- Users do not need to create a separate password or select a role during registration.
- After successful Google authentication, users can access the application.
- The dashboard provides two primary actions: **Create a Board** and **Join a Board**.
- Users who create boards become organisers of those boards.
- Users who join existing boards become members and can participate as volunteers.
- Organiser and volunteer permissions are determined by their relationship with individual boards rather than a permanent role selected during registration.
- Each registered user will receive a unique MongoDB `ObjectId`, which will serve as their permanent system identifier.
- Google account information will be used to identify and associate the authenticated user with their application account.
- User names will only be used for display purposes and will not be used to identify users or distinguish between accounts.
- The same Google account must not create multiple application accounts.

**Authentication Scope:** Authentication is implemented using Google OAuth. Google handles the authentication process, eliminating the need for application-managed email/password registration, password hashing, or manual JWT generation.

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

- **User Information:** Unique user ID, name, email address, and associated Google account identifier.
- **Board Information:** Board details, owner ID, members, and invitation codes.
- **Task Information:** Task descriptions, assigned volunteer IDs, deadlines, statuses, and update versions.
- **Progress Information:** Written updates, submission timestamps, and the IDs of users who submitted them.

### Storage & Security Technicals

- **Data Source:** Information entered by organisers and volunteers, along with identity information provided through Google OAuth.
- **Database Technology:** MongoDB.
- **Storage:** MongoDB with persistent storage through a Docker named volume.
- **Authentication:** Google OAuth.
- **Data Validation:** The application will validate user inputs, invitation codes, task assignments, and progress updates.
- **Data Security:**
  - Google OAuth will handle user authentication.
  - The application will not store user passwords or implement its own password-hashing mechanism.
  - Authenticated user identity will be established through the Google authentication flow.
  - Protected application operations will require an authenticated user.
  - Access to boards and tasks will be restricted according to board ownership and membership.
  - Users will only be allowed to perform operations for which they have permission.

### Unique User Identification Rules

- Every registered user will have a unique MongoDB `ObjectId`.
- The Google account identifier will be associated with the corresponding application user record.
- The MongoDB `ObjectId` will be used as the reference when assigning volunteers to tasks and associating users with boards.
- Two volunteers may have the same name, but their unique user IDs will distinguish their accounts.
- Task assignments and progress updates will reference user IDs instead of names.
- The same Google account must map to the same application user account.

---

## 7. KPIs and Success Metrics

| Metric | Success Measure |
| :--- | :--- |
| **User Authentication** | Users can authenticate successfully through Google OAuth. |
| **Board Creation** | Organisers can successfully create boards. |
| **Task Management** | Tasks can be created, edited, deleted, and assigned correctly. |
| **Progress Tracking** | Task statuses and written updates are saved and displayed. |
| **User Access** | Organisers and volunteers can access their authorized boards. |
| **Cross-Device Access** | Latest information is accessible from another device. |
| **Data Persistence** | Saved information remains available after container restarts. |

---

## 8. User Stories and Acceptance Criteria

### US-01: User Authentication

**As a** user, **I want to** log in using my Google account **so that** I can securely access the application without creating a separate password.

*Acceptance Criteria:*

- Users can authenticate successfully using Google OAuth.
- Users can access the application after successful Google authentication.
- Users do not need to register using a separate email/password form.
- Users do not need to select an Organiser or Volunteer role during registration.
- Each application user receives a unique MongoDB `ObjectId`.
- The authenticated Google account is associated with the corresponding application user.
- The same Google account must not create duplicate application accounts.
- Unauthenticated users cannot access protected application functionality.
- Users can sign out of their authenticated session.

### US-02: Board Management

**As an** organiser, **I want to** create boards and invite volunteers **so that** event responsibilities can be managed centrally.

*Acceptance Criteria:*

- Authenticated users can create boards.
- A user who creates a board becomes its designated organiser and owner.
- Each board has a designated owner.
- Unique invitation codes are generated for boards.
- Other authenticated users can join using valid invitation codes.
- Invalid invitation codes are rejected.
- Board membership is associated with unique user IDs.
- Only the board owner can manage their board.

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

- Google OAuth authentication.
- Google account-based user identification.
- Unique MongoDB user identification.
- Board creation.
- Invitation code generation and board joining.
- Organiser and volunteer permissions based on board ownership and membership.
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
- Separate email/password authentication.
- Application-managed password storage and hashing.

> **MVP Limitation:** The initial version focuses on event duty management and progress tracking rather than a complete event management platform.

---

## 10. Application Workflow

1. A user opens the EventTracker application.
2. The user selects the Google login option.
3. Google OAuth authenticates the user.
4. After successful authentication, the user is redirected to the application.
5. The system identifies the user and associates them with their application account.
6. The dashboard displays two primary actions: **Create a Board** and **Join a Board**.
7. A user who creates a board becomes its organiser.
8. The system generates a unique invitation code for the board.
9. Other authenticated users can join using the invitation code and become board members.
10. The organiser creates tasks and assigns them to board members.
11. The organiser can edit or delete duties when necessary.
12. Volunteers view their assigned tasks and update their progress.
13. The system saves task statuses and written progress updates.
14. The organiser monitors task statuses and progress updates.
15. All information is stored in MongoDB and remains accessible across supported devices.

---

## 11. Technical Workflow

### Proposed Application Architecture

- **Frontend:** User interface for Google authentication, board management, and task tracking.
- **Backend:** Handles application logic, authenticated user requests, board management, and task operations.
- **Database:** MongoDB stores user, board, task, and progress information.
- **Authentication Provider:** Google OAuth handles user authentication.
- **Deployment:** Makes the application accessible through a shared web address.

### Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB |
| **Authentication** | Google OAuth |
| **API Communication** | REST APIs |
| **Containerization** | Docker |
| **Service Orchestration** | Docker Compose |
| **Deployment** | Vercel / Render |

### API Requirements

The backend will provide REST APIs for:

- Google OAuth authenticated user access.
- User identification and account association.
- Board creation and management.
- Volunteer board joining.
- Task creation, editing, deletion, and assignment.
- Task status updates.
- Progress submission and retrieval.

The APIs will enforce authenticated access, input validation, and board ownership or membership permissions.

*External API Integration:* Google OAuth is used as the external authentication provider. Apart from Google authentication, no additional third-party APIs are required for the initial MVP. The application uses its own REST APIs for frontend and backend communication.

### Authentication and Authorization

- Users authenticate through Google OAuth.
- Google handles the authentication process without requiring users to create or maintain a separate application password.
- After successful authentication, the application associates the authenticated Google account with its corresponding user record.
- Each application user is identified internally using a unique MongoDB `ObjectId`.
- The application does not implement its own password hashing using bcrypt or generate its own JWT authentication tokens.
- Protected application functionality requires an authenticated user.
- Authenticated user identity must be verified before processing protected backend operations.
- Organisers can manage only the boards they own.
- Volunteers can access boards they have joined.
- Volunteers can update only their assigned tasks.
- Unauthorized operations will return appropriate HTTP error responses.

### Database Design and Identification

MongoDB will be used as the primary database throughout the application.

**Proposed Collections:**

- `Users`: Stores application user information, Google account association, email addresses, names, and unique user IDs.
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
| **Internet connectivity issues** | Require internet access for application usage and Google authentication. |
| **Database data loss** | Configure persistent MongoDB storage. |
| **Unauthorized board access** | Enforce authenticated access and board membership permissions. |
| **Incorrect task updates** | Restrict updates to assigned volunteers. |
| **Duplicate user identification** | Use unique MongoDB `ObjectIds` and associate accounts with Google identities. |
| **Conflicting task updates** | Implement optimistic concurrency control using version numbers. |
| **Unauthorized task modification** | Allow only the board owner to edit or delete duties. |
| **Invalid user input** | Validate data on frontend and backend. |
| **Docker service failure** | Configure health checks and service dependencies. |
| **Exposed credentials** | Store secrets in environment variables and exclude them from version control. |
| **Authentication provider unavailability** | Depend on Google's authentication service for Google OAuth login. |

### Assumptions

- Organisers and volunteers can access the application through a web address.
- Users will authenticate through their Google accounts.
- Google authentication will be available when users need to sign in.
- Users will choose between creating a board and joining a board after authentication.
- Users who create boards will act as organisers of those boards.
- Users who join boards will act as volunteers or board members.
- Each user account will have a unique system-generated MongoDB `ObjectId`.
- Three task statuses are sufficient for the MVP.
- Each task will have one assigned volunteer.
- Only the board owner can create, edit, or delete duties.
- All board members can view tasks, but only authorized users can modify them.
- Internet connectivity will be available.
- MongoDB's existing named Docker volume will be retained for data persistence.

> **Privacy Consideration:** Only information required for user accounts and event management will be collected. Google account information will be used for authentication and account identification.

---

## 13. Basic Wireframe Plan

The interface will prioritize simplicity, clear task ownership, and easy progress tracking.

**Main Screens:**

- Google Login Page
- Dashboard Page
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
- Google OAuth configuration and credentials.
- Docker and Docker Compose.
- Environment variables for application configuration and authentication credentials.
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
| **2nd Week** | Frontend Development | Yohan | Google Login Page | 2nd week |
| | | Ain | Dashboard Page, Create Board Page, and Join Board Page | 2nd week |
| | | Rishitha | Board Tasks Page, Create Task Page, Task Details Page, and Progress Updates Section | 2nd week |
| **3rd Week** | Database Design & Integration | Yohan | `Users` collection and Google account association | 3rd week |
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
- Implement Google OAuth authentication.
- Design and integrate MongoDB collections.
- Implement user identification and board-level permissions.
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

- Google OAuth authentication.
- Application user identification.
- Unique user identification.
- Dashboard access after authentication.
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
- Google OAuth authentication.
- User identification and authorization functionality.
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

- Users can authenticate using Google OAuth.
- Users can access the application after successful Google authentication.
- Users do not need to create a separate application password.
- Every application user receives a unique system-generated MongoDB `ObjectId`.
- Google accounts are correctly associated with application user records.
- Users can create boards and become their organisers.
- Organisers can invite volunteers through unique invitation codes.
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

**Final Product Scope:** EventTracker is a centralized campus event duty management application that simplifies volunteer assignments, task tracking, and progress monitoring through a web-based platform with Google OAuth authentication, board-based permissions, MongoDB data storage, Docker-based deployment, and persistent data storage.