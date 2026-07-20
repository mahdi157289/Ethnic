# Fix Blog Detail Mobile Overlap Spec

## Why
On the blog detail page (`/blog/:id`), the left column's product strip is bounded to the article height via a JS `useEffect` that sets `max-height` on the inner product scroll container. That bounding logic is intended **only for the desktop two-column layout**. On mobile (`grid-cols-1`, single column), `overflow-y-auto` is gated behind `lg:` so it does NOT apply — but the `useEffect` still sets an inline `max-height` on the product container. The container therefore has a limited height with no scroll, so all 41 products overflow and render **on top of the article content** stacked below → "content and products on top of each other."

## What Changes
- Guard the height-sync `useEffect` so it only applies the `max-height` (and the fade) on `lg` (≥1024px). On mobile, clear any inline `max-height` and hide the fade so the strip flows in normal document order without overlap.
- Keep `lg:overflow-y-auto` on the product scroll container (already desktop-only) — desktop behavior unchanged.
- No change to desktop layout, the boundary line, or any other page.

## Impact
- Affected code: `src/pages/BlogPostPage.tsx` (the height-sync `useEffect` and the product scroll container `div`).
- No **BREAKING** changes; pure mobile-layout fix on the blog detail page only.

## ADDED Requirements
### Requirement: Mobile product strip must not overlap the article
On screens below `lg` (mobile/tablet single-column), the product recommendation strip SHALL render in normal flow (no JS `max-height`, no overflow) so it never overlaps or covers the blog article content.

#### Scenario: Phone width
- **WHEN** a user opens a blog post at ≤768px width
- **THEN** the product cards and the "Voir tous les produits" button flow below the image without overlapping the article text, and no product is clipped or layered on top of content.

#### Scenario: Desktop width
- **WHEN** a user opens a blog post at ≥1024px width
- **THEN** the existing bounded scroll behavior (product strip capped to article height, internal scroll, fade) is preserved exactly as before.

## MODIFIED Requirements
### Requirement: Blog product strip boundary (desktop)
The product strip remains bounded to the article's end line on `lg+` via internal scroll with a soft fade; this logic MUST NOT run on mobile.

## REMOVED Requirements
(none)
