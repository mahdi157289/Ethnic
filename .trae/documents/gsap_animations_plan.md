
# GSAP Animations Implementation Plan

## Repo Research Conclusion
The project is a React + TypeScript + Vite e-commerce site for "Ethnic" (artisanal jewelry). Key sections:
- **Hero**: Landing section with rotating welcome/product images, float animation
- **CollectionCarouselSection**: Horizontal product carousel
- **FeaturedSection**: Highlighted product with 3D card effect
- **CategoriesSection**: Horizontal category carousel
- **BlogSection**: Blog posts grid
- **GallerySection**: Gallery image grid
- **AboutSection**: Company story with stats
- **NewsletterSection**: Subscription form

Current tech stack: No GSAP installed yet, only React, TypeScript, Vite, Tailwind CSS, react-router-dom, react-helmet-async.

## Files and Modules to Modify

1. **forma/package.json**: Add GSAP and GSAP ScrollTrigger dependencies
2. **forma/src/pages/HomePage.tsx**: Initialize GSAP ScrollTrigger
3. **forma/src/components/storefront/Hero.tsx**: Add entrance animations
4. **forma/src/components/storefront/FeaturedSection.tsx**: Add entrance animations
5. **forma/src/components/storefront/CategoriesSection.tsx**: Refactor to use GSAP for scroll behavior
6. **forma/src/components/storefront/CollectionCarouselSection.tsx**: Refactor carousel to use GSAP
7. **forma/src/components/storefront/AboutSection.tsx**: Add entrance + counter animations for stats
8. **forma/src/components/storefront/GallerySection.tsx**: Add staggered image animations
9. **forma/src/components/storefront/BlogSection.tsx**: Add staggered card animations
10. **forma/src/components/storefront/NewsletterSection.tsx**: Add entrance animations

## Steps for Modifications
1. **Install GSAP & ScrollTrigger**: Run `npm install gsap`
2. **Set Up GSAP ScrollTrigger**: Import ScrollTrigger in HomePage and register plugins
3. **Hero Animations**: Animate headline, description, buttons, and showcase card in sequence
4. **Collection Carousel**: Replace CSS animation with GSAP horizontal scroll
5. **Featured Section**: Add fade+slide animations for image and content
6. **Categories Section**: Replace CSS scroll with GSAP for smoother control
7. **About Section**: Animate stats counting up when in view + stagger text/ImageSlider
8. **Gallery Section**: Add staggered scale+fade for gallery images
9. **Blog Section**: Stagger blog cards in view
10. **Newsletter Section**: Fade+slide form elements into view
11. **Test & Fine-Tune**: Adjust easing, durations, delays for natural feel

## Potential Dependencies or Considerations
- Use GSAP ScrollTrigger to trigger animations when sections enter viewport
- Ensure animations are performant (avoid layout thrashing)
- Maintain mobile responsiveness
- Keep animations subtle and elegant (match the brand's luxury aesthetic)
- Use stagger animations for grid/list elements

## Risk Handling
- If GSAP conflicts with existing CSS animations, adjust selectors or use `clearProps: true`
- For infinite carousels, use GSAP's `repeat: -1` and `wrap`
- Test scroll animations on various screen sizes to ensure consistent behavior
