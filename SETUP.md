# EventTracker - Local Setup

## Development Tools

- Container Runtime: Docker Engine 28.3.2
- Compose: Docker Compose v2.38.2-desktop.1
- Git: git version 2.45.2.windows.1
- PostgreSQL Client: psql 16.4

## Hosting

- Faculty-approved host: Render free tier
- Payment card: None
- Paid plan: Not used

## Container Verification

**Command:**

```bash
docker run --rm hello-world
```

**Result:**

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
