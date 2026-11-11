# EventTracker - Local Runtime Setup

This document describes the local development tools used for EventTracker and explains how another teammate can verify the same setup on their machine.

## 1. Container Runtime

**Runtime:** Docker Engine

**Version command:**

```bash
docker version --format '{{.Server.Version}}'
```

**My installed version:**

```text
28.3.2
```

**How to verify:**
- The command should print the Docker Engine server version.
- If Docker cannot connect to the daemon, start Docker Desktop and run the command again.
- If the command is not recognized, check whether Docker is installed and configured in PATH.

## 2. Docker Compose

**Tool:** Docker Compose

**Version command:**

```bash
docker compose version
```

**My installed version:**

```text
Docker Compose version v2.38.2-desktop.1
```

**How to verify:**
- The command should print the installed Docker Compose version.
- Docker Compose is included with Docker Desktop on this machine.
- If another teammate does not have Compose, they should install or update Docker Desktop, ensure it is running, open a new terminal, and repeat the version command.
- If Compose is still unavailable, install the Docker Compose plugin using the official Docker installation instructions.

Official guide: https://docs.docker.com/compose/install/

## 3. Git

**Tool:** Git

**Version command:**

```bash
git --version
```

**My installed version:**

```text
git version 2.45.2.windows.1
```

**How to verify:**
- The command should print the installed Git version.
- If the command is not recognized, install Git and reopen the terminal.

## 4. PostgreSQL Client

**Tool:** PostgreSQL command-line client (psql)

**Version command:**

```bash
psql --version
```

**My installed version:**

```text
psql 16.4
```

**How to verify:**
- The command should print the installed psql client version.
- If the command is not recognized, install the PostgreSQL command-line client tools and configure PATH.
- EventTracker uses MongoDB as its application database. The PostgreSQL client is included because it is required by this local setup assignment. No PostgreSQL server is required.

## 5. Faculty-Approved Hosting Choice

**Selected host:** Render Free Tier

**Payment card:** None

**Paid plan:** Not used

No paid hosting plan or payment-card trial was used for this setup.

## 6. Container Runtime Verification

**Command:**

```bash
docker run --rm hello-world
```

**Successful result:**

The terminal should display:

```text
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

**My actual result:**

```text
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
1. The Docker client contacted the Docker daemon.
2. The Docker daemon pulled the "hello-world" image from Docker Hub.
3. The Docker daemon created a new container from that image.
4. The Docker daemon streamed the output to the Docker client, which sent it to the terminal.
```

The command downloads the hello-world image if it is not already available, starts a container, displays the confirmation message, and removes the container afterward.

## 7. Quick Verification Checklist

A teammate can repeat all the setup checks using these commands in Git Bash:

```bash
docker version --format '{{.Server.Version}}'
docker compose version
git --version
psql --version
docker run --rm hello-world
```

**Expected verification:**
- Docker Engine prints its server version.
- Docker Compose prints its installed version.
- Git prints its installed version.
- PostgreSQL client prints its installed version.
- Docker displays the hello-world success message.

The versions documented above represent my development machine. Teammates should run the same commands and record their own output.