# Cloud responsibility map

## Assigned host

**Host:** Render Free Tier

**Model:** PaaS. The faculty setup record identifies Render Free as the selected host in [SETUP.md](../SETUP.md). Render manages the platform; the team remains responsible for application-level configuration, access, secrets, data, and code.

## Responsibility table

| Layer | Owner | Evidence and responsibility boundary |
|---|---|---|
| hardware | Provider | Render's [Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) says it secures the infrastructure hosting hardware, software, networking, and facilities. |
| OS patches | Provider | Render's [Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) says: “Making sure all underlying operating systems are patched and up to date.” |
| container runtime | Provider | Render's [Services and Service Types](https://render.com/docs/service-types) describes service instances as “containerized environments on Render infrastructure.” Its [Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) assigns Render responsibility for keeping supported language and framework runtime environments secure and up to date. The Docker runtime in [SETUP.md](../SETUP.md) is for local development, not the hosted Render runtime. |
| network and firewall | Split — Provider: internal networking between Render services and databases. Team: Katragadda Rishitha owns the application's CORS allow-list/configuration. | Render's [Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) assigns internal networking between services and databases to Render and application-level configuration to the customer. Team evidence: [backend/index.js](../backend/index.js) configures CORS from `CLIENT_URL`. |
| TLS | Provider | Render's [Fully Managed TLS Certificates](https://render.com/docs/tls) says hosted applications receive free, fully managed TLS certificates that Render automatically renews, and HTTP requests are redirected to HTTPS. |
| database backups | Team: Amit Yohan Horo | No backup/restore workflow or verified backup policy for EventTracker's MongoDB is recorded in this repository. Render's [Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) assigns customers their own business continuity and disaster recovery plans; Render's [MongoDB deployment guide](https://render.com/docs/deploy-mongodb) recommends database-native backup tools such as `mongodump` and warns against relying on disk snapshots. **Not yet done; close in LU NN** (replace NN with the assigned learning-unit number). |
| secrets | Team: Katragadda Rishitha | [backend/index.js](../backend/index.js) reads configuration from environment variables, and [README.md](../README.md#environment-variables) documents keeping secret values out of Git. The actual Render environment settings are not verifiable from this repository. **Not yet done; close in LU NN** (replace NN with the assigned learning-unit number). No secret values are included here. |
| application code | Team: Ain Kay (primary; frontend), with Katragadda Rishitha (backend) and Amit Yohan Horo (integration/review) | The team is listed in [README.md](../README.md#team-details). Source evidence: [frontend/](../frontend/) and [backend/](../backend/). |

## What we would have wrongly assumed

We would have wrongly assumed that the cloud company patches the OS on a VM. On an IaaS VM, the team owns guest OS updates; the provider's responsibility stops at the hypervisor. Our assigned host is Render PaaS, so Render patches its underlying operating systems. We still own application configuration, secrets, database backups, and application code.

## Region, location, and connection time

Render's [Regions](https://render.com/docs/regions) page lists Singapore, the closest currently listed Render region to Bengaluru for our campus users. **Recommended region: Singapore; the deployed service's selected region has not been verified in the Render Dashboard.** Confirm the actual region and keep the web service and any Render-hosted database in the same region.

The Render endpoint is [two627spr0i-eventtracker-1.onrender.com](https://two627spr0i-eventtracker-1.onrender.com/). A single TCP connect-time measurement from this execution environment on 2026-11-20 was **0.080748 seconds** (`time_connect`). This environment's network is not confirmed to be the campus network, so rerun the measurement from campus before submitting it as the required campus result:

```powershell
curl.exe --output NUL --silent --show-error --write-out "time_connect=%{time_connect}s`n" https://two627spr0i-eventtracker-1.onrender.com/
```
