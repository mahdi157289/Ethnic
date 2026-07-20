import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../ui/BrandLogo';
import { ethnicNavbarLogo } from '../../assets/brand';
import gsap from 'gsap';

const NAV_SECTIONS = ['collection', 'blog', 'categories-section'];

export function Nav() {
  const activeSection = useScrollSpy(NAV_SECTIONS);
  const { cartCount, toggleCart } = useStore();
  const { pathname } = useLocation();
  const isStorePage = pathname === '/store';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs for animations
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileUnderlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const desktopLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const desktopUnderlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  // Hover handlers for nav links
  const handleLinkEnter = (index: number, isMobile: boolean) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const underlineRef = isMobile ? mobileUnderlineRefs : desktopUnderlineRefs;
    gsap.to(e.currentTarget, {
      scale: isMobile ? 1.05 : 1,
      color: '#C4A35A',
      textShadow: isMobile ? '0 0 10px rgba(196, 163, 90, 0.7), 0 0 20px rgba(196, 163, 90, 0.4)' : 'none',
      duration: 0.2,
      ease: 'power2.out'
    });
    if (underlineRef.current[index]) {
      gsap.to(underlineRef.current[index], {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleLinkLeave = (index: number, isMobile: boolean) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const underlineRef = isMobile ? mobileUnderlineRefs : desktopUnderlineRefs;
    gsap.to(e.currentTarget, {
      scale: 1,
      color: '#FFFFFF',
      textShadow: 'none',
      duration: 0.2,
      ease: 'power2.out'
    });
    if (underlineRef.current[index]) {
      gsap.to(underlineRef.current[index], {
        scaleX: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const navLinkBase =
    'nav-link text-xs font-semibold uppercase tracking-[0.15em] text-[#0F0F0F] relative py-2 hover:opacity-60 transition-opacity';
  const mobileNavLinkBase =
    'nav-link text-sm font-semibold uppercase tracking-[0.15em] text-white py-3 hover:text-[var(--gold)] transition-colors';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  // Animate mobile menu and links
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Animate menu container
      gsap.fromTo(mobileMenuRef.current, 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      // Stagger animate links
      gsap.fromTo(mobileLinksRef.current.filter(link => link), 
        { x: -20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-xl border-b border-[var(--gold)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" aria-label="Ethnic home" onClick={closeMobileMenu}>
          <BrandLogo src={ethnicNavbarLogo} imageClassName="h-20 md:h-32 w-auto object-contain" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link 
            to="/#collection" 
            className={`${navLinkBase} text-white relative${activeSection === 'collection' && !isStorePage ? ' active' : ''}`}
            ref={(el) => { desktopLinksRef.current[0] = el; }}
            onMouseEnter={handleLinkEnter(0, false)}
            onMouseLeave={handleLinkLeave(0, false)}
          >
            Collection
            <span 
              ref={(el) => { desktopUnderlineRefs.current[0] = el; }}
              className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
            />
          </Link>
          <Link 
            to="/store" 
            className={`${navLinkBase} text-white relative${isStorePage ? ' active' : ''}`}
            ref={(el) => { desktopLinksRef.current[1] = el; }}
            onMouseEnter={handleLinkEnter(1, false)}
            onMouseLeave={handleLinkLeave(1, false)}
          >
            Boutique
            <span 
              ref={(el) => { desktopUnderlineRefs.current[1] = el; }}
              className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
            />
          </Link>
          <Link 
            to="/#blog" 
            className={`${navLinkBase} text-white relative${activeSection === 'blog' && !isStorePage ? ' active' : ''}`}
            ref={(el) => { desktopLinksRef.current[2] = el; }}
            onMouseEnter={handleLinkEnter(2, false)}
            onMouseLeave={handleLinkLeave(2, false)}
          >
            Blog
            <span 
              ref={(el) => { desktopUnderlineRefs.current[2] = el; }}
              className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
            />
          </Link>
          <Link 
            to="/#categories-section" 
            className={`${navLinkBase} text-white relative${activeSection === 'categories-section' && !isStorePage ? ' active' : ''}`}
            ref={(el) => { desktopLinksRef.current[3] = el; }}
            onMouseEnter={handleLinkEnter(3, false)}
            onMouseLeave={handleLinkLeave(3, false)}
          >
            Category
            <span 
              ref={(el) => { desktopUnderlineRefs.current[3] = el; }}
              className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button type="button" className="p-2 cursor-pointer text-white hover:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 cursor-pointer relative text-white hover:opacity-60 transition-opacity"
            onClick={toggleCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-[#0F0F0F] text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
          
          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 cursor-pointer text-white hover:opacity-60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef} 
          className="md:hidden bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-[var(--gold)]"
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            <Link 
              to="/#collection" 
              className={`${mobileNavLinkBase} relative inline-block`} 
              onClick={closeMobileMenu}
              ref={(el) => { mobileLinksRef.current[0] = el; }}
              onMouseEnter={handleLinkEnter(0, true)}
              onMouseLeave={handleLinkLeave(0, true)}
            >
              Collection
              <span 
                ref={(el) => { mobileUnderlineRefs.current[0] = el; }}
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
              />
            </Link>
            <Link 
              to="/store" 
              className={`${mobileNavLinkBase} relative inline-block`} 
              onClick={closeMobileMenu}
              ref={(el) => { mobileLinksRef.current[1] = el; }}
              onMouseEnter={handleLinkEnter(1, true)}
              onMouseLeave={handleLinkLeave(1, true)}
            >
              Boutique
              <span 
                ref={(el) => { mobileUnderlineRefs.current[1] = el; }}
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
              />
            </Link>
            <Link 
              to="/#blog" 
              className={`${mobileNavLinkBase} relative inline-block`} 
              onClick={closeMobileMenu}
              ref={(el) => { mobileLinksRef.current[2] = el; }}
              onMouseEnter={handleLinkEnter(2, true)}
              onMouseLeave={handleLinkLeave(2, true)}
            >
              Blog
              <span 
                ref={(el) => { mobileUnderlineRefs.current[2] = el; }}
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
              />
            </Link>
            <Link 
              to="/#categories-section" 
              className={`${mobileNavLinkBase} relative inline-block`} 
              onClick={closeMobileMenu}
              ref={(el) => { mobileLinksRef.current[3] = el; }}
              onMouseEnter={handleLinkEnter(3, true)}
              onMouseLeave={handleLinkLeave(3, true)}
            >
              Category
              <span 
                ref={(el) => { mobileUnderlineRefs.current[3] = el; }}
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--gold)] origin-left scale-x-0"
              />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
