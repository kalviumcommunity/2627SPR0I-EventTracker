## Getting Started
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

## Environment and Security

- Environment variables are used to configure ports and database credentials.
- Actual environment files are excluded from Git.
- Docker Compose provides the PostgreSQL service to the backend.
- The backend connects to PostgreSQL using the Compose service name `postgres`.
- Database credentials are not hardcoded into the application configuration.

## License

This project is developed as part of an academic project.