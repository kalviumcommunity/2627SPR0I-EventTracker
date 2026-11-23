# EventTracker – Product Requirements Document (PRD)

---

## 1. Product Overview

**EventTracker** is a web application for managing volunteer duties during campus events. It provides organisers and volunteers with a centralized platform to manage event boards, assign responsibilities, track duty progress, and monitor updates.

Organisers can create boards, invite volunteers using unique invitation codes, assign duties, and monitor their completion. Volunteers can join boards, view their assigned duties, and update their descriptions and statuses.

- **Product Type:** Web Application
- **Target Environment:** Campus Events
- **Version:** MVP 1.0

## 2. Business Problem Statement

During campus events, organisers often manage volunteer assignments and progress updates through multiple chats and personal messages. This makes it difficult to identify incomplete duties, confirm responsibilities, and track the latest updates.

EventTracker addresses this by providing a shared platform where organisers can create event boards, invite volunteers, assign duties, and monitor progress.

- **Goal:** Centralize event duty management and progress tracking.
- **Primary Users:** Campus event organisers.
- **Secondary Users:** Volunteers participating in campus events.
- **Success Criteria:** Organisers can manage duties and monitor progress, while volunteers can access and update their assigned responsibilities.

## 3. Stakeholder & User Identification

### Stakeholder Roles

| Stakeholder | Role |
|---|---|
| Event Organisers | Create boards, assign duties, and monitor progress. |
| Volunteers | Join boards, view assigned duties, and update their responsibilities. |
| Project Developers | Develop and maintain the application. |
| Event Coordinator | Reviews and approves the application. |

### User Identification and Roles

- Users authenticate through Google OAuth.
- Users do not create a separate password or select a role during registration.
- After authentication, the dashboard provides two primary actions: **Create a Board** and **Join a Board**.
- Users who create boards become organisers of those boards.
- Users who join boards become volunteers on those boards.
- Roles are assigned per board rather than being permanent global user roles.
- Every user has a unique PostgreSQL-generated UUID.
- Google account information is associated with the corresponding application user record.
- The same Google account must not create duplicate application accounts.

**Authentication Scope:** Google OAuth is used for authentication. The backend verifies the Google identity and maintains an authenticated application session using Express sessions. The application does not require a separate email/password registration system or its own JWT authentication implementation.

## 4. Business Impact

- **Operational Impact:** Centralizes event responsibilities and reduces the need to track duties through multiple conversations.
- **User Impact:** Gives volunteers clear responsibilities and organisers better visibility into duty progress.
- **Reliability Impact:** Stores application information in PostgreSQL with persistent database storage.

## 5. Product Objectives

### Primary Objectives

- Centralize event duty assignments.
- Allow organisers to create boards and invite volunteers.
- Allow volunteers to join boards using invitation codes.
- Enable organisers to create and assign duties.
- Allow volunteers to update their assigned duties.
- Help organisers monitor duty completion.
- Maintain application information using persistent database storage.

### Expected Outcomes

- Organisers can view all duties on their boards.
- Volunteers can access and update their assigned responsibilities.
- Organisers can monitor the latest saved duty information.
- Board information remains available after application restarts when the PostgreSQL data volume is retained.

## 6. Data Requirements

### Categories of Information

- **User Information:** Unique user ID, name, email address, and Google account identifier.
- **Board Information:** Board ID, name, event date, location, creator ID, invitation code, and creation timestamp.
- **Membership Information:** Board ID, user ID, board-level role, and membership timestamp.
- **Duty Information:** Duty ID, board ID, title, description, assigned volunteer ID, creator ID, due date, status, priority, and timestamps.
- **Session Information:** Server-side authentication session data and expiry information.

### Storage and Security

- **Database:** PostgreSQL 17.
- **Database Driver:** `pg` (node-postgres).
- **Authentication:** Google OAuth.
- **Session Management:** Express sessions with PostgreSQL-backed storage using `connect-pg-simple`.
- **Data Validation:** Backend validation for user inputs, invitation codes, duty assignments, dates, statuses, and priorities.
- **Access Control:** Backend authentication and authorization checks restrict operations according to board membership and roles.
- **Data Security:** Database credentials and application secrets are stored in environment variables.

### Unique User Identification Rules

