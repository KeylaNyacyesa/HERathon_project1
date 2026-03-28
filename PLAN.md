# HERathon Roadmap & UI Overhaul Plan

## 1. System Review & Backend Validation
- [ ] **Data Models:** Ensure User, Challenge, Submission, Mentorship, Team, and Scholarship schemas are fully robust and interrelated properly.
- [ ] **API Logic:** Verify robust error handling, proper HTTP status codes, and security (JWT & password hashing). Ensure mentor logic only triggers what mentors should trigger.
- [ ] **Data Flow Check:** Ensure there are no unhandled promise rejections or leaky endpoints.

## 2. UI/UX Global Redesign (The Overhaul)
- [ ] **Design System (`style.css`):**
  - Implement CSS variables for consistent theming (Dark mode by default, vibrant accents: #3b82f6 for primary, #10b981 for success, etc.).
  - Set modern typography (Inter, Poppins, or system-ui).
  - Create standard modular components: Buttons, Input fields, Cards, Navbars, Toasts.
- [ ] **Responsiveness:**
  - Introduce max-width containers and flexbox/CSS grid layouts that collapse gracefully on mobile.
  - Convert multi-column layouts into stackable blocks using `@media` queries.
  - Implement mobile hamburger menu if navigation gets too large.

## 3. Screen-by-Screen Implementation
- [ ] **Authentication (`index.html`):** Turn into a beautiful split-screen or centered floating card with a modern login/register toggle.
- [ ] **Onboarding Wizards (`onboarding.html`, `select-courses.html`, `select-topics.html`, `profile.html`):** Unify these into a sleek "Step 1 of X" visual flow. Floating cards, progress bars.
- [ ] **Dashboard (`dashboard.html`):** The heart of the app. Sidebar navigation instead of top grids. Responsive widgets for points, level, and next challenges.
- [ ] **Challenge Map (`challenges.html`):** Ensure the SVGs scale properly on mobile. Add hover states, tooltips, and make it look visually stunning like a real game map.
- [ ] **Mentorship / Submissions Review (`submissions-review.html`, `mentorship.html`):** Clean Kanban-like or structured list view for mentors to evaluate submissions easily. Needs clear typography for reading feedback.

## 4. Final Polish & Teams/Scholarships Integration
- [ ] Implement the Teams interface (`teams.html`) so students can collaborate.
- [ ] Implement the Scholarships interface, gated by student level.
- [ ] Test end-to-end full responsiveness on multiple screen sizes.
