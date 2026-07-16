import { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { AdminPage } from '../../types';
import { BrandLogo } from '../ui/BrandLogo';
import { ethnicNavbarLogo } from '../../assets/brand';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminBlogPage } from './AdminBlogPage';
import { AdminGalleryPage } from './AdminGalleryPage';
import { EmailNotificationModal } from './EmailNotificationModal';

export function AdminPanel() {
  const {
    adminOpen,
    toggleAdmin,
    adminPage,
    setAdminPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    hasNewOrders,
  } = useStore();

  const [titleAnim, setTitleAnim] = useState(false);
  const titles: Record<AdminPage, string> = {
    dashboard: 'Dashboard',
    products: 'Products & Categories & Images',
    blog: 'Blog Posts',
    gallery: 'Gallery',
  };

  useEffect(() => {
    setTitleAnim(true);
    const t = setTimeout(() => setTitleAnim(false), 400);
    return () => clearTimeout(t);
  }, [adminPage]);

  // Important: only mount admin when open. This guarantees the storefront
  // is always accessible even if a translate utility is missing from CSS.
  if (!adminOpen) return null;

  return (
    <>
      <div
        id="admin-panel"
        className="fixed inset-0 bg-[#F5F1EB] z-50 overflow-hidden"
      >
        <div className="flex h-full">
          <div
            id="admin-sidebar"
            className={`admin-sidebar bg-[#0F0F0F] flex flex-col h-full${sidebarCollapsed ? ' collapsed' : ''}`}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-center">
                <BrandLogo src={ethnicNavbarLogo} imageClassName="h-24 md:h-32 w-auto object-contain flex-shrink-0" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="collapse-btn absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-12 bg-[#0F0F0F] border border-white/20 rounded-r-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-[#3C3C3C] transition-all z-10 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <nav className="flex-1 p-4 space-y-2">
            <button
                type="button"
                onClick={() => setAdminPage('dashboard')}
                className={`admin-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300${
                    adminPage === 'dashboard' ? ' active' : ''
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <span className="sidebar-text">Dashboard</span>
            </button>
            <button
                type="button"
                onClick={() => setAdminPage('products')}
                className={`admin-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300${
                    adminPage === 'products' ? ' active' : ''
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="sidebar-text">Products & Categories & Images</span>
            </button>
            <button
                type="button"
                onClick={() => setAdminPage('blog')}
                className={`admin-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300${
                    adminPage === 'blog' ? ' active' : ''
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="sidebar-text">Blog</span>
            </button>
            <button
                type="button"
                onClick={() => setAdminPage('gallery')}
                className={`admin-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300${
                    adminPage === 'gallery' ? ' active' : ''
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="sidebar-text">Gallery</span>
            </button>
        </nav>

            <div className="p-4 border-t border-white/10">
              <button
                type="button"
                onClick={toggleAdmin}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="exit-btn-text text-sm">Exit Admin</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="bg-white shadow-sm sticky top-0 z-10">
              <div className="px-8 py-6 flex items-center justify-center relative">
                <h2
                  id="admin-page-title"
                  className="font-display text-5xl font-medium text-[#0F0F0F] transition-all duration-400"
                  style={{
                    opacity: titleAnim ? 0 : 1,
                    transform: titleAnim ? 'translateY(-10px)' : 'translateY(0)',
                  }}
                >
                  {titles[adminPage]}
                </h2>
                <div className="absolute right-8 flex items-center gap-4">
                  {hasNewOrders && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                      New Orders!
                    </span>
                  )}
                  <button type="button" onClick={toggleAdmin} className="text-[#0F0F0F] hover:opacity-60 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {adminPage === 'dashboard' ? (
              <AdminDashboard />
            ) : adminPage === 'products' ? (
              <AdminProductsPage />
            ) : adminPage === 'blog' ? (
              <AdminBlogPage />
            ) : (
              <AdminGalleryPage />
            )}
          </div>
        </div>
      </div>
      <EmailNotificationModal />
    </>
  );
}

export function AdminFab() {
  const { toggleAdmin } = useStore();
  return (
    <button
      type="button"
      onClick={toggleAdmin}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#0F0F0F] text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="absolute right-16 bg-[#0F0F0F] text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Admin Panel
      </span>
    </button>
  );
}
