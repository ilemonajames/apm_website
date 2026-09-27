# Phase 2 Implementation Decisions

## Selected stack

- TypeScript across the application.
- Next.js-compatible Vinext application for public pages and server routes.
- Cloudflare D1 for structured content and workflow records.
- Cloudflare R2 for approved media and documents.
- Drizzle schema and generated migrations for controlled database changes.

## Boundaries for this milestone

- The public website foundation and reusable components are implemented.
- Public content remains file-backed until the editorial interface is built.
- The initial database covers content, media, leadership, chapters and audit events.
- Membership and polling-agent tables will be added only after approval rules and data-retention requirements are confirmed.
- The current external membership portal remains linked during the transition.

## Next implementation slice

1. Confirm Phase 1 approval items.
2. Connect public content to D1 through an editorial workflow.
3. Add resource search, news and events management.
4. Define and implement membership identity and approval states.
5. Prepare the INEC location import outside migrations, with validation and an import report.
