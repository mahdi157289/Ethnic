import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseGsapRevealOptions {
  trigger?: React.RefObject<HTMLElement | null>;
  start?: string;
  stagger?: number;
  duration?: number;
  y?: number;
}

export function useGsapReveal(options: UseGsapRevealOptions = {}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const triggerRef = options.trigger ?? useRef<HTMLElement>(null);

  useEffect(() => {
    const el = targetRef.current;
    const triggerEl = triggerRef.current ?? el?.closest('section');
    if (!el || !triggerEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { opacity: 0, y: options.y ?? 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.8,
          stagger: options.stagger ?? 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: triggerEl,
            start: options.start ?? 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, triggerEl);

    return () => ctx.revert();
  }, []);

  return { targetRef, triggerRef };
}
