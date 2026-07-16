import { useImageSlider } from '../../hooks/useImageSlider';
import { ImageSlider } from '../ui/ImageSlider';
import about1 from '../../assets/1.jpeg';
import about2 from '../../assets/2.jpeg';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const { activeIndex } = useImageSlider(2, 3000, true);
  const images = [about1, about2];
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current?.children || [], 
        { opacity: 0, x: -50 }, 
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
      gsap.fromTo(imageRef.current, 
        { opacity: 0, x: 50, scale: 0.9 }, 
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
      gsap.fromTo(statsRef.current?.children || [], 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => {
              const statEls = statsRef.current?.querySelectorAll('.stat-number');
              statEls?.forEach(el => {
                const target = parseInt(el.textContent || '0');
                gsap.fromTo(el, { innerText: 0 }, {
                  innerText: target,
                  duration: 2,
                  snap: { innerText: 1 },
                  ease: "power2.out"
                });
              });
            }
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} className="space-y-8">
            <p className="text-sm tracking-[0.3em] text-[#0F0F0F]/60 uppercase">À Propos d&apos;Ethnic</p>
            <h2 className="font-display text-5xl font-medium text-[#0F0F0F] leading-tight">
              Trouver des <span className="italic">bijoux</span> <br />
              précieux chez ETHNIC DECO
            </h2>
            <p className="text-[#0F0F0F]/70 leading-relaxed">
              Fondée en 2018, Ethnic est née d&apos;une conviction simple : un bijou doit être bien plus qu&apos;un accessoire — il doit inspirer. Nos artisans allient savoir-faire traditionnel et design contemporain pour créer des pièces qui transcendent les tendances.
            </p>
            <div ref={statsRef} className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <p className="stat-number font-display text-4xl text-[#0F0F0F]">150</p>
                <p className="text-[#0F0F0F]/60 text-sm mt-1">Créations Uniques</p>
              </div>
              <div>
                <p className="stat-number font-display text-4xl text-[#0F0F0F]">12000</p>
                <p className="text-[#0F0F0F]/60 text-sm mt-1">Clientes Élégantes</p>
              </div>
              <div>
                <p className="stat-number font-display text-4xl text-[#0F0F0F]">25</p>
                <p className="text-[#0F0F0F]/60 text-sm mt-1">Artisans</p>
              </div>
            </div>
          </div>
          <div ref={imageRef} className="relative">
            <div className="absolute top-10 right-10 w-48 h-48 bg-[#E8E0D5] rounded-full blur-3xl opacity-60" />
            <ImageSlider
              images={images}
              alt="À propos d'Ethnic"
              activeIndex={activeIndex}
              className="forma-card relative z-10 w-full h-[500px] object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
