# Master PDF CRs — Waypoint Filtering & Table Structure

## What it does

The Master PDF Report generates a structured PDF summarising vessel voyage data across legs, including waypoint filtering, weather conditions, and track classification. It produces tables for both waypoint/leg endpoints and weather observations, and computes rhumb line distances and time-weighted averages across the voyage.

This document covers the behaviour introduced and revised under the Master PDF Proposed Changes epic (VO-1340), specifically the waypoint filtering and table structure change request (CR Route #57051, September 2026).

---

## Services involved

- **Master PDF Report service** — orchestrates report generation, applies filtering rules, and renders waypoint and weather tables
- **Waypoint filtering layer** — Step 1 filter logic; determines which waypoints are included, classified, or suppressed
- **Gap-filling / stoppage detection module** — applies duration-aware branching to replace the previous fixed 6 h / 12 h gap-filling behaviour
- **Weather table renderer** — controls row density and fill rules independently of the Waypoint Table
- **Track type classifier** — assigns Track Type per leg, including the new explicit Stoppage track type

---

## Behaviour

### Waypoint filtering (Step 1)

The Step 1 filter has been revised. Previously it operated on a single fixed rule set; it now applies updated criteria aligned with the duration-aware branching introduced in this CR. Refer to the Confluence doc for the precise filter conditions.

### Gap-filling — duration-aware branching

The fixed 6 h / 12 h gap-filling thresholds have been replaced with a **duration-aware branching rule**. The branch taken depends on the computed leg duration, allowing variable handling of short, medium, and long gaps rather than applying a single threshold uniformly across all legs.

### Stoppage detection & Track Type

An explicit **Stoppage** detection step has been added. When a stoppage is identified, the leg is assigned a dedicated **Stoppage** Track Type. This Track Type is surfaced in the waypoint/leg table alongside other track classifications.

### Waypoint / leg table structure

The table has been restructured so that **both endpoints of each leg** are shown as distinct rows (departure waypoint and arrival waypoint), rather than a single collapsed row per leg. This provides full endpoint visibility for each leg in the voyage sequence.

### Weather Table fill density

Weather Table row fill density is now controlled **independently** of the Waypoint Table. The two tables no longer share a single density rule; each can be populated at its own cadence as defined in the CR.

### Unchanged calculations

The following remain unaffected by this CR:

- Rhumb line distance computation
- Time-weighted averaging methodology
- All other downstream calculations not explicitly listed above

---

## Recent changes

- 2026-10-13: [API] Master PDF CRs (Change Request) — waypoint filtering (Step 1 revised), duration-aware gap-filling branching (replaces fixed 6 h / 12 h rule), explicit Stoppage detection and Track Type added, Weather Table fill density decoupled from Waypoint Table, leg table restructured to show both endpoints (VO-1444, VO-1340)