import { BrandLogo } from '../ui/BrandLogo';
import { ethnicNavbarLogo } from '../../assets/brand';

export function Footer() {
  return (
    <footer className="py-16 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 pb-12 border-b border-[#0F0F0F]/10">
          <a href="#" className="inline-block">
            <div className="flex flex-col items-center gap-4">
              <BrandLogo src={ethnicNavbarLogo} imageClassName="h-28 w-auto object-contain" />
              <p className="text-[#0F0F0F]/50 text-sm tracking-[0.3em] uppercase">Bijoux Artisanaux</p>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h4 className="font-display text-xl font-medium text-[#0F0F0F] mb-4">À Propos</h4>
            <p className="text-[#0F0F0F]/60 max-w-sm leading-relaxed">
              Des bijoux intemporels qui allient art, élégance et savoir-faire. Chaque pièce est créée avec passion et précision dans notre atelier.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[#0F0F0F] mb-4">Liens Rapides</h4>
            <ul className="space-y-3 text-[#0F0F0F]/60">
              <li><a href="#collection" className="hover:text-[#0F0F0F] transition-colors">Toute la Collection</a></li>
              <li><a href="#about" className="hover:text-[#0F0F0F] transition-colors">À Propos</a></li>
              <li><a href="#contact" className="hover:text-[#0F0F0F] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#0F0F0F] transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[#0F0F0F] mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F0F0F]/10 flex items-center justify-center hover:bg-[#0F0F0F] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F0F0F]/10 flex items-center justify-center hover:bg-[#0F0F0F] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F0F0F]/10 flex items-center justify-center hover:bg-[#0F0F0F] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#0F0F0F]/10 text-center text-[#0F0F0F]/50 text-sm">
          <p>Made in 2026 by <a href="https://nextleveltech.it.com/en" target="_blank" rel="noopener noreferrer" className="text-[#0F0F0F]/70 hover:text-[#0F0F0F] transition-colors">nextleveltech.it.com/en</a></p>
        </div>
      </div>
    </footer>
  );
}
