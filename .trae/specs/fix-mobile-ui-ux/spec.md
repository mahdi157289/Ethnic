# Fix Mobile UI/UX Spec

## Why
The site is built desktop-first. On phones (~375px) several overlays and controls break or feel unpolished: the cart drawer is a fixed `w-96` (384px) that overflows the viewport, modals can touch screen edges / clip tall content, and the nav icon buttons have no tap-target padding. The goal is a clean, luxury mobile experience consistent with the desktop brand (dark + gold, Cormorant/Montserrat, no emojis, clear hover/focus, 4.5:1 contrast).

## What Changes
- **CartSidebar**: make it responsive — full width on mobile, fixed width on desktop (`w-full max-w-[90vw] sm:w-96`), so it never overflows small screens.
- **Modal overlay**: add edge padding (`p-4`) and scroll-safety (`overflow-y-auto`, `my-auto`) so modals never touch screen edges and tall content (checkout, quick view) is reachable on mobile.
- **Nav icon buttons** (search, cart, hamburger): add tap-target padding (`p-2`) and `cursor-pointer` so they're comfortably tappable (≥44px) on touch.
- **Mobile nav offset**: confirm page top padding clears the fixed navbar on small screens (no content hidden behind it).
- No behavior change on desktop beyond the responsive widths; no changes to other pages' logic.

## Impact
- Affected code: `src/components/cart/CartSidebar.tsx`, `src/components/ui/Modal.tsx`, `src/components/layout/Nav.tsx`.
- Affected pages: all (cart, checkout, quick view, order success, navigation).
- No **BREAKING** changes; pure responsive/CSS fixes.

## ADDED Requirements
### Requirement: Cart drawer fits mobile viewport
The cart sidebar SHALL occupy the full viewport width on screens below `sm` (≤640px) and a fixed width (≤384px) on larger screens, never causing horizontal overflow.

#### Scenario: Phone width
- **WHEN** a user opens the cart on a 375px-wide screen
- **THEN** the drawer covers the screen edge-to-edge without horizontal scroll and the close/checkout controls are fully visible.

### Requirement: Modals are mobile-safe
Every `Modal` SHALL have inner padding and allow vertical scrolling so content is never clipped at the top/bottom or touching screen edges on small screens.

#### Scenario: Tall checkout modal on phone
- **WHEN** the checkout modal opens on a phone and its content exceeds the viewport height
- **THEN** the overlay scrolls and all fields/buttons remain reachable.

### Requirement: Comfortable tap targets in nav
Nav icon buttons SHALL have sufficient padding (≥44px tappable area) on touch devices.

#### Scenario: Tap cart icon on phone
- **WHEN** a user taps the cart/search/hamburger icons on mobile
- **THEN** the hit area is comfortably large and triggers the action.

## MODIFIED Requirements
### Requirement: Mobile layout consistency
Pages SHALL reserve top spacing equal to the fixed navbar height on mobile so no heading/content is hidden behind the nav.

## REMOVED Requirements
(none)
