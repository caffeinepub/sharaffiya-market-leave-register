# Specification

## Summary
**Goal:** Fix the production white-screen issue by preventing runtime crashes on initial load and showing a styled error fallback when unexpected errors occur.

**Planned changes:**
- Add a safe browser polyfill for `process.env` in `frontend/index.html` to prevent `process is not defined` runtime errors.
- Ensure `process.env.II_URL` has a sensible default value when missing so the Internet Identity sign-in flow can still start.
- Add a top-level React error boundary (or equivalent) that displays a themed error screen with clear English text and a Reload action instead of a blank page.

**User-visible outcome:** On fresh production loads, the app shows the normal UI (e.g., loading/login) rather than a white screen, and if an unexpected error occurs the user sees a styled “Something went wrong” screen with a Reload button.
