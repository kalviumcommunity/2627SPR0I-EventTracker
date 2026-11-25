# Data Isolation: Local and Demo Stores

## 1. Local Store

The local development environment uses PostgreSQL 17 through Docker Compose.

- **Service:** `postgres`
- **Storage:** Compose named volume `postgres_data`
- **Container data path:** `/var/lib/postgresql/data`
- **Port:** `5432`

The named volume `postgres_data` persists local database data across container restarts and recreation.

## 2. Demo Store

**demo store: not assigned yet**

The faculty-assigned demo host has not been provided yet. No additional paid host or database is being introduced.

The demo database will be configured separately when the faculty host is assigned. Its credentials must be stored securely on that host and must not be committed to this repository.

## 3. Local Reset Command

To reset the local Docker Compose database and remove its persisted data:

```bash
docker compose down -v
```

This command stops and removes the local Compose containers and removes the Compose-managed named volumes, including `postgres_data`.

**Warning:** This permanently deletes the local database data stored in that volume. It should only be run when a local reset is intended.

## 4. Why the Local Reset Cannot Affect the Demo Store

The reset command operates on the Docker Compose project running in the local development environment.

The local PostgreSQL data is stored in the Docker-managed named volume `postgres_data` on the local machine.

The command does not connect to a remote PostgreSQL server, execute remote SQL statements, or access a faculty-hosted database.

Therefore, resetting the local Compose volume cannot reset or delete data in the faculty demo store.

## 5. Separate DATABASE_URL Configuration

Local development and the faculty demo environment must use separate database connection URLs.

### Local development

The backend's local `DATABASE_URL` is constructed in `docker-compose.yml`:

```text
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
```

The hostname `postgres` resolves to the local PostgreSQL service within the Docker Compose network.

### Faculty demo

```text
demo store: not assigned yet
```

The faculty demo environment will receive its own `DATABASE_URL` when the assigned host and database are provided.

The local and demo environments must not share one `DATABASE_URL`. Demo credentials must never be committed to the repository.

## 6. Data Isolation Guarantee

- Local experiments and resets use the local Compose named volume `postgres_data`.
- The faculty demo database is a separate environment.
- No demo database credentials are stored in this repository.
- Local database resets must never be used to demonstrate or test demo database resets.