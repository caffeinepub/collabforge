# Specification

## Summary
**Goal:** Build the CollabForge MVP for creative collaboration: Internet Identity onboarding, rich creative profiles + quiz, smart collaborator matching, project discovery and applications, and per-project collaboration spaces.

**Planned changes:**
- Add Internet Identity sign-in with first-run onboarding that creates a user record and routes new users to profile setup; returning users go to a dashboard.
- Implement Creative Profile data model and CRUD (display name, bio, multi-select tags, skill level, genres/styles, goals, availability, vibe tags, inspirations list, portfolio links with URL validation, and “Looking for” text) with owner-only edits and public profile viewing.
- Build a re-takeable Creative Profile Quiz that persists latest answers, is editable from settings/profile, and gates match suggestions until completed.
- Implement Smart Matching: ranked collaborator suggestions based on quiz/profile overlap with a swipe-style Like/Pass UI, persistence of decisions, basic match explanations, and self-like/pass prevention.
- Add project-based discovery: create/edit/archive project postings with required fields, browse a project feed, filter by roles needed and genres/styles, and view project details.
- Add project applications and invitations: apply with message + role, track status, owners review accept/reject, owners invite specific users, and enforce project-owner authorization.
- Provide per-project collaboration spaces for members only: task board (To do/Doing/Done) and text-only async message board with polling/refresh updates.
- Add minimal collaboration history and ratings: project completion by owner, member-to-member ratings (communication, reliability, skill accuracy), and aggregated rating summaries + completed collaborations on profiles.
- Create core navigation and pages: Landing, Dashboard, Profile, Quiz, Matches, Projects (feed + create), Project Detail, Collaboration Space, and Settings; ensure routing works on refresh with loading/empty states and anonymous access limited to Landing.
- Apply a coherent visual theme across the app (avoid blue/purple as the primary palette) and ensure consistent component styling.
- Include generated static visual assets (logo + small UI illustrations) served from the frontend and used on Landing and at least one empty state.
- Add basic account/safety controls: soft-delete own account (hide from discovery) and reporting of users/projects with persisted report records for future admin review.

**User-visible outcome:** Users can sign in with Internet Identity, set up and manage a creative profile and quiz, browse and swipe through ranked collaborator matches, post and discover projects, apply/invite collaborators, collaborate inside project spaces with tasks and messages, complete projects and rate collaborators, and manage account deletion/reporting—all within a consistently themed UI.
