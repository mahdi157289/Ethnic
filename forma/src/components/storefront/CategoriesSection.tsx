import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CategoriesSection() {
  const { categories, products, filterByCategory } = useStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  
  // Drag state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Function to create the tween
  const createTween = () => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    if (!trackRef.current || categories.length === 0) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;
    const pixelsPerSecond = 80; // Reasonable slow speed
    const duration = totalWidth / pixelsPerSecond;
    
    // Reset position first
    gsap.set(track, { x: 0 });

    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: duration,
      ease: "none",
      repeat: -1,
      paused: isPaused,
      onRepeat: () => {
        gsap.set(track, { x: 0 });
      },
    });
  };

  useEffect(() => {
    // Create tween when categories change
    createTween();
    
    // Also recreate after a short delay to account for image loading
    const timeoutId = setTimeout(createTween, 500);

    // Add window resize listener
    const handleResize = () => {
      createTween();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [categories.length]);

  // Separate effect to handle pause/play without recreating the tween
  useEffect(() => {
    if (!tweenRef.current) return;
    if (isPaused) {
      tweenRef.current.pause();
    } else {
      tweenRef.current.play();
    }
  }, [isPaused]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current?.children || [], 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
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

  const scrollLeft = () => {
    if (!tweenRef.current || !trackRef.current) return;
    setIsPaused(true);
    tweenRef.current.pause();
    const track = trackRef.current;
    const currentX = gsap.getProperty(track, "x") as number;
    const newX = Math.max(0, currentX - 320);
    gsap.to(track, {
      x: newX,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        if (!isPaused) {
          tweenRef.current?.play();
        }
      }
    });
  };

  const scrollRight = () => {
    if (!tweenRef.current || !trackRef.current) return;
    setIsPaused(true);
    tweenRef.current.pause();
    const track = trackRef.current;
    const currentX = gsap.getProperty(track, "x") as number;
    const totalWidth = track.scrollWidth / 2;
    const newX = currentX - 320 <= -totalWidth ? 0 : currentX - 320;
    gsap.to(track, {
      x: newX,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        if (!isPaused) {
          tweenRef.current?.play();
        }
      }
    });
  };

  const resumeScroll = () => {
    setIsPaused(false);
    tweenRef.current?.play();
  };
  
  // Normalize X position to keep within the infinite scroll boundaries
  const normalizeX = (x: number, totalWidth: number) => {
    if (x < -totalWidth) return x + totalWidth;
    if (x > 0) return x - totalWidth;
    return x;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsPaused(true);
    tweenRef.current?.pause();
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = gsap.getProperty(trackRef.current, "x") as number;
    lastXRef.current = e.pageX;
    lastTimeRef.current = Date.now();
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const currentX = startScrollLeftRef.current + (e.pageX - startXRef.current);
    const totalWidth = trackRef.current.scrollWidth / 2;
    const normalizedX = normalizeX(currentX, totalWidth);
    gsap.set(trackRef.current, { x: normalizedX });
    
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.pageX - lastXRef.current) / dt;
    }
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Add some momentum
    if (trackRef.current) {
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      const totalWidth = trackRef.current.scrollWidth / 2;
      const momentum = velocityRef.current * 100; // Adjust multiplier for more/less momentum
      const newX = normalizeX(currentX + momentum, totalWidth);
      gsap.to(trackRef.current, {
        x: newX,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Resume auto-scroll after 2 seconds
          if ((window as any)._resumeTimeout) {
            clearTimeout((window as any)._resumeTimeout);
          }
          (window as any)._resumeTimeout = setTimeout(() => {
            setIsPaused(false);
          }, 2000);
        }
      });
    } else {
      // If no trackRef, still try to resume after 2s
      if ((window as any)._resumeTimeout) {
        clearTimeout((window as any)._resumeTimeout);
      }
      (window as any)._resumeTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  };



  const handleTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    setIsPaused(true);
    tweenRef.current?.pause();
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    startScrollLeftRef.current = gsap.getProperty(trackRef.current, "x") as number;
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const currentX = startScrollLeftRef.current + (e.touches[0].pageX - startXRef.current);
    const totalWidth = trackRef.current.scrollWidth / 2;
    const normalizedX = normalizeX(currentX, totalWidth);
    gsap.set(trackRef.current, { x: normalizedX });
    
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.touches[0].pageX - lastXRef.current) / dt;
    }
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = now;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (trackRef.current) {
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      const totalWidth = trackRef.current.scrollWidth / 2;
      const momentum = velocityRef.current * 100;
      const newX = normalizeX(currentX + momentum, totalWidth);
      gsap.to(trackRef.current, {
        x: newX,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Resume auto-scroll after 2 seconds
          if ((window as any)._resumeTimeout) {
            clearTimeout((window as any)._resumeTimeout);
          }
          (window as any)._resumeTimeout = setTimeout(() => {
            setIsPaused(false);
          }, 2000);
        }
      });
    } else {
      // If no trackRef, still try to resume after 2s
      if ((window as any)._resumeTimeout) {
        clearTimeout((window as any)._resumeTimeout);
      }
      (window as any)._resumeTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    }
  };

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
          <p className="text-sm tracking-[0.3em] text-[#0F0F0F]/60 uppercase mb-4">Parcourir Par</p>
          <h2 className="section-title font-display text-4xl font-medium text-[#0F0F0F]">
            <span className="section-dot" />
            <span className="section-title-text">Categories</span>
            <span className="section-dot" />
          </h2>
        </div>
        <div
          className="categories-scroll-container group cursor-grab active:cursor-grabbing"
          id="categories-scroll-wrapper"
          onMouseEnter={() => { setIsPaused(true); tweenRef.current?.pause(); }}
          onMouseLeave={() => {
            handleMouseLeave();
            if (!isDraggingRef.current) {
              resumeScroll();
            }
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            id="cat-arrow-left"
            onClick={scrollLeft}
            className="forma-btn-round absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={trackRef} className="categories-scroll-track" id="categories-scroll-track">
            {categories.map((cat) => categoryItem(cat, `a-${cat.id}`))}
            {categories.map((cat) => categoryItem(cat, `b-${cat.id}`))}
          </div>

          <button
            type="button"
            id="cat-arrow-right"
            onClick={scrollRight}
            className="forma-btn-round absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
