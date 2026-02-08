# Specification

## Summary
**Goal:** Build an admin-only, mobile-friendly leave register for Sharaffiya Market that persistently stores employees and leave entries, supports search, and allows editing/exporting records.

**Planned changes:**
- Implement persistent backend storage in a single Motoko actor for Employees and Leave Entries with CRUD and search by optional employee filter and date range.
- Add admin-only access control using Internet Identity; block all non-admin mutating actions and show an access-denied state for signed-in non-admins.
- Create mobile-optimized navigation/screens: Home, Add Leave, Search, Employees, and per-employee Leave History.
- Build Employee Management UI (list + add form) with required Employee Name and optional Employee ID, Phone Number, Department/Section.
- Build Leave Entry UI to add leave: select employee, pick date, choose leave type (Full Day/Morning Half/Evening Half), optional reason.
- Implement Search screen to filter leave entries by optional employee and optional from/to date range, showing Employee Name, Date, Leave Type, with empty state.
- Implement per-employee Leave History page with leave entries and a monthly summary section (grouped by month with counts).
- Enable edit and delete actions for leave entries from search results and employee history, with confirmation for delete and immediate UI refresh.
- Apply a simple, clean, professional theme optimized for Android phone readability (consistent typography/spacing; avoid blue+purple palette).
- Add optional export of the currently viewed leave dataset to a downloadable CSV (PDF optional), generated client-side from fetched data.
- Set app title/branding text to “Sharaffiya Market Leave Register” (including browser tab title).
- Add and render basic static visual assets (logo + header illustration) from frontend public assets.

**User-visible outcome:** An admin can sign in with Internet Identity to add/manage employees, record/search/edit/delete leave entries, view per-employee monthly leave summaries, and export filtered leave data (CSV), all in a clean mobile-friendly UI with Sharaffiya Market Leave Register branding.
