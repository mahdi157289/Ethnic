# Fix Blog Detail Product Strip Clipping Spec

## Why
On the blog detail page (`/blog/:id`), the left column (blog image + "Vous aimerez aussi" product strip + "Voir tous les produits" button) is bounded to the article's height via `lg:overflow-hidden` and a JS-set `maxHeight` so the product list never crosses the fine divider line after the article. However, this hard-clips the content: the **last product cards and the "Voir tous les produits" button are cut off mid-element** and not completely visible. The user reported the products "at the end are not completely clear." We must keep the boundary line rule (products can't pass the blog's end line) while making every product and the button fully legible.

## What Changes
- Replace the hard `overflow-hidden` clip on the left column with a scroll-based boundary so cards are never sliced in half.
- Ensure the "Voir tous les produits" button is always fully visible (not clipped) and aligned at the same level as the "Voir tous les articles" button.
- Keep the fine divider line under both columns as the visual boundary the products cannot cross.
- Remove the magic `calc(100%-620px)` hack that causes inconsistent clipping; base the scroll area on the measured article height instead.
- No behavior change to: cart sidebar, blog editing, seed data, or other pages.

## Impact
- Affected code: `src/pages/BlogPostPage.tsx` (left column markup, the height-sync `useEffect`, product area scroll container).
- Affected specs: blog detail layout (two-column: image left / content right).
- No **BREAKING** changes; pure visual/layout fix on the blog detail page only.

## ADDED Requirements
### Requirement: Products must be fully visible within the bounded strip
The system SHALL display product cards in the blog detail left column such that no card is ever cut off mid-card by the boundary; the last fully-fitting cards are shown and any overflow is reachable via scrolling, with a clear fade indicating more content exists.

#### Scenario: Long article
- **WHEN** the blog article is long (tall)
- **THEN** the product strip shows multiple rows and scrolls internally without slicing the final card, and the "Voir tous les produits" button remains fully visible at the boundary line.

#### Scenario: Short article
- **WHEN** the blog article is short
- **THEN** the product strip is bounded to the article height, the visible cards are complete (not half-clipped), and the button is visible; remaining products are reachable by scrolling within the bounded area.

## MODIFIED Requirements
### Requirement: Blog product strip boundary line
The product recommendation area SHALL be bounded so it cannot extend past the fine horizontal divider line that follows the article, on all viewport sizes where the two-column layout applies (lg+). The boundary MUST be enforced without hard-clipping individual cards or the action button.

## REMOVED Requirements
### Requirement: Hard overflow-hidden clip of left column
**Reason**: It sliced the last product cards and the "Voir tous les produits" button, making them not completely clear.
**Migration**: Keep the same visual boundary (divider line + height sync) but switch the clip to an internal scroll with a soft fade so elements stay whole.