- Every registered user receives a unique PostgreSQL UUID.
- Google account identifiers are associated with application user records.
- User IDs are used to associate users with boards, memberships, and assigned duties.
- Two users may have the same name, but their unique IDs distinguish their accounts.

### Relational Database Design

| Table | Purpose |
|---|---|
| `users` | Stores user details and Google account association. |
| `boards` | Stores board details, creator information, and invitation codes. |
| `board_members` | Connects users with boards and stores their board-level roles. |
| `duties` | Stores duties, assignments, descriptions, statuses, priorities, and timestamps. |
| `session` | Stores Express authentication sessions through the PostgreSQL session store. |

Relationships are maintained using PostgreSQL UUID keys and foreign-key constraints. A user can participate in multiple boards, with a separate role for each board.

## 7. KPIs and Success Metrics

| Metric | Success Measure |
|---|---|
| User Authentication | Users can authenticate through Google OAuth. |
| Session Management | Sessions can be restored through PostgreSQL-backed session storage. |
| Board Creation | Organisers can successfully create boards. |
| Board Joining | Users can join boards using valid invitation codes. |
| Duty Management | Organisers can create, edit, delete, and assign duties. |
| Duty Progress Tracking | Assigned volunteers can update permitted descriptions and statuses. |
| User Access | Users can access only authorized boards and operations. |
| Data Persistence | Saved information remains available after restarts when the PostgreSQL volume is retained. |

## 8. User Stories and Acceptance Criteria

### US-01: User Authentication

**As a** user, **I want to** log in using my Google account **so that** I can securely access the application without creating a separate password.

**Acceptance Criteria:**

- Users can authenticate using Google OAuth.
- The backend verifies the Google identity.
- The system finds or creates the corresponding application user in PostgreSQL.
- Every application user receives a unique PostgreSQL UUID.
- Users do not need a separate email/password registration flow.
- Users do not select an organiser or volunteer role during registration.
- Authenticated sessions are stored in PostgreSQL.
- Unauthenticated users cannot access protected functionality.
- Users can log out successfully.

### US-02: Board Management

**As an** organiser, **I want to** create boards and invite volunteers **so that** event responsibilities can be managed centrally.

**Acceptance Criteria:**

- Authenticated users can create boards.
- A user who creates a board becomes its organiser.
- Each board receives a unique invitation code.
- Other authenticated users can join using valid invitation codes.
- Invalid invitation codes are rejected.
- Users who join boards become volunteers on those boards.
- Board membership and roles are stored in PostgreSQL.
- Only authorized board members can view a board.

### US-03: Duty Assignment

**As an** organiser, **I want to** create duties and assign volunteers **so that** responsibilities are clearly distributed.

**Acceptance Criteria:**

- Organisers can create duties on boards they organize.
- Organisers can assign duties to volunteers who belong to the same board.
- Each duty has one assigned volunteer in the MVP.
- Duty details include title, description, due date, status, and priority.
- Organisers can edit all duty fields.
- Organisers can delete duties from their boards.
- Volunteers cannot create or delete duties.
- Duty information is stored in PostgreSQL.

### US-04: Duty Progress Updates

**As a** volunteer, **I want to** update the description and status of my assigned duties **so that** organisers can monitor my progress.

**Acceptance Criteria:**

- Volunteers can view duties belonging to boards they have joined.
- Volunteers can update only duties assigned to them.
- Volunteers can update the description of their assigned duties.
- Volunteers can update the status of their assigned duties.
- Volunteers cannot change the title, due date, priority, or assigned volunteer.
- Available statuses are `Pending`, `In Progress`, and `Completed`.
- Organisers can view the latest saved duty information.

### US-05: Board Monitoring

**As an** organiser, **I want to** view all duties and their progress **so that** I can monitor event responsibilities.

**Acceptance Criteria:**

- Organisers can view duties on their boards.
- Organisers can see assigned volunteers and duty details.
- Organisers can view the latest saved descriptions and statuses.
- Organisers can identify pending, in-progress, and completed duties.
- Authorized board members can view duties belonging to their boards.

### US-06: Data Availability

**As a** user, **I want to** access saved event information after application restarts **so that** my work is not lost.

**Acceptance Criteria:**

