# VO Platform Docs

Functional documentation for the Voyage Optimization platform — auto-updated on every merge to production.

## Services

| Service | What it does |
|---|---|
| [API](api) | REST layer, auth, voyage/vessel/port CRUD, Kafka producer |
| [Web](web) | React UI, map rendering, route management |
| [Route Generation](route-generation) | ABB/DTN WebSocket calls, route optimisation logic |
| [PDF Consumer](pdf-consumer) | Voyage/master PDF rendering, email delivery |
| [DB Sync](db-sync) | GeoPerform MSSQL → VO MariaDB sync |
| [Geo Crons](geo-crons) | Scheduled jobs — Kpler positions, DTN port refresh |

## Shared Infrastructure

- **DB**: MariaDB (`vo-dev`, `vo-qa-test`, `vo-uat`, `vo-prod`)
- **Kafka**: one broker per env, topics are env-suffixed
- **S3**: `vo-mir-files-{env}`
- **Auth**: JWT in cookies, SSO via GeoPerform/GeoOne
