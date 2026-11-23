# EventTracker

EventTracker is a web application for managing volunteer duties during campus events. It provides organisers and volunteers with a centralized platform to create event boards, assign responsibilities, track duty progress, and monitor updates.

Organisers can create boards, generate unique invitation codes, invite volunteers, assign duties, and monitor their completion. Volunteers can join boards using invitation codes, view their assigned duties, and update their descriptions and statuses.

## Start Here

For local setup requirements and prerequisites, see [SETUP.md](SETUP.md).

EventTracker uses:

- **Frontend:** React.js with Vite
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL 17
- **Authentication:** Google OAuth
- **Session Storage:** PostgreSQL using `connect-pg-simple`
- **Containerization:** Docker and Docker Compose

The PostgreSQL database runs through Docker Compose. The frontend and backend can be started independently during local development.

## Features

- Google OAuth authentication.
- Automatic application user identification.
- Unique PostgreSQL UUID for every application user.
- Create event boards.
- Generate unique invitation codes for boards.
- Join boards using invitation codes.
- Board-level organiser and volunteer roles.
- Create duties and assign them to board volunteers.
- Edit and delete duties as the board organiser.
- Track duty status: `Pending`, `In Progress`, or `Completed`.
- Allow assigned volunteers to update duty descriptions and statuses.
- View board members and assigned duties.
- Restrict board and duty operations according to user permissions.
- PostgreSQL-backed authentication sessions.
- Persistent PostgreSQL database storage using Docker volumes.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 17 |
| Database Driver | `pg` (node-postgres) |
| Authentication | Google OAuth |
| Authentication Verification | `google-auth-library` |
| Session Management | `express-session` |
| Session Storage | `connect-pg-simple` |
| API Communication | REST APIs |
| Containerization | Docker |
| Service Orchestration | Docker Compose |

## Project Structure

```text
2627SPR0I-EventTracker/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── schema.sql
│   ├── routes/
│   │   ├── auth.js
│   │   ├── boards.js
│   │   └── duties.js
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   └── src/
├── Docs/
├── docker-compose.yml
├── README.md
└── SETUP.md
```

## Problem Statement

During campus events, organisers often manage volunteer assignments and progress updates through multiple chats and personal messages. This makes it difficult to identify incomplete duties, confirm responsibilities, and track the latest updates.

EventTracker addresses this by providing a shared duty management platform where organisers can create event boards, invite volunteers, assign duties, and monitor progress.

Volunteers can join boards using invitation codes, view their assigned responsibilities, and update duty descriptions and statuses.

The application stores its information centrally in PostgreSQL, allowing authorized users to access saved board and duty information.

## Team Details

- **Team Number:** Team 02
- **Team Members:**
  - Amit Yohan
  - Ain Kay
  - Katragadda Rishitha

## Application Workflow

1. A user signs in using Google OAuth.
2. The backend verifies the user's Google identity.
3. The application finds or creates the corresponding user record in PostgreSQL.
4. The user is redirected to the dashboard.
5. The user chooses to create a board or join an existing board.
6. A user who creates a board becomes its organiser.
7. The system generates a unique invitation code for the board.
8. Other users can join using the invitation code and become volunteers.
9. The organiser creates duties and assigns them to board volunteers.
10. Volunteers view their assigned duties and update their descriptions and statuses.
11. The organiser monitors the latest saved duty information.

## User Roles and Permissions

Roles are assigned separately for each board. A user can be an organiser of one board and a volunteer in another.

| Action | Organiser | Volunteer |
|---|---|---|
| Create a board | Yes | Yes |
| Join another board | Yes | Yes |
| View board details | Yes | Yes, if a member |
| View board duties | Yes | Yes, if a member |
| Create duties | Yes | No |
| Assign volunteers | Yes | No |
| Edit all duty fields | Yes | No |
| Edit assigned duty description | Yes | Yes |
| Update assigned duty status | Yes | Yes |
| Delete duties | Yes | No |

Volunteers can update only the description and status of duties assigned to them. Organisers can manage all duties on boards they organize.

## Database Design

EventTracker uses PostgreSQL 17 as its primary relational database.

The database contains the following main tables:

| Table | Purpose |
|---|---|
| `users` | Stores user information and Google account association. |
| `boards` | Stores event board details, creator information, and invitation codes. |
| `board_members` | Stores board membership and board-level roles. |
| `duties` | Stores duties, assignments, descriptions, statuses, priorities, and timestamps. |
| `session` | Stores Express authentication sessions through the PostgreSQL session store. |

The application uses PostgreSQL UUIDs to identify users, boards, memberships, and duties. Foreign-key relationships maintain associations between these records.

## Authentication and Session Management

- Users authenticate using Google OAuth.
- The backend verifies Google authentication using `google-auth-library`.
- Application user records are stored in PostgreSQL.
- Every application user has a unique UUID.
- Express sessions maintain authenticated application state.
- `connect-pg-simple` stores sessions in PostgreSQL.
- Protected backend routes require an authenticated session.
- Users can log out, which destroys their session.

The application does not use a separate email/password authentication system or its own JWT authentication implementation.

## Setup, Run and Test Instructions

### Prerequisites

Install the following before running the project:

- Node.js and npm.
- Docker Desktop or Docker Engine.
- Docker Compose.
- Git.
- A Google OAuth client ID configured for the application.