- Board and duty information is retrieved from PostgreSQL.
- Users can access information permitted by their board membership.
- Application and database container restarts do not erase saved information when the existing PostgreSQL volume is retained.
- Authentication sessions are stored in PostgreSQL, subject to session expiry and cookie settings.

## 9. Feature Scope

### In Scope – MVP 1.0

- Google OAuth authentication.
- Google account-based user identification.
- PostgreSQL UUID-based user identification.
- Express session management.
- PostgreSQL-backed session storage.
- Board creation.
- Unique invitation code generation.
- Joining boards using invitation codes.
- Board membership management.
- Organiser and volunteer permissions based on board membership.
- Duty creation and volunteer assignment.
- Duty editing and deletion by organisers.
- Duty description and status updates by assigned volunteers.
- Duty status management.
- Centralized event duty board.
- PostgreSQL relational data storage.
- Dockerized PostgreSQL development database with persistent storage.
- Backend health check for server and database connectivity.

### Out of Scope – MVP 1.0

- AI-based duty assignment.
- Automated notifications.
- Volunteer attendance tracking.
- Payment management.
- Advanced analytics.
- Automated scheduling.
- Real-time chat.
- Dedicated mobile application.
- File attachments.
- Multiple volunteers assigned to a single duty.
- Separate email/password authentication.
- Application-managed password storage and hashing.
- Separate written progress-update history.
- Duty soft deletion or archival history.
- Optimistic concurrency control.

**MVP Limitation:** The initial version focuses on board-based event duty management and status tracking. It does not maintain a separate history of written progress updates.

## 10. Application Workflow

1. A user opens EventTracker.
2. The user selects Google login.
3. Google OAuth authenticates the user.
4. The backend verifies the authentication result.
5. The system finds or creates the corresponding user record in PostgreSQL.
6. The backend creates an authenticated server-side session and stores it in PostgreSQL.
7. The user is redirected to the dashboard.
8. The dashboard displays **Create a Board** and **Join a Board**.
9. A user who creates a board becomes its organiser.
10. The system generates a unique invitation code.
11. Other authenticated users can join using the invitation code and become volunteers.
12. The organiser creates duties and assigns them to board volunteers.
13. The organiser can edit or delete duties.
14. Volunteers view their assigned duties and update descriptions and statuses.
15. The organiser monitors the latest saved duty information.
16. Board, membership, duty, and session information is stored in PostgreSQL.

## 11. Technical Workflow

### Application Architecture

- **Frontend:** React application built with Vite.
- **Backend:** Node.js with Express.js.
- **Database:** PostgreSQL 17.
- **Database Driver:** `pg` (node-postgres).
- **Authentication Provider:** Google OAuth.
- **Authentication Verification:** `google-auth-library`.
- **Session Management:** `express-session`.
- **Session Storage:** `connect-pg-simple`.
- **API Communication:** REST APIs.
- **Containerization:** Docker and Docker Compose for the PostgreSQL development database.

### Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 17 |
| Database Driver | `pg` |
| Authentication | Google OAuth |
| Authentication Verification | `google-auth-library` |
| Session Management | `express-session` |
| Session Storage | `connect-pg-simple` |
| API Communication | REST APIs |
| Containerization | Docker |
| Service Orchestration | Docker Compose |

### API Requirements

The backend provides REST APIs for:

- Google OAuth authentication and authenticated user access.
- Session restoration and logout.
- Board creation and retrieval.
- Joining boards using invitation codes.
- Board details and membership retrieval.
- Duty creation and assignment.
- Duty listing and individual duty retrieval.
- Duty editing and deletion.

The APIs enforce authentication, input validation, and board ownership or membership permissions.

### Authentication and Authorization

- Users authenticate through Google OAuth.
- The backend verifies the Google authentication result.
- Application accounts are associated with Google identities.
- Each user is identified internally using a PostgreSQL UUID.
- Express sessions maintain authenticated application state.
- Session data is stored in PostgreSQL.
- Protected operations require an authenticated session.
- Organisers can manage duties on boards they organize.
- Volunteers can access boards they have joined.
- Volunteers can update only the descriptions and statuses of duties assigned to them.
- Unauthorized operations return appropriate HTTP error responses.

### Database Design and Relationships

