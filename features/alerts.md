# Alerts

## What it does
Monitors active voyages and vessel movements against configured thresholds, then notifies watchers by email when a condition is breached. Covers stoppage, route deviation, weather constraint, and conditional area alert types.

## Services involved
- **API** — alert configuration, threshold validation, watcher management, alert sweep scheduling
- **Geo Crons** — periodic sweep that evaluates alert conditions against Kpler position data
- **Web** — alert setup UI, threshold input, watcher assignment

## How it flows
1. Router configures an alert for a voyage — sets type, threshold, and watchers
2. Geo Crons sweeps active voyages at regular intervals
3. Each sweep fetches latest vessel positions from the Kpler movement cache
4. If a threshold is breached, an alert event is created and emails sent to watchers
5. Watchers must have current access to the vessel group to receive emails

## Inputs
- Alert configuration (type, threshold, watcher list) set by Router
- Kpler vessel position data refreshed from DB before each sweep
- Vessel group membership — only users with current access receive notifications

## Outputs / side-effects
- Alert event records written to DB on breach
- Email notifications to watchers
- Threshold values validated against field ranges on save — invalid configs rejected at creation time

## Recent changes
- 2026-10-05: Fixed stoppage alert detection edge cases
- 2026-10-05: Applied PRD wording update for Stoppage and Route Deviation alert copy
- 2026-09-20: Fixed alert recipients — scoped vessel-group access check to scoped roles only
- 2026-09-14: Kpler movement cache refreshed from DB before each alert sweep to prevent stale data
- 2026-09-07: Fixed alert user instance creation issue
- 2026-09-07: Fixed role-based alert access (alert-roles fix)
