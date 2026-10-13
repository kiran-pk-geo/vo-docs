---
title: Api
---

## What it does
- Core backend API for the voyage optimization platform, serving vessel tracking, routing, and maritime alert data to clients
- Manages and fires configurable alerts (Route Deviation, Stoppage, Conditional Area entry) when vessels meet defined conditions
- Integrates with Kpler to provide real-time vessel position data, with caching and resilience logic to handle burst traffic
- Enforces access control on vessel groups, hiding alerts when a user loses access to a vessel group
- Supports per-zone alert configuration and master PDF generation with waypoint filtering and weather data

## Inputs
- AIS vessel position updates used to evaluate alert conditions and populate alert messages
- Kpler API providing latest vessel positions, refreshed proactively ahead of high-traffic windows
- Client requests for vessel routing, alert configuration, fleet data, and master PDF generation
- Conditional Area and Route Deviation rule definitions configured by users or operators
- Fleet keys and user/vessel-group access permissions from the authorization layer

## Outputs
- Alert events (email notifications, in-app alerts) triggered by vessel behavior such as route deviation or zone entry
- Cached and proxied Kpler vessel position data served to downstream consumers
- Alert messages with AIS position details, DMS-formatted coordinates, and human-readable wording
- Master PDF documents with filtered waypoints and weather row data for voyage reporting
- Suppressed or hidden alerts when vessel-group access is revoked

## External dependencies
- Kpler API for real-time vessel position data (with timeout and retry handling)
- Internal caching layer for Kpler position data to reduce latency and absorb burst load
- Email delivery service for alert notifications
- Vessel group and access control service for permission-gating alert visibility
- Voyage optimization rules engine for evaluating Conditional Area and Route Deviation conditions

## Recent changes
- 2026-10-13: testing VO-1233
- 2026-10-13: refactor(docs): rewrite agent with strict fill-in templates, inline repair (VO-1444)
- 2026-10-13: feat(master-pdf): waypoint filtering and weather rows update (VO-1444)
- 2026-10-13: fix(docs): retry Jira API on failure, trim token to handle base64 newlines (VO-1451)
- 2026-10-13: fix(alerts): update alert notification timing for CA events (VO-1451)
- 2026-10-13: fix(docs): add missing stripFences definition, clean up code fence handling (VO-1205)
- 2026-10-13: fix(docs): strip outer code fences from Claude responses before writing to vo-docs
- 2026-10-13: feat(docs): auto-update docs agent with Jira ticket extraction and CI auto mode (VO-1205)
- 2026-10-13: ci: update vo-docs content path for astro starlight
- 2026-10-12: ci: move service docs to services/ subpath, support features/ for domain docs
- ci: simplify to changelog-only, llm runs locally
- ci: add vo-docs update workflow and script
- fix(alerts): CA email event time (VO-1451), DMS 60-second carry, hide alerts after losing vessel-group access
- feat(alerts): per-zone "Enable Alert" flag + confirmed-crossing rule for Conditional Area (VO-1205)
- fix: URI-encode fleetKey in the Kpler latest positions URL
- fix: validate fleetKey, time out hung Kpler calls, log failed cache writes
- fix: refresh Kpler latest positions ahead of the :00/:30 burst and refine latency buckets
- fix: drop mid-course update for Route Deviation alert (VO-1164)
- fix: append AIS position to Conditional Area ui_message (VO-1205)
- fix: access token expire time changed from 60 min to 15 min
- fix: apply Stoppage and Route Deviation PRD change-request wording
