import { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useImageSlider } from '../../hooks/useImageSlider';
import { ImageSlider } from '../ui/ImageSlider';
import { Modal } from '../ui/Modal';
import { formatPrice } from '../../utils/formatPrice';

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useStore();
  const open = !!quickViewProduct;
  const images = quickViewProduct?.images ?? [];
  const { activeIndex, start, stop, setActiveIndex } = useImageSlider(images.length || 1, 2000, open);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (open && images.length > 1) start();
    return () => stop();
  }, [open, images.length, start, stop]);

  useEffect(() => {
    setShowFullDescription(false);
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const price = quickViewProduct.salePrice ?? quickViewProduct.price;

  return (
    <Modal
      open={open}
      onClose={closeQuickView}
      contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto border border-[#C4A35A]"
    >
      <button
        type="button"
        onClick={closeQuickView}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#F5F1EB] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0F0F0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="grid md:grid-cols-2 grid-rows-1">
        <div className="border-r border-[#C4A35A] flex-shrink-0">
          <ImageSlider
            images={images}
            alt={quickViewProduct.name}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            className="h-80 md:h-[500px] bg-[#F5F1EB]"
            dotsAlwaysVisible
          />
        </div>
        <div className="p-6 md:p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#0F0F0F]/50 text-xs tracking-wider uppercase ml-0">{quickViewProduct.category}</p>
            {/* 5 stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill={star <= (quickViewProduct.rating || 5) ? '#C4A35A' : '#E8E0D5'}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-[#0F0F0F] mb-6 leading-tight ml-0">{quickViewProduct.name}</h2>
          <div className="flex-1 overflow-y-auto pr-2 mb-2">
            <div 
              className={`text-[#0F0F0F]/70 leading-relaxed text-left ${showFullDescription ? 'text-xs md:text-sm' : 'text-sm md:text-base line-clamp-4'}`}
              dangerouslySetInnerHTML={{
                __html: quickViewProduct.description || 'Un bijou magnifique de notre collection exclusive.'
              }}
            />
            <button
              type="button"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-[#C4A35A] text-xs md:text-sm font-medium hover:underline"
            >
              {showFullDescription ? 'See less' : 'See more'}
            </button>
          </div>
          <div className="flex items-end justify-between gap-6 pt-6 border-t border-[#E8E0D5]">
            <div className="pb-1">
              {quickViewProduct.salePrice ? (
                <span className="font-display text-2xl md:text-3xl">
                  <span className="text-red-500">{formatPrice(quickViewProduct.salePrice)}</span>{' '}
                  <span className="text-lg text-[#0F0F0F]/40 line-through">{formatPrice(quickViewProduct.price)}</span>
                </span>
              ) : (
                <span className="font-display text-2xl md:text-3xl text-[#0F0F0F]">{formatPrice(quickViewProduct.price)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart(quickViewProduct.name, price, quickViewProduct.images[0]);
                closeQuickView();
              }}
              className="forma-btn-primary rounded-xl flex items-center gap-2 !px-8 !md:px-12 !py-3 !md:py-4 !w-auto !inline-flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
