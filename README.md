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

Create a local backend config from the example. If `backend/.env` already exists, edit that private file rather than overwriting it:

```bash
cp backend/.env.example backend/.env
```

Make sure `backend/.env` has all backend and local Compose variables listed below. Replace the placeholder database password and session secret with local values, and keep this config untracked.

Create a frontend config from its example. If `frontend/.env` already exists, edit it rather than overwriting it:

```bash
cp frontend/.env.example frontend/.env
```

Set `VITE_GOOGLE_CLIENT_ID` to the Google OAuth client ID used by the backend. Vite embeds `VITE_*` values into the frontend bundle; do not put secrets in frontend env files.

### 3. Build the Backend Image and Start the Backend and Database

Build the backend image once, then start the local backend and database with the local config:

```bash
docker compose --env-file backend/.env build app
docker compose --env-file backend/.env up --no-build -d
```

The first command creates `eventtracker-backend:lean`. The second starts both services using that image:

- **app:** Runs the EventTracker backend from the image built in the previous command.
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
| `docker compose --env-file backend/.env build app` | Build the backend image once |
| `docker compose --env-file backend/.env up --no-build -d` | Start the backend and PostgreSQL services using the existing image |
| `docker compose --env-file backend/.env ps` | Check service status |
| `docker compose --env-file backend/.env logs -f` | View service logs |
| `docker compose --env-file backend/.env logs -f app` | View backend logs |
| `docker compose --env-file backend/.env down` | Stop and remove containers |
| `docker compose --env-file backend/.env down -v` | Stop containers and delete the database volume |

**Note:** PostgreSQL data is stored in the named Docker volume `postgres_data`. This preserves database data when containers are stopped or removed. The `down -v` command deletes that volume and its stored data.

The database initialization script is automatically executed when PostgreSQL initializes a new, empty data directory.

## Local and Demo Configuration

The backend image is tagged `eventtracker-backend:lean`. The local Compose commands above build it once and start it with `backend/.env`. To run that exact same image against a demo-host database, copy `backend/.env.demo.example` to the ignored `backend/.env.demo`, replace its placeholders with the demo host's private values, then run:

```bash
docker run --rm --env-file backend/.env.demo -p 5000:5000 eventtracker-backend:lean
```

This command does not build an image. `DATABASE_URL`, `CLIENT_URL`, `SESSION_SECRET`, and `GOOGLE_CLIENT_ID` are supplied to the backend at container startup, not baked into the image; use different ignored config files to run the same image locally and on the demo host. Keep private database URLs and secrets out of Git. If the incident has a campus-specific endpoint, use another ignored config file with the same image rather than building another image.

The frontend has a separate `frontend/.env.demo.example` for its demo API URL and OAuth client ID. Copy it to `frontend/.env.demo` and build the frontend with `npm run build -- --mode demo`. Unlike backend settings, Vite embeds public `VITE_*` values such as `VITE_API_URL` into the frontend bundle at build time; this does not rebuild the backend image.

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
│   ├── .env.demo.example
│   └── package.json
├── frontend/
│   ├── .env.example
│   ├── .env.demo.example
│   └── src/
├── docker-compose.yml
├── README.md
└── package.json
```

## Environment Variables

The committed `.env.example` files contain placeholders or safe local defaults only. Use private, ignored env files for real credentials and hostnames.

| Variable | Used by | Purpose |
|---|---|---|
| `PORT` | Backend and Docker Compose | Backend listening port; defaults to `5000`. |
| `NODE_ENV` | Backend and Docker Compose | Runtime mode; controls production cookie security. |
| `POSTGRES_USER` | Docker Compose | Local PostgreSQL username. |
| `POSTGRES_PASSWORD` | Docker Compose | Local PostgreSQL password. Keep the real value private. |
| `POSTGRES_DB` | Docker Compose | Local PostgreSQL database name. |
| `DATABASE_URL` | Backend and Docker Compose | PostgreSQL connection string. Compose builds the local URL from the `POSTGRES_*` values; the demo config points to its database host. |
| `SESSION_SECRET` | Backend | Secret used to sign sessions. Keep the real value private. |
| `CLIENT_URL` | Backend | Frontend origin allowed by CORS. |
| `GOOGLE_CLIENT_ID` | Backend | OAuth audience used to verify Google credentials. |
| `VITE_API_URL` | Frontend (Vite) | Backend API base URL embedded in the frontend bundle. |
| `VITE_GOOGLE_CLIENT_ID` | Frontend (Vite) | Public Google OAuth client ID; use the same client ID as `GOOGLE_CLIENT_ID`. |

`frontend/.env` and `frontend/.env.demo` are ignored local files. The backend `.env` variants are also ignored; only the `.example` templates are committed.

## License

This project is developed as part of an academic project.