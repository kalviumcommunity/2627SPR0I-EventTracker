# EventTracker – Product Requirements Document (PRD)

## 1. Product Overview

EventTracker is a web application that helps campus event organisers create event boards, assign duties to volunteers and track their progress through a centralized platform.

Organisers can create boards, assign tasks and invite volunteers using invitation codes. Volunteers can join boards, view their responsibilities, update task statuses and submit progress updates.

The application provides a shared platform for managing event duties and monitoring their completion.

**Product Type:** Web Application

**Target Environment:** Campus Events

**Version:** MVP 1.0

## 2. Business Problem Statement

During campus events, organisers manage volunteer assignments and progress updates through multiple channels, such as chats and personal messages.

This creates difficulties in tracking responsibilities, identifying incomplete tasks and monitoring volunteer progress.

**Goal:** Provide a centralized platform where organisers can assign duties, invite volunteers and monitor event progress.

**Primary Users:** Campus event organisers.

**Secondary Users:** Volunteers participating in the event.

**Success Criteria:** Organisers can manage assignments, monitor progress and access the latest event information across devices without losing saved data.

## 3. Stakeholder Identification

| **Stakeholder**    | **Role**                                         |
| ------------------ | ------------------------------------------------ |
| Event Organisers   | Create boards, assign tasks and monitor progress |
| Volunteers         | Join boards, view duties and submit updates      |
| Project Developers | Develop and maintain the application             |
| Event Coordinator  | Reviews and approves the application             |

**Primary Decision Maker:** Event organiser or event coordinator.

## 4. Business Impact

- **Operational Impact:** Centralizes event assignments and reduces the need to track duties through multiple conversations.
- **User Impact:** Gives volunteers clear responsibilities and organisers better visibility into task progress.
- **Reliability Impact:** Keeps event information accessible across devices and protects saved data through persistent database storage.

**Note:** Financial impact and time savings have not been quantified.

## 5. Product Objectives

The primary objectives of EventTracker are:

- Centralize event duty assignments.
- Allow organisers to create boards and assign tasks.
- Enable volunteers to join boards through invitation codes.
- Allow volunteers to update task statuses and submit progress updates.
- Help organisers monitor task completion.
- Maintain saved information across application restarts.

**Expected Outcomes:**

- Organisers can view all duties and their current status.
- Volunteers can access and update their responsibilities.
- Progress updates remain available to organisers.
- Event information remains accessible across supported devices.

## 6. Data Requirements

The application will maintain the following categories of information:

- **User Information:** Account and authentication details.
- **Board Information:** Board details, owners, members and invitation codes.
- **Task Information:** Task descriptions, assigned volunteers, deadlines and statuses.
- **Progress Information:** Written updates and their submission details.

**Data Source:** Information entered by organisers and volunteers.

**Storage:** MongoDB with persistent storage.

**Data Validation:** The application will validate user inputs, invitation codes, task assignments and progress updates.

**Data Security:** Passwords will be securely hashed, and access to information will be controlled through authentication and permissions.

## 7. KPIs and Success Metrics

The following are proposed MVP success criteria.

| **Metric**          | **Success Measure**                                          |
| ------------------- | ------------------------------------------------------------ |
| Board Creation      | Organisers can successfully create boards                    |
| Task Management     | Tasks can be created and assigned correctly                  |
| Progress Tracking   | Task statuses and written updates are saved and displayed    |
| User Access         | Organisers and volunteers can access their boards            |
| Cross-Device Access | Latest information is accessible from another device         |
| Data Persistence    | Saved information remains available after container restarts |

## 8. User Stories and Acceptance Criteria

**US-01: User Authentication**

As a user, I want to register and log in so that I can access the application.

- Users can register and log in successfully.
- Passwords are stored securely.

**US-02: Board Management**

As an organiser, I want to create boards and invite volunteers so that event responsibilities can be managed centrally.

- Organisers can create boards.
- Unique invitation codes are generated.
- Volunteers can join using valid codes.

**US-03: Task Assignment**

As an organiser, I want to create tasks and assign volunteers so that responsibilities are clearly distributed.

- Organisers can create and assign tasks to board members.
- Assigned volunteers and task details are displayed.

**US-04: Progress Tracking**

