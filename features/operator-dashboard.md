# Operator Dashboard

## What it does
Gives Operator-role users a tailored view of their assigned vessel group on the VO dashboard — showing all vessels (active and inactive), access to voyage reports, and read-only visibility into route overlays.

## Services involved
- **Web** — dashboard UI, vessel cards, route detail screen
- **API** — role-based access control, conditional area and ECA/piracy data endpoints

## How it flows
1. Operator logs in and lands on the dashboard
2. All vessels in their assigned vessel group are shown — active voyages in one colour, inactive in another
3. Tapping an inactive vessel shows a hover/detail card without the "Create Voyage" button
4. On an approved route's detail screen, Operator can preview the voyage report PDF and send it by email
5. Operator has read-only access to Conditional Areas, ECA, and piracy overlays on the map

## Inputs
- Operator user session with an assigned vessel group
- Route approval status (approved routes unlock report preview and email send)

## Outputs / side-effects
- Dashboard renders all vessels in the group, not just those with active voyages
- Voyage report PDF preview available to Operator on approved routes
- Email dispatch of master PDF voyage report (via existing send-email flow)

## Recent changes
- 2026-09-07: VO-1335 — enabled Preview Voyage Report and Send Email for Operator on approved route detail
- 2026-09-07: VO-1334 — show inactive-voyage vessels to Operator on dashboard, colour-coded
- 2026-09-07: Granted Operator read-only access to Conditional Areas overlay data
- 2026-09-07: Fixed Operator ECA and piracy read access
