
# Fix Auto-Scroll Plan
## Issues Found
1. CSS `transition` on scroll tracks conflicts with GSAP animations
2. Auto-scroll may start before images are loaded, leading to incorrect `scrollWidth`
3. No resize handler to recalculate scroll distance when window size changes

## Plan Steps
1. **Update Forma CSS**: Remove transition from `.categories-scroll-track` and `.products-scroll-track`
2. **Update CollectionCarouselSection**:
   - Add a ref to track if images are loaded, or use useEffect with a timeout/load event
   - Add window resize listener to recalculate the tween
   - Ensure the GSAP tween is properly started and restarted when needed
3. **Update CategoriesSection with same fixes**
4. **Test all features**: Auto-scroll, hover pause/resume, drag, touch, arrow buttons
