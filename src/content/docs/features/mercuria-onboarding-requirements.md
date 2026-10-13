---
title: Mercuria Onboarding Requirements 
---

## What it does
This feature domain introduces a scoped **Router** role to enable Mercuria's operational workflow inside Vessel Optimizer. Where the existing router role was global and unscoped, the new Router role is vessel-group-scoped, allowing Mercuria users to plan, modify, and approve voyages only for their own assigned vessels. Routers can either approve a route directly or delegate approval to a Router Admin via a structured request-approval flow that includes email notifications and optional comments. Alongside this, Operators retain their existing scoped, read-only Dashboard access as a landing page, and a suite of supporting UI and backend changes — de-duplication of approval requests, attribution fields, visual indicators, and conditional area restrictions — ensure the feature is production-ready for Mercuria's onboarding.

## Services involved
- **api** — enforces vessel-group scoping on the Router role, wires new permissions (approve / request-approval, no mark-complete), handles idempotent approval request endpoints, sends approval notification emails, and resolves attribution fields (created-by / modified-by names)
- **web** — delivers all new UI: Router/Router-Admin role gating, Approve / Request Approval buttons with comment field, approval-requested visual indicators on pending routes, pending-tab filter, Dashboard scoping with active-route highlight, attribution "by {name}" surface, and conditional areas nav/route guard
- **db-sync** — extended to reconcile vessel-group mapping deletions so that scoping data stays consistent when vessel group memberships change upstream
- **geo-crons** — vessel-group scoping gap identified and closed during the GeoOne scoping audit (VO-1269)

## How it flows
1. A vessel-group-scoped **Router** logs in → **web** directs them to the scoped Operator Dashboard as their landing page, showing only vessels in their group.
2. Router selects a vessel, plans or modifies a route, and is presented with two primary actions: **Approve** (self-approve) or **Request Approval** (delegate to Router Admin), along with an optional comment field.
3. On **Request Approval**, **web** calls the **api** approval-request endpoint; the API applies idempotency checks to prevent duplicate requests and records the request with any supplied comment.
4. **api** sends an approval notification email (designed per VO-1288) to the relevant Router Admin, including vessel, route, and comment details.
5. The pending route appears in the Router Admin's **Pending** tab with an "approval requested" visual indicator; all route options remain visible on the map (not just the submitted one).
6. Router Admin reviews the request — the detail page pre-selects the approval request info card — and either approves or rejects; attribution fields ("by {name}" + date) are recorded and surfaced in the UI at every relevant timestamp.
7. If the approved route is subsequently modified, **api** verifies the pending-route generation end-to-end to ensure a new pending route is correctly produced.
8. **db-sync** continuously reconciles vessel-group membership changes, removing stale mappings so that scoping remains accurate without manual intervention.
9. Conditional Areas pages are restricted to Admin and Router Admin roles; **web** enforces this via nav guards and route guards, backed by **api** permission checks.

## Inputs
- A Mercuria user authenticated with the new scoped **Router** or existing **Operator** role, assigned to a specific vessel group
- A route option selected or modified by the Router within their scoped vessel group
- A Router's explicit UI action: **Approve** or **Request Approval** (with optional comment text)
- Upstream vessel-group membership changes arriving via **db-sync** reconciliation
- Router Admin interaction with a pending approval request (approve / reject)

## Outputs / side-effects
- A new or updated approval record persisted in the database, with idempotency guaranteeing no duplicate requests for the same route
- An approval notification email delivered to the Router Admin, containing route details and any comment
- Visual state changes in the UI: approval-requested badge on pending routes, pending-tab error icon suppressed for valid routes, remarks displayed for the currently selected route, attribution "by {name}" shown wherever a date is displayed
- Vessel-group scoping enforced at the API layer for all Router and Operator data access, with stale mappings cleaned up by db-sync
- Conditional Areas feature restricted (nav + route guard) to Admin and Router Admin roles only

## Recent changes
- 2025-07-01: [VO-1399] Fix — route remarks now display the remark of the currently selected route instead of the last interacted route
- 2025-07-01: [VO-1398] Fix — pending tab no longer shows route error icon for valid routes sent for approval (QA in progress)
- 2025-06-01: [VO-1346] Comment option added to Route Approval request flow — deployed to production
- 2025-05-01: [VO-1326] Filter for Pending Approval Requests — deployed to production
- 2025-05-01: [VO-1325] Upfront visual indicator on route options already sent for approval — deployed to production
- 2025-05-01: [VO-1324] All route options now visible on map during approval review, not only the submitted option — deployed to production
- 2025-04-01: [VO-1321] Mercuria Onboarding Requirements: UAT Signoff and Feedbacks — closed
- 2025-04-01: [VO-1314] Request-received info card pre-selected on detail page for Admin and Router Admin — closed
- 2025-04-01: [VO-1313] Fix — approval row icon now vertically centred — deployed to production
- 2025-03-01: [VO-1291] Mercuria Requirements UI Audit — design completed
- 2025-03-01: [VO-1288] Approval notification email template design — design completed
- 2025-03-01: [VO-1287] BE: db-sync vessel-group mapping deletion reconciliation — closed
- 2025-03-01: [VO-1286] FE: Conditional Areas restricted — nav + route guard — closed
- 2025-03-01: [VO-1285] BE: Conditional Areas restricted to Admin and Router Admin — closed
- 2025-03-01: [VO-1284] FE: Request de-duplication — button/banner state — closed
- 2025-03-01: [VO-1283] BE: Request de-duplication — idempotent approval request — closed
- 2025-03-01: [VO-1282] FE: Approval-Requested visual indicator on pending routes — closed
- 2025-03-01: [VO-1281] FE: Operator Dashboard access as landing page — closed
- 2025-03-01: [VO-1280] FE: Dashboard scoping + active-route highlight — closed
- 2025-03-01: [VO-1279] BE: Dashboard vessel-group scoping — backend data completeness — closed
- 2025-03-01: [VO-1278] FE: Attribution fields — surface "by {name}" wherever a date is shown — closed
- 2025-03-01: [VO-1277] BE: Attribution fields — schema + name resolution — closed
- 2025-03-01: [VO-1276] BE: Modify-approved-route — verify pending-route generation end-to-end — closed
- 2025-03-01: [VO-1275] FE: Request-approval flow — Approve/Request Approval buttons + comment field — closed
- 2025-03-01: [VO-1274] BE: Request-approval flow — endpoint, email, approval comment — closed
- 2025-03-01: [VO-1273] FE: Router Admin rename — Users admin UI updates — closed
- 2025-03-01: [VO-1272] BE: Router Admin rename + migration — closed
- 2025-03-01: [VO-1271] FE: New Router role — approve/request-approval UI gating — closed
- 2025-03-01: [VO-1270] BE: New Router role — permission wiring (approve/request-approval, no mark-complete) — closed
- 2025-03-01: [VO-1269] BE: Vessel-group enforcement — role audit + GeoOne scoping gap — closed
- 2025-03-01: [VO-1265] Operator gets
