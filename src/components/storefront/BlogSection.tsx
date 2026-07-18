import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function BlogSection() {
  const { blogPosts } = useStore();
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      gsap.fromTo(gridRef.current?.children || [], 
        { opacity: 0, scale: 0.8, y: 30 }, 
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="blog" className="py-24 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-sm tracking-[0.15em] text-[#0F0F0F]/60 uppercase mb-4">Our Blog</p>
          <h2 className="font-display text-5xl font-medium text-[#0F0F0F] leading-tight">
            Discover stories from <span className="italic">Ethnic</span>
          </h2>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#0F0F0F]/50">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal scroll */}
            <div ref={gridRef} className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-6 px-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="flex-shrink-0 w-72 forma-card bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-between text-xs text-[#0F0F0F]/50 mb-2">
                      <span>{post.author}</span>
                      <span>{post.createdAt}</span>
                    </div>
                    <h3 className="font-display text-lg text-[#0F0F0F]">{post.title}</h3>
                    <div className="mt-3 inline-flex items-center gap-2 text-[#0F0F0F] text-xs font-medium">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="forma-card bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="h-64 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-between text-sm text-[#0F0F0F]/50 mb-3">
                      <span>{post.author}</span>
                      <span>{post.createdAt}</span>
                    </div>
                    <h3 className="font-display text-xl text-[#0F0F0F]">{post.title}</h3>
                    <div className="mt-4 inline-flex items-center gap-2 text-[#0F0F0F] text-sm font-medium">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
