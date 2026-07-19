import { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useImageSlider } from '../../hooks/useImageSlider';
import { ImageSlider } from '../ui/ImageSlider';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openQuickView, currentCategoryFilter } = useStore();
  const { activeIndex, start, stop } = useImageSlider(product.images.length);
  const [filterState, setFilterState] = useState<'in' | 'out' | 'hidden'>('in');

  useEffect(() => {
    if (!currentCategoryFilter) {
      setFilterState('in');
      return;
    }
    if (product.category === currentCategoryFilter) {
      setFilterState('in');
    } else {
      setFilterState('out');
      const t = setTimeout(() => setFilterState('hidden'), 500);
      return () => clearTimeout(t);
    }
  }, [currentCategoryFilter, product.category]);

  const className = [
    'product-card group card-3d relative bg-white rounded-2xl overflow-hidden',
    filterState === 'out' ? 'filtered-out' : '',
    filterState === 'hidden' ? 'hidden' : '',
    filterState === 'in' ? 'filtered-in' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${className} flex flex-col h-full`}
      data-category={product.category}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <div className="relative border-b border-[#C4A35A] flex-shrink-0">
        <ImageSlider
          images={product.images}
          alt={product.name}
          activeIndex={activeIndex}
          className="h-80"
        />
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-[var(--gold-light)]/90 text-[#0F0F0F] text-xs font-medium rounded-full border border-[var(--gold)] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#0F0F0F]/50 text-xs tracking-wider uppercase">{product.category}</p>
          <div className="flex items-center gap-1">
            {/* 5 stars */}
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill={star <= product.rating ? '#C4A35A' : '#E8E0D5'}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <h3 className="font-display text-xl text-[#0F0F0F] mb-1">{product.name}</h3>
        <div 
          className="text-[#0F0F0F]/60 text-sm mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{__html: product.description || ''}}
        />
        <div className="flex justify-between items-center mt-auto">
          <span className="font-display text-lg text-[#0F0F0F]">{formatPrice(product.price)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openQuickView(product.id);
              }}
              className="forma-btn-icon w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center hover:bg-[#E8E0D5] transition-all"
              title="Quick View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0F0F0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.name, product.price, product.images[0]);
              }}
              className="forma-btn-icon w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center transition-all"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0F0F0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
