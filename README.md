# EventTracker

EventTracker is a web application for managing volunteer duties during campus events. It provides organisers and volunteers with a centralized platform to create event boards, manage duties, track task progress, and view updates.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** Google OAuth
- **Containerization:** Docker and Docker Compose

## Prerequisites

Make sure you have the following installed:

- Node.js and npm
- Docker Desktop
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kalviumcommunity/2627SPR0I-EventTracker.git
cd 2627SPR0I-EventTracker
```

### 2. Configure Environment Variables

Create your backend environment file using the example:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and configure the required values, including:

- PostgreSQL username, password, and database name
- Database connection URL
- Session secret
- Google OAuth client ID
- Frontend client URL

Do not commit your `.env` file or expose your credentials.

### 3. Start the Backend and Database

Run the following command from the project root:

```bash
docker compose --env-file backend/.env up --build -d
```

This single command builds and starts both services:

- **app:** Builds and runs the EventTracker backend.
- **postgres:** Runs the PostgreSQL database.

The backend waits for PostgreSQL to become healthy before starting.

### 4. Verify the Services

Check the status of both containers:

```bash
docker compose --env-file backend/.env ps
```

PostgreSQL should show a healthy status, and the backend should be running.

### 5. Test the Backend

Open the following endpoint in your browser:

http://localhost:5000/health

The health endpoint checks the backend and its PostgreSQL connection.

### 6. Start the Frontend

Open a separate terminal in the project root and run:

```bash
npm install
npm run dev
```

Open the frontend at:

http://localhost:5173

## Docker Compose Commands

| Command | Description |
|---|---|
| `docker compose --env-file backend/.env up --build -d` | Build and start the backend and PostgreSQL services |
| `docker compose --env-file backend/.env ps` | Check service status |
| `docker compose --env-file backend/.env logs -f` | View service logs |
| `docker compose --env-file backend/.env logs -f app` | View backend logs |
| `docker compose --env-file backend/.env down` | Stop and remove containers |
| `docker compose --env-file backend/.env down -v` | Stop containers and delete the database volume |

**Note:** PostgreSQL data is stored in the named Docker volume `postgres_data`. This preserves database data when containers are stopped or removed. The `down -v` command deletes that volume and its stored data.

The database initialization script is automatically executed when PostgreSQL initializes a new, empty data directory.

## Backend Image Size

Measure the local backend image with:

```bash
docker build -t eventtracker-backend:lean -f backend/Dockerfile backend
docker image ls --filter reference=eventtracker-backend:lean --format "{{.Repository}}:{{.Tag}} {{.Size}}"
```

On Docker Engine 29.5.2, this image measured **272MB**. A fresh build of the previous Dockerfile on the same host measured **294MB**. These are local Docker image sizes, not compressed download sizes or pull-time estimates.

The pinned Node.js 22 Alpine runtime is the largest layer (`163MB` in `docker history`); required production dependencies add `26.4MB`. The image keeps that runtime because the backend needs Node.js. There is no compile step, so no build toolchain is installed. `npm ci --omit=dev` leaves out development tools such as `nodemon`; unused MongoDB session support is removed from production dependencies, while the legacy Mongoose models remain available for development. The Docker build context and final image also exclude `models/`, `tests/`, and `config/schema.sql`; Compose mounts the schema into PostgreSQL separately.

The README startup command above was run with the optimized image, and `/health` returned a healthy response with PostgreSQL connected. **Campus classmate pull: not measured.** No pull duration is claimed.

An image that is smaller but cannot start is not lean for this application; working startup is required.

## Project Structure

```text
EventTracker/
├── backend/
│   ├── config/
│   │   └── schema.sql
│   ├── routes/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── src/
├── docker-compose.yml
├── README.md
└── package.json
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

The [team board](Docs/team-board.md) tracks the reported sign-in redirect incident. The report is based on the behavior described by the team and has not yet been independently reproduced. Use the [workflow submission checklist](Docs/workflow-submission.md) when preparing a branch, pull request, teammate review, and recording.

## Demo Link

**Live Demo:** Add your deployed application URL once deployment is complete.

## Project Board
## Environment and Security

- Environment variables are used to configure ports and database credentials.
- Actual environment files are excluded from Git.
- Docker Compose provides the PostgreSQL service to the backend.
- The backend connects to PostgreSQL using the Compose service name `postgres`.
- Database credentials are not hardcoded into the application configuration.

## License

This project is developed as part of an academic project.