PostgreSQL is the primary relational database for EventTracker.

**Tables:**

- `users`: Stores application user information and Google account association.
- `boards`: Stores board details, creator IDs, invitation codes, dates, locations, and timestamps.
- `board_members`: Stores board membership and board-level roles.
- `duties`: Stores duty details, assigned volunteer IDs, creator IDs, due dates, statuses, priorities, and timestamps.
- `session`: Stores Express session data and expiry information.

**Relationships:**

- A user can create multiple boards.
- A board has one creator/organiser.
- A user can join multiple boards.
- `board_members` connects users and boards and stores each user's role for that board.
- A board can contain multiple duties.
- Each duty belongs to one board and is assigned to one volunteer who belongs to that board.
- User and board references use PostgreSQL UUIDs and foreign-key relationships.

### Database Connection and Persistence

- The backend connects to PostgreSQL using a connection pool from `pg`.
- Database connection details are supplied through environment variables.
- PostgreSQL runs in Docker during local development.
- Docker Compose manages the PostgreSQL service.
- A named Docker volume stores PostgreSQL data persistently.
- Restarting the database container does not erase saved data when the existing volume is retained.
- Database credentials and application secrets are stored in environment variables.

### Dockerization

- PostgreSQL runs using the official PostgreSQL Docker image.
- Docker Compose manages the PostgreSQL service.
- A named Docker volume provides persistent database storage.
- Environment variables configure database credentials and connection details.
- The backend connects using its configured database connection string.
- The backend exposes a `/health` endpoint to verify server and database connectivity.

**Current Development Setup:** PostgreSQL is containerized through Docker Compose. The frontend and backend can be run locally during development. Full frontend/backend/database container orchestration and production deployment are not considered completed unless separately configured.

**Data Persistence Requirement:** The PostgreSQL named volume must be retained to preserve saved data. Removing the volume will delete the stored database data.

### Application Health Checks

The backend exposes a `/health` endpoint to verify that the Express server can communicate with PostgreSQL.

- The endpoint executes a database query to confirm connectivity.
- A healthy response is returned when the database connection is available.
- An unhealthy response is returned when the database connection is unavailable.

Health checks verify service availability and database connectivity; they do not replace full application workflow testing.

## 12. Risks, Security, and Assumptions

### Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Internet connectivity issues | Internet access is required for Google authentication. |
| Database data loss | Use a persistent PostgreSQL named volume. |
| Unauthorized board access | Enforce authenticated access and membership checks. |
| Incorrect duty updates | Restrict volunteer updates to descriptions and statuses. |
| Duplicate user identification | Use unique PostgreSQL UUIDs and Google account association. |
| Unauthorized duty modification | Restrict duty operations according to board-level roles. |
| Invalid user input | Validate input on the backend. |
| Database connection failure | Use connection error handling and health checks. |
| Exposed credentials | Store secrets in environment variables. |
| Session expiry | Configure session expiry and cookie settings. |

### Assumptions

- Users access the application through a web browser.
- Users authenticate through Google accounts.
- Users choose between creating and joining boards after authentication.
- Board creators act as organisers.
- Board joiners act as volunteers.
- Roles are specific to individual boards.
- Each duty has one assigned volunteer.
- Three duty statuses are sufficient for the MVP.
- Organisers can edit all duty fields.
- Assigned volunteers can edit only descriptions and statuses.
- All authorized board members can view duties belonging to their boards.
- Internet connectivity is available.
- The PostgreSQL named volume is retained to preserve local database data.

## 13. Basic Wireframe Plan

The interface prioritizes simplicity, clear duty ownership, and easy progress tracking.

**Main Screens:**

- Google Login Page
- Dashboard Page
- Create Board Page
- Join Board Page
- Board Details Page
- Create Duty Interface
- Duty Details Page
- Edit Duty Interface

## 14. Dependencies

- Node.js and npm.
- React.js and Vite.
- Express.js.
- PostgreSQL 17.
- `pg` for database connectivity.
- `express-session` for server-side sessions.
- `connect-pg-simple` for PostgreSQL-backed session storage.
- `google-auth-library` for Google authentication verification.
- Google OAuth configuration.
- Docker and Docker Compose.
- Environment variables for application configuration.
- Persistent PostgreSQL storage.
- Internet connectivity.

