import { useEffect, useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import { gsap } from 'gsap';

const ROTATE_MS = 5000;

export function Hero() {
  const { products, welcomeImages } = useStore();
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeWelcomeImageIndex, setActiveWelcomeImageIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setActiveProductIndex((i) => (i + 1) % products.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [products.length]);

  useEffect(() => {
    if (welcomeImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveWelcomeImageIndex((i) => (i + 1) % welcomeImages.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [welcomeImages.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current?.children || [], 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(showcaseRef.current, 
        { opacity: 0, x: 50, scale: 0.9 }, 
        { opacity: 1, x: 0, scale: 1, duration: 1, delay: 0.5, ease: "back.out(1.7)" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const product = products[activeProductIndex];
  const currentWelcomeImage = welcomeImages[activeWelcomeImageIndex];

  return (
    <section ref={containerRef} className="min-h-screen flex items-center pt-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div ref={textRef} className="space-y-8">
          <p className="text-sm tracking-[0.3em] text-[#0F0F0F]/60 uppercase">Artisanat & Bijoux</p>
          <h1 className="font-display text-6xl lg:text-7xl font-medium text-[#0F0F0F] leading-tight">
            Bijoux <br />
            <span className="italic">d&apos;Exception</span>
          </h1>
          <p className="text-[#0F0F0F]/70 max-w-md leading-relaxed">
            Découvrez des créations uniques qui allient beauté sculpturale et savoir-faire ancestral. Chaque bijou raconte une histoire d&apos;artisanat.
          </p>
          <div className="flex gap-4 pt-4">
            <a href="#collection" className="forma-btn-primary">
              Explorer la Collection
            </a>
            <a href="#about" className="forma-btn-outline">
              Notre Histoire
            </a>
          </div>
        </div>

        <div ref={showcaseRef} className="relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#E8E0D5] rounded-full blur-3xl opacity-60" />
          <div className="relative z-10 float-animation">
            <div className="forma-card bg-white p-8 rounded-3xl shadow-2xl shadow-[#D4C8B8]/30">
              {currentWelcomeImage && typeof currentWelcomeImage === 'string' ? (
                <img
                  src={currentWelcomeImage}
                  key={`welcome-${activeWelcomeImageIndex}`}
                  alt="Bijoux artisanaux Ethnic"
                  className="w-full h-80 object-cover rounded-2xl transition-opacity duration-1000"
                />
              ) : product ? (
                <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#F5F1EB]">
                  <img
                    key={product.id}
                    src={product.images[0]}
                    alt={product.name}
                    className="hero-showcase-image w-full h-full object-contain p-4"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-5 py-4 bg-gradient-to-t from-[#0F0F0F]/75 to-transparent">
                    <p className="text-white/80 text-xs tracking-[0.2em] uppercase mb-1">{product.category}</p>
                    <div className="flex items-end justify-between gap-4">
                      <p className="font-display text-xl text-white">{product.name}</p>
                      <p className="font-display text-lg text-[var(--gold-light)] shrink-0">
                        {formatPrice(product.salePrice ?? product.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
