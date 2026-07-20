# Product Card Updates Plan

## Repo Research Conclusion
- The product card is in `src/components/storefront/ProductCard.tsx`
- The image slider logic is in `src/hooks/useImageSlider.ts`
- The current add-to-cart button uses a `+` SVG icon

## Files to Edit
1. `src/components/storefront/ProductCard.tsx`
   - Replace `+` icon with a shopping cart SVG icon

## Steps for Modifications
1. Update the add-to-cart button's SVG in ProductCard.tsx to use a shopping cart icon instead of `+`
2. Verify the change looks correct and matches the design

## Notes
- The stop function already resets to index 0, so image scroll pausing is already implemented via existing onMouseEnter/onMouseLeave events that call `start` and `stop`!
