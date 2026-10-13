```
---
title: Alert 3 - Conditional Areas
---

## What it does
Monitors vessels on approved, active voyages and generates alerts whenever a vessel crosses the boundary of a configured Conditional Area — specifically High-Risk Areas (HRA), Emission Control Areas (ECA), or any No-Go Zone that has alerting enabled. Alerts fire only on confirmed boundary crossings (entry or exit), not on every position update, reducing noise for operators.

## Services involved
- **api** — conditional area alert orchestration, per-zone enable/alert flag logic, confirmed-crossing rule evaluation
- **geo-crons** — triggers point-in-polygon checks after each incoming Kpler AIS position update
- **db-sync** — persists crossing state and alert records between position updates

## How it flows
1. Kpler delivers a new AIS position update for a vessel on an approved active voyage.
2. The geo-crons service runs a point-in-polygon check against all configured Conditional Areas (HRA, ECA, enabled No-Go Zones).
3. The api compares the vessel's previous zone membership with the current result to determine whether a confirmed boundary crossing (entry or exit) has occurred.
4. If a crossing is confirmed and the per-zone "Enable Alert" flag is on, the api assembles an alert payload including the event type, a UI message, and the vessel's AIS position formatted in DMS coordinates.
5. The alert is persisted and an email notification is dispatched to subscribed users.

## Inputs
- Kpler AIS position updates (latitude/longitude per vessel)
- Voyage record status (must be approved and active)
- Conditional Area polygon definitions (HRA, ECA, No-Go Zones) with per-zone "Enable Alert" flag

## Outputs / side-effects
- Alert record created in the database for each confirmed boundary crossing
- Email notification sent to users with event type, UI message, and vessel position in DMS format
- No alert generated when the vessel remains inside or outside the same zone between consecutive updates

## Recent changes
- **per-zone Enable Alert flag + confirmed-crossing rule** — alerting can now be toggled independently per Conditional Area zone; alerts only fire on confirmed crossings, not transient position noise
- **AIS position appended to alert UI message** — the vessel's coordinates at the moment of crossing are now included in the notification message for operator context
- **DMS coordinate conversion fix** — corrected a bug where a zero-valued latitude or longitude component was silently dropped during conversion to degrees/minutes/seconds format
- **email payload forwarded** — `ui_message` and `event_type` fields are now correctly propagated through to the alert email payload
- **initial Conditional Area alert backend** — foundational implementation of the point-in-polygon check, crossing detection, and alert generation pipeline
```