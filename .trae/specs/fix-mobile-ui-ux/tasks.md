# Tasks

- [ ] Task 1: Make the cart drawer responsive on mobile
  - [ ] SubTask 1.1: In `CartSidebar.tsx`, change the sidebar `div` from `w-96` to `w-full max-w-[90vw] sm:w-96` so it fills the screen on phones and stays 384px on desktop.
  - [ ] SubTask 1.2: Confirm the overlay (`bg-black/40 z-40`) still covers correctly at full width.

- [ ] Task 2: Make modals mobile-safe
  - [ ] SubTask 2.1: In `Modal.tsx`, add `p-4` and `overflow-y-auto` to the outer flex container and change `items-center` handling so the inner content is `my-auto` and scrollable (tall content reachable, never clipped at edges).

- [ ] Task 3: Comfortable nav tap targets
  - [ ] SubTask 3.1: In `Nav.tsx`, add `p-2` (and `cursor-pointer` if missing) to the search, cart, and hamburger icon `<button>` elements so tappable area is ≥44px on touch.

- [ ] Task 4: Verify mobile layout & build
  - [ ] SubTask 4.1: Run `npm run build` and confirm no TypeScript errors.
  - [ ] SubTask 4.2: Verify at 375px width (via browser) that: cart drawer fits without horizontal scroll, modals don't touch edges and scroll when tall, nav icons are comfortably tappable, and no content is hidden behind the fixed navbar.

# Task Dependencies
- Task 2 and Task 3 are independent of Task 1; all can run in parallel.
- Task 4 depends on Tasks 1–3.
