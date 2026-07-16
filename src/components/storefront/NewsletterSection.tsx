import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function NewsletterSection() {
  const { subscribeNewsletter } = useStore();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current?.children || [], 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeNewsletter(email);
    setSuccess(true);
    setEmail('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section ref={containerRef} id="contact" className="py-24 bg-[#0F0F0F]">
      <div ref={contentRef} className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl text-white mb-6">Rejoignez Notre Univers</h2>
          <p className="text-white/60 mb-10">
          Inscrivez-vous pour découvrir en avant-première nos nouvelles créations, conseils bijoux et offres exclusives.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button type="submit" className="forma-btn-soft">
            Subscribe
          </button>
        </form>
        {success && (
          <p className="mt-4 text-green-400 text-sm">
            ✓ Merci pour votre inscription ! Vous serez informée de nos nouveaux bijoux.
          </p>
        )}
      </div>
    </section>
  );
}