### 1. Clone the repository

```bash
git clone https://github.com/kalviumcommunity/2627SPR0I-EventTracker.git
cd 2627SPR0I-EventTracker
```

### 2. Configure environment variables

Create the required `.env` files for the frontend and backend.

The backend requires the following environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | Backend listening port. Defaults to `5000`. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `SESSION_SECRET` | Secret used for Express session management. |
| `CLIENT_URL` | Frontend URL allowed by CORS. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. |
| `NODE_ENV` | Application runtime environment. |

The frontend may use:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL. Defaults to `http://localhost:5000` in the current frontend configuration. |

For the local PostgreSQL Docker configuration, the backend connection string follows this format:

```env
DATABASE_URL=postgresql://eventtracker_user:your_password@localhost:5432/eventtracker
```

Use the actual database credentials configured in your local Docker Compose file.

Do not commit `.env` files or publish database passwords, session secrets, or OAuth credentials.

### 3. Start PostgreSQL using Docker Compose

From the repository root, run:

```bash
docker compose up -d
```

To check running containers:

```bash
docker compose ps
```

To view PostgreSQL logs:

```bash
docker compose logs -f postgres
```

The PostgreSQL service uses a named Docker volume for persistent storage.

### 4. Initialize the PostgreSQL schema

For a fresh database, execute the schema file from the repository root:

```bash
docker exec -i eventtracker-postgres psql -U eventtracker_user -d eventtracker < backend/config/schema.sql
```

This creates the required database tables and relationships.

**Note:** Run the schema initialization when setting up a fresh database. Do not repeatedly execute it against an already initialized database unless the schema is designed for repeated execution.

### 5. Install backend dependencies and start the backend

Open a terminal:

```bash
cd backend
npm install
npm run dev
```

The backend should connect to PostgreSQL and start on port `5000` by default.

### 6. Install frontend dependencies and start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL displayed by Vite in your browser.

### 7. Verify backend connectivity

Open:

```text
http://localhost:5000/health
```

A successful response indicates that the backend and PostgreSQL are connected.

## Running the Backend with Docker

The backend also has a Dockerfile for building a backend image independently.

Build the image from the repository root:

```bash
docker build -t eventtracker-backend -f backend/Dockerfile backend
```

Run the container with the required environment variables:

```bash
docker run --rm --name eventtracker-backend -p 5000:5000 --env-file backend/.env -e PORT=5000 eventtracker-backend
```

**Important:** When the backend runs inside a container while PostgreSQL runs in a separate container, `localhost` inside the backend container does not refer to the PostgreSQL container. Configure `DATABASE_URL` to use a hostname reachable from the backend container, such as `host.docker.internal` when connecting to a database exposed on the host, or use a shared Docker network and the PostgreSQL service/container name.

The frontend and backend can also be run locally while PostgreSQL runs in Docker, as described in the previous sections.

## Data Persistence

PostgreSQL uses a named Docker volume to retain database data.

To stop the services:

```bash
docker compose down
```

To start them again:

```bash
docker compose up -d
```

Saved database information remains available when the existing named volume is retained.

**Important:** Avoid running the following command unless you intentionally want to delete the PostgreSQL data:

```bash
docker compose down -v
```

Removing the named volume deletes the stored database data.

## Testing the Application

Verify the main application workflow manually:

1. Sign in using Google OAuth.
2. Confirm that the user is authenticated.
3. Create an event board.
4. Confirm that the board appears on the dashboard.
5. Copy the board's invitation code.
6. Sign in using another account.
7. Join the board using the invitation code.
8. Confirm that the joined user can view the same board and its members.
9. Create a duty as the organiser.
10. Assign the duty to the volunteer account.
11. Confirm that the volunteer can view the assigned duty.
12. Update the duty description and status as the assigned volunteer.
13. Confirm that the volunteer cannot edit restricted fields or delete the duty.
14. Confirm that the organiser can edit and delete duties.
15. Refresh the application and verify that authentication and saved data behave correctly.
16. Restart the application and PostgreSQL container while retaining the named volume, then confirm that saved data remains available.

## Project Scope

The MVP focuses on:

- Google OAuth authentication.
- User identification.
- Board creation and management.
- Volunteer invitations through unique invitation codes.
- Board membership and permissions.
- Duty creation and assignment.
- Duty status tracking.
- Duty updates by assigned volunteers.
- PostgreSQL relational data storage.
- PostgreSQL-backed session management.
- Persistent database storage through Docker volumes.

The following features are outside the initial MVP scope:

- AI-based volunteer assignment.
- Automated notifications.
- Volunteer attendance tracking.
- Payment management.
- Advanced analytics.
- Automated scheduling.
- Real-time chat.
- Dedicated mobile application.
- File attachments.
- Multiple volunteers assigned to one duty.
- Separate written progress-update history.

## Incident Tracking

The repository's [team board](Docs/team-board.md) points to a clearly labeled [demo incident](Docs/mock-incident.md). It is fictional and is only for practicing the branch-and-PR workflow; replace it with the team's assigned incident before submitting the course assignment.

## Demo Link

**Live Demo:** Add your deployed application URL once deployment is complete.

## Project Board

**Team Task Management Board:** Add the team's project board URL.

---

**EventTracker — One shared board for every event duty.**