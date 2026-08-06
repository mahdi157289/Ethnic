# Tasks

- [ ] Task 1: Fix left-column clipping in BlogPostPage so products are fully visible at the end and assure they are not trimed
  - [ ] SubTask 1.1: Remove `lg:overflow-hidden` from the left column `div` (ref={leftColRef}); replace with internal scrolling so cards aren't sliced.
  - [ ] SubTask 1.2: Replace the `lg:max-h-[calc(100%-620px)]` magic number on the product area with a measured scroll height derived from the article height (keep the existing `useEffect` that sets `maxHeight`, and apply it to the product scroll container instead of the whole column).
  - [ ] SubTask 1.3: Add a soft fade (gradient overlay) at the bottom of the scroll area to signal more products exist when overflowing.
  - [ ] SubTask 1.4: Ensure the "Voir tous les produits" button sits below the scroll area and is always fully rendered (not clipped) and aligned with the "Voir tous les articles" button.

- [ ] Task 2: Preserve the boundary-line behavior
  - [ ] SubTask 2.1: Keep the fine divider line (`lg:border-b lg:border-[var(--gold)]/30`) under both columns.
  - [ ] SubTask 2.2: Verify the product column still cannot extend past the article's end line (height sync retained), just without hard-clipping cards.

- [ ] Task 3: Verify build and live behavior
  - [ ] SubTask 3.1: Run `npm run build` and confirm no TypeScript errors.
  - [ ] SubTask 3.2: Confirm via browser that the last visible product card and the "Voir tous les produits" button are fully clear (not cut off) on a long and a short blog post, after a hard refresh.

# Task Dependencies
- Task 2 depends on Task 1 (boundary line logic lives in the same block).
- Task 3 depends on Task 1 and Task 2.
