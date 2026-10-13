---
title: Master PDF proposed changes
---

## What it does

The Master PDF Report generates a structured PDF summarising vessel voyage data across legs, including waypoint filtering, weather conditions, and track classification. It produces tables for both waypoint/leg endpoints and weather observations, and computes rhumb line distances and time-weighted averages across the voyage. This document covers the behaviour introduced and revised under the Master PDF Proposed Changes epic (VO-1340), specifically the waypoint filtering and table structure change request (CR Route #57051, September 2026). Key revisions in this CR include an updated Step 1 filter, replacement of the fixed 6 h / 12 h gap-filling rule with duration-aware branching, explicit Stoppage detection and Track Type, independently controlled Weather Table fill density, and a restructured leg table showing both endpoints per leg.

## Services involved

- **Master PDF Report service** — orchestrates report generation, applies filtering rules, and renders waypoint and weather tables
- **Waypoint filtering layer** — Step 1 filter logic; determines which waypoints are included, classified, or suppressed
- **Gap-filling / stoppage detection module** — applies duration-aware branching to replace the previous fixed 6 h / 12 h gap-filling behaviour
- **Weather table renderer** — controls row density and fill rules independently of the Waypoint Table
- **Track type classifier** — assigns Track Type per leg, including the new explicit Stoppage track type

## How it flows

1. **Ingest voyage data** — raw waypoint and weather observation records for the voyage are loaded into the report service.
2. **Apply Step 1 waypoint filter** — the revised filter criteria are evaluated against each waypoint; records are marked for inclusion, classification, or suppression accordingly.
3. **Compute leg durations** — duration is calculated for each leg defined by consecutive retained waypoints.
4. **Duration-aware gap-filling branching** — based on computed leg duration, the appropriate branch of the gap-filling rule is selected (short, medium, or long gap handling), replacing the previous fixed 6 h / 12 h thresholds.
5. **Stoppage detection** — legs meeting stoppage criteria are explicitly flagged and assigned the Stoppage Track Type alongside other track classifications.
6. **Build waypoint / leg table** — the table is structured so that both the departure waypoint and arrival waypoint of each leg appear as distinct rows, providing full endpoint visibility across the voyage sequence.
7. **Build Weather Table** — weather observation rows are populated at a cadence defined independently of the Waypoint Table fill density.
8. **Compute unchanged calculations** — rhumb line distances and time-weighted averages are computed using unmodified methodology.
9. **Render and emit PDF** — all tables and computed values are assembled into the final structured PDF output.

## Inputs

- Raw waypoint records for the voyage (position, timestamp, and associated metadata)
- Weather observation records aligned to the voyage timeline
- Leg duration values derived from consecutive retained waypoints
- Step 1 filter configuration (revised criteria per this CR)
- Gap-filling branching thresholds (duration-aware, replacing fixed 6 h / 12 h values)
- Stoppage detection parameters
- Weather Table and Waypoint Table fill density configurations (now managed independently)

## Outputs / side-effects

- **Structured PDF report** containing:
  - Waypoint / leg table with both departure and arrival endpoints shown as distinct rows per leg, including Track Type (with explicit Stoppage classification where applicable)
  - Weather Table populated at its own independently defined row density
  - Rhumb line distances per leg
  - Time-weighted averages across the voyage
- **No side-effects on unchanged calculations** — rhumb line distance computation, time-weighted averaging methodology, and all downstream calculations not explicitly listed in this CR remain unaffected

## Recent changes

- 2026-10-13: [API] Master PDF CRs (Change Request)
- 2026-10-13: [API] Master PDF CRs (Change Request) — waypoint filtering (Step 1 revised), duration-aware gap-filling branching (replaces fixed 6 h / 12 h rule), explicit Stoppage detection and Track Type added, Weather Table fill density decoupled from Waypoint Table, leg table restructured to show both endpoints (VO-1444, VO-1340)
