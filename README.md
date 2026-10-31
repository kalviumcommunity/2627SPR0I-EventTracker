# EventTracker

EventTracker is a web application for managing volunteer duties during campus events. It gives organisers and volunteers a centralized place to manage event boards, assign tasks, track progress, and view updates.

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
| Authentication | JWT, bcrypt |
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

- Node.js and npm
- Docker
- Docker Compose
- Git

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

Replace the placeholders with your repository URL and project directory.

### 2. Configure environment variables

Create the required `.env` files for the frontend and backend, using the variable names expected by the application.

Do not commit real credentials, database passwords, or authentication secrets to version control. If the repository contains an `.env.example` file, use it as the reference.

See [Environment Variables](#environment-variables) below.

### 3. Run with Docker Compose

From the directory containing the `docker-compose.yml` file, run:

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

**Data persistence:** The MongoDB service should use the named volume configured in the Compose file. Do not remove that volume when stopping the application if you need to retain saved data. In particular, avoid `docker compose down -v` unless you intentionally want to delete the stored database volume.

### 4. Run locally without Docker (if supported by the repository)

Install dependencies in the frontend and backend directories:

```bash
npm install
```

Start each application using the scripts defined in its `package.json`, for example:

```bash
npm run dev
```

The exact directories and scripts depend on the repository configuration. Check the frontend and backend `package.json` files for the available commands.

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

The PRD specifies that the application needs configuration for application ports, database connection details, and authentication secrets. It does not define the exact environment variable names.

Use the exact names expected by the project's source code and `.env.example` file. The following are **illustrative names only**; confirm or replace them to match the implementation.

| Example variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `VITE_API_URL` | Backend API base URL for a Vite-based frontend, if applicable |

Keep secrets in local environment files or deployment environment settings. Never publish actual secret values in this README or commit them to Git.

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