As a volunteer, I want to update my task status and submit progress updates.

- Volunteers can update their assigned tasks.
- Available statuses are Pending, In Progress and Completed.
- Written progress updates are saved with their history.

**US-05: Board Monitoring**

As an organiser, I want to view all tasks and their progress.

- Organisers can view assignments, volunteers and statuses.
- Organisers can view submitted progress updates.

**US-06: Data Availability**

As a user, I want my event information to remain available across devices and application restarts.

- The latest saved information is accessible across devices.
- Application and database container restarts do not erase saved information when the existing persistent volume is retained.

## 9. Feature Scope

**In Scope – MVP 1.0**

- User registration and login.
- Event board creation.
- Invitation code generation and board joining.
- Task creation and volunteer assignment.
- Task status management.
- Written progress updates.
- Centralized event duty board.
- MongoDB data storage.
- Docker containerization and Docker Compose.

**Out of Scope – MVP 1.0**

- AI-based task assignment.
- Automated notifications.
- Volunteer attendance tracking.
- Payment management.
- Advanced analytics.
- Real-time chat.
- Dedicated mobile application.
- File attachments.

**MVP Limitation:** The initial version focuses on event duty management and progress tracking rather than a complete event management platform.

## 10. Application Workflow

1. Organiser registers or logs in.
2. Organiser creates an event board.
3. System generates an invitation code.
4. Volunteers join using the invitation code.
5. Organiser creates and assigns tasks.
6. Volunteers view their tasks and update their progress.
7. Organiser monitors task statuses and progress updates.
8. All information is saved and remains accessible across supported devices.

## 11. Technical Workflow

### Proposed Application Architecture

- **Frontend:** User interface for authentication, board management and task tracking.
- **Backend:** Handles application logic, authentication, board management and task operations.
- **Database:** Stores user, board, task and progress information.
- **Deployment:** Makes the application accessible through a shared web address.

### Technology Stack

| **Component**         | **Technology**          |
| --------------------- | ----------------------- |
| Frontend              | React.js                |
| Backend               | Node.js with Express.js |
| Database              | MongoDB                 |
| Authentication        | JWT and bcrypt          |
| API Communication     | REST APIs               |
| Containerization      | Docker                  |
| Service Orchestration | Docker Compose          |
| Deployment            | Vercel / Render         |

### API Requirements

The backend will provide REST APIs for:

- User authentication.
- Board creation and management.
- Volunteer board joining.
- Task creation, assignment and retrieval.
- Task status updates and progress tracking.

The APIs will enforce authentication, input validation and access permissions.

**External API Integration:** No external third-party APIs are required or used in the initial MVP. The application uses its own REST APIs for frontend and backend communication.

### Dockerization

The application will use Docker to provide consistent development and deployment environments.

- Separate Dockerfiles for frontend and backend.
- MongoDB running as a separate service using its official Docker image.
- Docker Compose to manage all application services.
- Dedicated Docker network for service communication.
- Environment variables for application configuration and credentials.
- Named Docker volume for persistent MongoDB storage.
- Health checks for service availability.

**Data Persistence Requirement:** Recreating or restarting application containers must not delete saved database information. MongoDB data must remain available through its existing named volume.

## 12. Risks, Security and Assumptions

| **Risk**                     | **Mitigation**                                                               |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Internet connectivity issues | Require internet access for application usage                                |
| Database data loss           | Configure persistent MongoDB storage                                         |
| Unauthorized board access    | Enforce authentication and board membership permissions                      |
| Incorrect task updates       | Restrict updates to assigned volunteers                                      |
| Invalid user input           | Validate data on frontend and backend                                        |
| Docker service failure       | Configure health checks and service dependencies                             |
| Exposed credentials          | Store secrets in environment variables and exclude them from version control |

### Assumptions

- Organisers and volunteers can access the application through a web address.
- Volunteers will join boards using invitation codes.
- Three task statuses are sufficient for the MVP.
- Each task will have one assigned volunteer.
- All board members can view tasks, but only authorized users can modify them.
- Internet connectivity will be available.

**Privacy Consideration:** Only information required for user accounts and event management will be collected.

## 13. Basic Wireframe Plan

The interface will prioritize simplicity, clear task ownership and easy progress tracking.

## 14. Dependencies

