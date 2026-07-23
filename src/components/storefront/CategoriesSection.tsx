import { useStore } from '../../context/StoreContext';
import { useInfiniteCarousel } from '../../hooks/useInfiniteCarousel';
import { useGsapReveal } from '../../hooks/useGsapReveal';
import { SectionTitle } from '../ui/SectionTitle';
import { ScrollArrows } from '../ui/ScrollArrows';

export function CategoriesSection() {
  const { categories, products, filterByCategory } = useStore();
  const {
    trackRef, containerRef, titleRef, isDraggingRef,
    setIsPaused, tweenRef,
    scrollLeft, scrollRight, resumeScroll,
    handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave,
    handleTouchStart, handleTouchMove, handleTouchEnd,
  } = useInfiniteCarousel({ itemCount: categories.length });

  useGsapReveal({ trigger: containerRef });

  if (categories.length === 0) return null;

  const categoryItem = (cat: (typeof categories)[0], key: string) => (
    <div
      key={key}
      className="category-scroll-item group cursor-pointer"
      onClick={() => filterByCategory(cat.name)}
      onKeyDown={(e) => e.key === 'Enter' && filterByCategory(cat.name)}
      role="button"
      tabIndex={0}
    >
      <div className="category-image-wrap rounded-2xl overflow-hidden mb-6">
        <img src={cat.image} alt={cat.name} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3 className="font-display text-2xl text-[#0F0F0F] group-hover:opacity-70 transition-opacity">{cat.name}</h3>
        <p className="text-[#0F0F0F]/60 text-sm mt-2">
          {products.filter((p) => p.category === cat.name).length} créations
        </p>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="py-24 bg-[#F5F1EB]" id="categories-section">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-12">
          <SectionTitle title="Categories" subtitle="Parcourir Par" />
        </div>
        <div
          className="categories-scroll-container group cursor-grab active:cursor-grabbing"
          id="categories-scroll-wrapper"
          onMouseEnter={() => { setIsPaused(true); tweenRef.current?.pause(); }}
          onMouseLeave={() => {
            handleMouseLeave();
            if (!isDraggingRef.current) resumeScroll();
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ScrollArrows
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
            leftId="cat-arrow-left"
            rightId="cat-arrow-right"
          />

          <div ref={trackRef} className="categories-scroll-track" id="categories-scroll-track">
            {categories.map((cat) => categoryItem(cat, `a-${cat.id}`))}
            {categories.map((cat) => categoryItem(cat, `b-${cat.id}`))}
          </div>
        </div>
      </div>
    </section>
  );
}
