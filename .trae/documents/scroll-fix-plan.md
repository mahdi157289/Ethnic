
# Scroll Fix Plan for Carousel Sections

## Problem
The product collection carousel (CollectionCarouselSection) and category carousel (CategoriesSection) don't support manual scrolling via touch or mouse wheel. Only the arrow buttons work.

## Solution
Add manual drag (touch and mouse) and mouse wheel scrolling support to both carousels.

## Files to Modify
1. forma/src/components/storefront/CollectionCarouselSection.tsx
2. forma/src/components/storefront/CategoriesSection.tsx

## Implementation Steps
1. For both carousels, add a mouse wheel event handler that pauses the auto-scroll and scrolls the track
2. For both carousels, add touch and mouse drag handlers for manual scrolling
3. Ensure after manual scrolling, the auto-scroll resumes if not paused

## Notes
- Use the same pattern for both sections for consistency
- When manual scrolling starts, pause the auto-scroll
- When the user stops scrolling, resume auto-scroll after a short delay if not paused by hover