- React.js and Node.js/Express.js development environments.
- MongoDB database.
- JWT and bcrypt authentication dependencies.
- Docker and Docker Compose.
- Environment variables for application configuration.
- Persistent storage for MongoDB.
- Deployment environment supporting the selected application services.
- Internet connectivity.

## 15. Delivery and Release Plan

### Team Responsibilities and Delivery Timeline

| **Week**     | **Development Area**                       | **Responsible Member** | **Assigned Tasks**                                                                  | **Deadline** |
| ------------ | ------------------------------------------ | ---------------------- | ----------------------------------------------------------------------------------- | ------------ |
| **1st Week** | Backend API Development                    | Yohan                  | Authentication functionality                                                        | 1st week     |
| <br>         | <br>                                       | Ain                    | Board management functionality                                                      | 1st week     |
| <br>         | <br>                                       | Rishitha               | Task management and progress tracking functionality                                 | 1st week     |
| **2nd Week** | Frontend Development                       | Yohan                  | Signup Page and Login Page                                                          | 2nd week     |
| <br>         | <br>                                       | Ain                    | Dashboard Page, Create Board Page and Join Board Page                               | 2nd week     |
| <br>         | <br>                                       | Rishitha               | Board Tasks Page, Create Task Page, Task Details Page and Progress Updates Section  | 2nd week     |
| **3rd Week** | Database Design and Integration            | Yohan                  | Users collection and authentication data                                            | 3rd week     |
| <br>         | <br>                                       | Ain                    | Boards collection, invitation codes, owners and members                             | 3rd week     |
| <br>         | <br>                                       | Rishitha               | Tasks and Progress Updates collections                                              | 3rd week     |
| **4th Week** | Docker and Containerization                | Yohan                  | Frontend Dockerfile                                                                 | 4th week     |
| <br>         | <br>                                       | Ain                    | Docker Compose, MongoDB service, network and persistent volume                      | 4th week     |
| <br>         | <br>                                       | Rishitha               | Backend Dockerfile, environment variables and database connection configuration     | 4th week     |
| **5th Week** | Application Integration and Final Delivery | Project Team           | Integrate all components, verify application workflows and prepare final deployment | 5th week     |

### Delivery Approach

**Phase 1 – Application Development (Weeks 1–3)**

- Develop backend functionality.
- Build the required frontend pages.
- Design and integrate database collections.
- Connect the frontend, backend and database.

**Phase 2 – Containerization (Week 4)**

- Create frontend and backend Dockerfiles.
- Configure Docker Compose.
- Configure MongoDB persistent storage.
- Set up service communication and health checks.

**Phase 3 – Integration and Final Delivery (Week 5)**

- Integrate all application components.
- Verify the main application workflows.
- Run the application using Docker Compose.
- Demonstrate data persistence after container restarts.
- Prepare the final application deployment.

### Validation and Demonstration

The team will validate the main application workflows, including:

- Registration and login.
- Board creation and volunteer joining.
- Task creation and assignment.
- Task status and progress updates.
- Organiser access to task progress.
- Cross-device access.
- Data persistence after container restarts.

### Expected Deliverables

- Working EventTracker web application.
- Frontend and backend source code.
- MongoDB integration.
- REST API implementation.
- Frontend and backend Dockerfiles.
- Docker Compose configuration.
- Persistent database storage configuration.
- Deployed application.
- README with setup and execution instructions.

**Deployment Environment:** To be finalized.

## 16. Final Acceptance Criteria

The MVP will be considered ready for release when:

- Users can register and log in.
- Organisers can create boards and invite volunteers.
- Volunteers can join boards using invitation codes.
- Organisers can create and assign tasks.
- Volunteers can update their assigned task statuses.
- Volunteers can submit written progress updates.
- Organisers can view all assignments and progress.
- Unauthorized users cannot access or modify restricted information.
- The application runs using Docker Compose.
- Frontend, backend and database services communicate correctly.
- MongoDB uses persistent storage.
- Saved information remains available after application and database container restarts, provided the existing volume is retained.

**Final Product Scope:** EventTracker is a centralized campus event duty management application that simplifies volunteer assignments, task tracking and progress monitoring through a web-based platform with Docker-based deployment and persistent data storage.
