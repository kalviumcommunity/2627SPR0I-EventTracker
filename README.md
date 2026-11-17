# EventTracker

EventTracker is a web application for managing volunteer duties during campus events. It gives organisers and volunteers a centralized place to manage event boards, assign tasks, track progress, and view updates.

## Start Here

For local setup checks and prerequisites, see [SETUP.md](SETUP.md).

To start the frontend, run `npm install` and then `npm run dev` from the `frontend` directory.

The backend can be built and run independently using Docker. See [Run Backend with Docker](#run-backend-with-docker) below.

## Run Backend with Docker

The backend can be built and run inside a Docker container without installing Node.js on the host machine.

### Prerequisites

- Docker Desktop or Docker Engine installed and running.
- A reachable MongoDB database.
- The required backend environment variables.

### 1. Build the backend image

Run this command from the repository root:

```bash
docker build -t eventtracker-backend -f backend/Dockerfile backend
```

This builds the backend using `backend/Dockerfile`. Dependencies are installed inside the image using `npm ci --omit=dev`.

The `.dockerignore` file excludes local dependencies, environment files, and unnecessary files from the Docker build context.

### 2. Configure environment variables

Create a local `backend/.env` file containing the required backend configuration:

- `MONGODB_URI`
- `SESSION_SECRET`
- `CLIENT_URL`
- `GOOGLE_CLIENT_ID`

Do not commit this file or include secrets in the Docker image.

### 3. Run the container

From the repository root, run:

```bash
docker run --rm --name eventtracker-backend -p 5000:5000 --env-file backend/.env -e PORT=5000 eventtracker-backend
```

The backend listens on port `5000` by default. Its listening port is configurable through the `PORT` environment variable.

The environment file is supplied at runtime and is not copied into the Docker image.

The MongoDB database must be reachable from inside the container. If using MongoDB Atlas, provide a valid connection string in `MONGODB_URI`.

### 4. Test the backend

Open another terminal and run:

```bash
curl http://localhost:5000/health
```

A successful response indicates that the backend and MongoDB are connected.

### 5. Stop the container

Press `Ctrl+C` in the terminal running the container.

## Incident Tracking

The repository's [team board](Docs/team-board.md) points to a clearly labeled [demo incident](Docs/mock-incident.md). It is fictional and is only for practicing the branch-and-PR workflow; replace it with the team's assigned incident before submitting the course assignment.

## Problem Statement

During campus events, organisers often share volunteer assignments and progress updates across multiple chats and personal messages. This makes it difficult to identify incomplete duties, confirm who is responsible for each task, and keep track of the latest updates.

EventTracker addresses this by providing a shared duty board where organisers can create event boards, invite volunteers, assign tasks, and monitor progress. Volunteers can join boards using invitation codes, view their responsibilities, update task statuses, and submit written progress updates.

The application is designed so that the latest board information can be accessed from different devices and saved information remains available after application or database container restarts.

## Team Details

- **Team Number:** Team 02
- **Team Members:**
  - Amit Yohan
  - Ain Kay
  - Katragadda Rishitha

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | Google OAuth |
| API Communication | REST APIs |
| Containerization | Docker |
| Service Orchestration | Docker Compose |
| Deployment | Vercel / Render (deployment provider to be confirmed) |

## Features

- User registration and login
- Create event boards
- Generate unique invitation codes for boards
- Join boards using invitation codes
- Create tasks and assign them to board members
- Track task status: `Pending`, `In Progress`, or `Completed`
- Submit written progress updates
- Retain previous progress updates with their author and timestamp
- View task assignments and progress from a centralized board
- Persist MongoDB data using a Docker named volume

## Setup, Run and Test Instructions

### Prerequisites

Install the following before running the project:

- Node.js and npm (for local frontend and backend development)
- Docker
- Docker Compose (if using Docker Compose)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/kalviumcommunity/2627SPR0I-EventTracker.git
cd 2627SPR0I-EventTracker
```

### 2. Configure environment variables

Create the required `.env` files for the frontend and backend, using the variable names expected by the application.

Do not commit real credentials, database passwords, or authentication secrets to version control.

See [Environment Variables](#environment-variables) below.

### 3. Run with Docker Compose

If the repository contains a configured `docker-compose.yml`, run the following from the directory containing that file:

```bash
docker compose up --build
```

To run the services in the background:

```bash
docker compose up --build -d
```

To view running containers:

```bash
docker compose ps
```

To view service logs:

```bash
docker compose logs -f
```

To stop the services:

```bash
docker compose down
```

**Data persistence:** If the MongoDB service uses a named volume, do not remove that volume when stopping the application if you need to retain saved data. Avoid `docker compose down -v` unless you intentionally want to delete the stored database volume.

### 4. Run locally without Docker

Install dependencies in the frontend and backend directories:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

For the backend, navigate to the `backend` directory, install dependencies and start the service:

```bash
cd ../backend
npm install
npm start
```

Ensure the backend environment variables are configured before starting the backend.

### 5. Test the application

Run the test scripts provided by the project:

```bash
npm test
```

If the frontend and backend have separate test suites, run the command in each respective project directory. Check each `package.json` for the configured test command.

Manually verify the main workflow:

1. Register a user and log in.
2. Create an event board.
3. Copy the board's invitation code.
4. Join the board using another user account.
5. Create a task and assign it to a board member.
6. Update the task status as the assigned volunteer.
7. Submit a written progress update.
8. Confirm that the organiser can see the task status and update history.
9. Open the application from another device and confirm that the latest board information is available.
10. Restart the application and database container while retaining the configured named volume, then confirm that saved information remains available.

## Environment Variables

The backend uses the following environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | Backend listening port (defaults to 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret used for session management |
| `CLIENT_URL` | Frontend URL allowed by CORS |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NODE_ENV` | Application runtime environment |

Keep secrets in local environment files or deployment environment settings. Never publish actual secret values in this README or commit them to Git.

For Docker, backend environment variables are supplied at container runtime rather than being embedded in the image.

## Demo Link

**Live Demo:** [Add your deployed application URL](<DEMO_URL>)

The deployment URL is to be added once the application is deployed.

## Project Board

**Team Task Management Board:** [Add your project board URL](<PROJECT_BOARD_URL>)

Replace the placeholder with the link to the team's task management board.

## Project Scope

The MVP focuses on authentication, event board creation, volunteer invitations, task assignment, and progress tracking. Features such as AI-based volunteer assignment, automated notifications, attendance tracking, payments, advanced analytics, automated scheduling, real-time chat, a dedicated mobile application, and file attachments are outside the initial MVP scope.

---

**EventTracker — One shared board for every event duty.**