## 15. Delivery and Release Plan

### Team Responsibilities and Delivery Timeline

| Week | Development Area | Responsible Member | Assigned Tasks |
|---|---|---|---|
| 1st Week | Backend API Development | Yohan | Authentication functionality |
| 1st Week | Backend API Development | Ain | Board management functionality |
| 1st Week | Backend API Development | Rishitha | Duty management functionality |
| 2nd Week | Frontend Development | Yohan | Google Login Page |
| 2nd Week | Frontend Development | Ain | Dashboard, Create Board, and Join Board pages |
| 2nd Week | Frontend Development | Rishitha | Board Details, Create Duty, Duty Details, and duty update interfaces |
| 3rd Week | Database Design and Integration | Project Team | PostgreSQL schema design, relationships, and backend integration |
| 4th Week | Docker and Environment Configuration | Project Team | PostgreSQL Docker service, persistent volume, and environment configuration |
| 5th Week | Application Integration and Delivery | Project Team | Integration testing and final deployment preparation |

### Delivery Approach

**Phase 1 – Application Development**

- Develop backend functionality.
- Build frontend pages.
- Implement Google OAuth.
- Design PostgreSQL tables and relationships.
- Implement UUID-based user identification.
- Implement board-level roles and permissions.
- Connect frontend, backend, and database.
- Implement duty management and status tracking.

**Phase 2 – Database Containerization**

- Configure PostgreSQL using Docker.
- Configure Docker Compose.
- Configure persistent PostgreSQL storage.
- Set up environment variables.
- Verify database startup and connectivity.
- Test data persistence after container restarts.

**Phase 3 – Integration and Final Delivery**

- Integrate all application components.
- Verify main workflows through the frontend.
- Test organiser and volunteer permissions.
- Test authentication and session persistence.
- Test board creation and joining.
- Test duty creation, assignment, editing, and deletion.
- Verify PostgreSQL data persistence.
- Prepare final deployment.

### Validation and Demonstration

The team will validate:

- Google OAuth authentication.
- User identification.
- Dashboard access.
- Session persistence and logout.
- Board creation.
- Invitation code generation and joining.
- Board and member visibility.
- Duty creation and assignment.
- Duty editing and deletion by organisers.
- Description and status updates by assigned volunteers.
- Access restrictions for unauthorized users.
- PostgreSQL connectivity and health checks.
- Data persistence after database container restarts.

### Expected Deliverables

- Working EventTracker web application.
- Frontend and backend source code.
- PostgreSQL database schema and integration.
- REST API implementation.
- Google OAuth authentication.
- PostgreSQL-backed session management.
- Board management and invitation code functionality.
- Duty management and status tracking.
- Docker Compose configuration for PostgreSQL.
- Persistent database storage configuration.
- Backend health check.
- README with setup and execution instructions.

## 16. Final Acceptance Criteria

The MVP will be considered ready for release when:

- Users can authenticate through Google OAuth.
- Every application user receives a unique PostgreSQL UUID.
- Google accounts are associated with application user records.
- Authenticated sessions are stored in PostgreSQL.
- Users can create boards and become organisers.
- Organisers can invite volunteers through unique invitation codes.
- Volunteers can join boards using invitation codes.
- Board membership and roles are stored correctly.
- Organisers can create, edit, and delete duties on their boards.
- Organisers can assign duties to volunteers belonging to the respective board.
- Volunteers can view duties on boards they have joined.
- Volunteers can update descriptions and statuses of their assigned duties.
- Volunteers cannot modify restricted duty fields or duties assigned to other users.
- Organisers can view the latest saved duty information.
- Unauthorized users cannot access or modify restricted information.
- The backend communicates successfully with PostgreSQL.
- PostgreSQL runs with persistent storage through the configured Docker volume.
- Saved information remains available after application and database container restarts when the existing volume is retained.
- Authentication, board management, duty management, and permissions work correctly through the frontend.

---

**Final Product Scope:** EventTracker is a centralized campus event duty management application that simplifies volunteer assignments, duty tracking, and progress monitoring through Google OAuth authentication, board-based permissions, PostgreSQL relational data storage, PostgreSQL-backed sessions, and persistent database storage.