---
title: Route Approval
---

# Route Approval

## What it does
Allows route requesters to add a comment when submitting a route for approval, so approvers have context before acting. Manages the full approval request lifecycle including email notifications to approvers.

## Services involved
- **Web** — approval request UI, comment input on request screen
- **API** — approval request endpoint, comment validation, email dispatch trigger
- **PDF Consumer** — sends approval-request email via Kafka job

## How it flows
1. Requester selects a route and clicks "Request Approval"
2. A comment field is available on the request screen (previously only on the approve screen)
3. Comment is validated server-side — HTML and script characters are rejected
4. API publishes an email job to the pdf-consumer Kafka topic
5. Approver receives an email with the request details and comment
6. Approver acts (approve/reject) from their inbox or the VO app

## Inputs
- Requester submitting a route with optional comment text
- `APPROVALS_INBOX_EMAIL` env var (recipient for approval-request emails)

## Outputs / side-effects
- Comment stored on the approval request record
- Email sent to approver via pdf-consumer with request context
- XSS-safe: HTML and script characters stripped from comment before storage and email interpolation

## Recent changes
- 2026-09-14: VO-1346 — added comment field on route approval request screen
- 2026-09-07: Removed "View Details" button from approval-request email template
- 2026-09-07: Fixed XSS vulnerability in approval comment (CWE-20)
- 2026-09-07: Switched approval email hero image to frontend-hosted asset
