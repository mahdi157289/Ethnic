import { useStore } from '../../context/StoreContext';
import { useImageSlider } from '../../hooks/useImageSlider';
import { ImageSlider } from '../ui/ImageSlider';
import { formatPrice } from '../../utils/formatPrice';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FeaturedSection() {
  const { featuredProduct, addToCart } = useStore();
  const images = featuredProduct?.images ?? [];
  const { activeIndex, start, stop } = useImageSlider(images.length || 1, 2000, !!featuredProduct);
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!featuredProduct) return null;

  const price = featuredProduct.salePrice ?? featuredProduct.price;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, x: -50, scale: 0.9 }, 
        { 
          opacity: 1, 
          x: 0, 
          scale: 1, 
          duration: 1, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
      gsap.fromTo(contentRef.current?.children || [], 
        { opacity: 0, x: 50 }, 
        { 
          opacity: 1, 
          x: 0, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="featured-section" className="py-24 bg-[#E8E0D5]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div ref={imageRef} className="relative">
          <div className="card-3d relative bg-white p-6 rounded-3xl">
            <div className="sale-badge">Soldé</div>
            <ImageSlider
              images={featuredProduct.images}
              alt={featuredProduct.name}
              activeIndex={activeIndex}
              className="w-full h-[500px] rounded-2xl"
              onMouseEnter={start}
              onMouseLeave={stop}
            />
          </div>
        </div>
        <div ref={contentRef} className="space-y-8">
          <p className="text-sm tracking-[0.3em] text-[#0F0F0F]/60 uppercase">Bijou de la Semaine</p>
          <h2 className="font-display text-5xl font-medium text-[#0F0F0F] leading-tight">
            {featuredProduct.name}
          </h2>
          <div 
            className="text-[#0F0F0F]/70 leading-relaxed"
            dangerouslySetInnerHTML={{__html: featuredProduct.description}}
          />
          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl text-[#0F0F0F]">
              {formatPrice(featuredProduct.salePrice ?? featuredProduct.price)}
            </span>
            {featuredProduct.salePrice && (
              <span className="text-[#0F0F0F]/50 line-through">{formatPrice(featuredProduct.price)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addToCart(featuredProduct.name, price, featuredProduct.images[0])}
            className="forma-btn-primary px-10"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
