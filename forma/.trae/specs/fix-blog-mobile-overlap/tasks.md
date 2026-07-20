# Tasks

- [x] Task 1: Guard the height-sync effect to desktop only
  - [x] SubTask 1.1: In `BlogPostPage.tsx`, wrap the `max-height` logic inside the `useEffect`'s `syncHeight` with a `window.matchMedia('(min-width: 1024px)').matches` check. When false (mobile), set `scrollEl.style.maxHeight = ''` and `setShowFade(false)` so the strip flows normally with no overlap.
  - [x] SubTask 1.2: Add a `matchMedia` change listener (in addition to the existing `resize` listener) that calls `syncHeight`, so toggling between mobile and desktop (orientation/resize) updates the bounded vs free layout correctly. Clean up the listener on unmount.

- [x] Task 2: Restructure the grid so mobile order is image → article → products
  - [x] SubTask 2.1: Split the current two-column block into THREE grid children: (a) the blog image, (b) the article content (`ref={articleRef}`), (c) the products+button block.
  - [x] SubTask 2.2: On `lg`, place them explicitly: image `lg:col-start-1 lg:row-start-1 lg:sticky lg:top-28`, article `lg:col-start-2 lg:row-start-1`, products `lg:col-start-1 lg:row-start-2`. On mobile (`grid-cols-1`, no placement) they flow in DOM order: image → article → products.
  - [x] SubTask 2.3: Remove the now-unused `leftColRef` (declaration + ref usage + the `style` transition) since the effect no longer references it.

- [ ] Task 3: Verify build and mobile behavior
  - [x] SubTask 3.1: Run `npm run build` and confirm no TypeScript errors.
  - [ ] SubTask 3.2: At 375px, open a blog post and confirm: image first, then the article text (not buried under products), then the product strip + "Voir tous les produits" button, with no overlap.
  - [ ] SubTask 3.3: At ≥1024px, confirm desktop layout is unchanged (image left/sticky, article right, products under image, bounded scroll + fade).

# Task Dependencies
- Task 2 depends on Task 1 (both edit the same block; do after).
- Task 3 depends on Tasks 1 and 2.
