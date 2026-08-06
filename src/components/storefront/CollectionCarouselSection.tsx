import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { useInfiniteCarousel } from '../../hooks/useInfiniteCarousel';
import { useGsapReveal } from '../../hooks/useGsapReveal';
import { SectionTitle } from '../ui/SectionTitle';
import { FilterBar } from '../ui/FilterBar';
import { ScrollArrows } from '../ui/ScrollArrows';

export function CollectionCarouselSection() {
  const { products, currentCategoryFilter } = useStore();
  const {
    trackRef, containerRef, titleRef, isDraggingRef,
    setIsPaused, tweenRef,
    scrollLeft, scrollRight, resumeScroll,
    handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave,
    handleTouchStart, handleTouchMove, handleTouchEnd,
  } = useInfiniteCarousel({ itemCount: products.length });

  useGsapReveal({ trigger: containerRef });

  const catalogProducts = products.filter((p) => p.type !== 'featured');
  const visibleProducts = currentCategoryFilter
    ? catalogProducts.filter((p) => p.category === currentCategoryFilter)
    : catalogProducts;

  return (
    <section ref={containerRef} id="collection" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="mb-10">
          <SectionTitle title="Collection Complète" subtitle="Notre Collection" />
          <FilterBar className="mt-6" />
        </div>

        <div
          className="products-scroll-container group cursor-grab active:cursor-grabbing"
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
          <ScrollArrows onScrollLeft={scrollLeft} onScrollRight={scrollRight} />

          <div ref={trackRef} className="products-scroll-track">
            {[...visibleProducts, ...visibleProducts].map((product, idx) => {
              const itemIndex = idx % (visibleProducts.length || 1);
              const fromCorner = itemIndex % 2 === 0 ? 'product-scroll-from-tl' : 'product-scroll-from-tr';
              return (
                <div
                  key={`${product.id}-${idx}`}
                  className={`product-scroll-item ${fromCorner}`}
                  style={{ animationDelay: `${itemIndex * 0.07}s` }}
                >
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/store" className="forma-btn-primary px-10">
            Voir la Collection Complète
          </Link>
        </div>
      </div>
    </section>
  );
}
