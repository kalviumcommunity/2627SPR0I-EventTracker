# Hosting responsibility map

## Assigned host and classification

The faculty-assigned host recorded in [SETUP.md](../SETUP.md) is **Render Free Tier**. This is **PaaS (Platform as a Service)**, not an IaaS virtual machine. Render manages the hosting platform; the team remains responsible for its application, application-level configuration, secrets, and application data.

## Region and campus suitability

**Recommended region: Singapore (not yet confirmed as the deployed region).** Render lists Singapore as an available region. It is the closest of Render's currently listed regions to Bengaluru, so it is the most sensible choice among those options for campus users in Bengaluru. Confirm the actual service region in the Render Dashboard; the repository does not currently record a deployed service URL or selected region. See [Render regions](https://render.com/docs/regions).

**Measured connect time:** Not yet measured. The repository's [README](../README.md) still has a placeholder for the live demo URL, so there is no verified deployed EventTracker endpoint to measure. After deployment, run the following from the campus network and replace this line with the actual result and test date:

```bash
curl -sS -o /dev/null -w 'DNS=%{time_namelookup}s TCP=%{time_connect}s TLS=%{time_appconnect}s TOTAL=%{time_total}s\n' "$APP_URL"
```

Do not report a guessed number as a measurement.

## Responsibility table

| Layer | Owner | Evidence and responsibility boundary |
|---|---|---|
| hardware | Provider | [Render Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) says Render secures the infrastructure that hosts hardware, software, networking, and facilities, and manages underlying servers and storage. |
| OS patches | Provider | [Render Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) explicitly says Render is responsible for keeping underlying operating systems patched and up to date. This is the key difference from an IaaS VM. |
| container runtime | Provider | [Render Services and Service Types](https://render.com/docs/service-types) describes service instances as containerized environments on Render infrastructure. The [shared responsibility model](https://render.com/docs/shared-responsibility-model) assigns secure, up-to-date supported-language runtime environments to Render. [SETUP.md](../SETUP.md) documents Docker Engine/Compose on a student development machine; that local runtime is not the hosted platform runtime. |
| network and firewall | Split — Provider: Render operates the platform's internal networking and infrastructure network controls; Team: Rishitha Katragadda owns application-level access controls and CORS configuration. | Provider boundary: [Render Shared Responsibility Model](https://render.com/docs/shared-responsibility-model) assigns internal networking between services/databases to Render and application-level configuration to the customer. Team evidence: [backend/package.json](../backend/package.json) lists the CORS dependency, but the current repository does not contain backend application source proving the policy is configured. **not yet done, closed in LU NN** (replace NN with the actual learning-unit number when this work is closed). |
| TLS | Provider | [Render managed TLS certificates](https://render.com/docs/tls) says hosted applications and static sites receive managed TLS certificates, automatically renewed, and HTTP is redirected to HTTPS. |
| database backups | Team: Amit Yohan Horo | EventTracker uses MongoDB/Mongoose, as shown in [README.md](../README.md) and [backend/package.json](../backend/package.json). This is not evidence of a Render-managed MongoDB backup. Render's [MongoDB deployment guide](https://render.com/docs/deploy-mongodb) recommends using MongoDB's backup tooling (such as `mongodump`) rather than relying on disk snapshots. No backup/restore script or verified backup policy is present in the repository: **not yet done, closed in LU NN** (replace NN with the actual learning-unit number when this work is closed). |
| secrets | Team: Rishitha Katragadda | [README.md — Environment Variables](../README.md#environment-variables) and [SETUP.md](../SETUP.md) document the need to keep credentials in environment configuration and out of Git. The actual Render environment settings must be verified in the private dashboard; no secret values are recorded here. The repository does not prove that the production settings have been configured: **not yet done, closed in LU NN** (replace NN with the actual learning-unit number when this work is closed). |
| application code | Team: Ain Kay (frontend), Rishitha Katragadda (backend), and Amit Yohan Horo (team integration/review) | The repository identifies all three students in [Contributers.md](../Contributers.md). The frontend and backend package files are [frontend/package.json](../frontend/package.json) and [backend/package.json](../backend/package.json). The role split in this row is the team's proposed ownership assignment and should be confirmed by all three students before mentor sign-off. |

## What we would have wrongly assumed

We would have wrongly assumed that the hosting provider patches the operating system even when we rent a virtual machine. The VM counter-example shows why that is incorrect: with an IaaS VM, **our team would patch the guest OS** because we administer that machine. With the assigned Render Free PaaS, Render patches the underlying operating systems and maintains the managed runtime; our team does not log in to a guest VM to apply OS updates. We still own application code, application-level security settings, secrets, and our MongoDB backup and restore plan.
