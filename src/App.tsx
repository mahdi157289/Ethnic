import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { VideoLoader } from './components/ui/VideoLoader';
const QuickViewModal = React.lazy(() => import('./components/product/QuickViewModal').then(module => ({ default: module.QuickViewModal })));
const CartSidebar = React.lazy(() => import('./components/cart/CartSidebar').then(module => ({ default: module.CartSidebar })));
const CheckoutModal = React.lazy(() => import('./components/cart/CheckoutModal').then(module => ({ default: module.CheckoutModal })));
const OrderSuccessModal = React.lazy(() => import('./components/cart/OrderSuccessModal').then(module => ({ default: module.OrderSuccessModal })));
const NotificationToasts = React.lazy(() => import('./components/ui/NotificationToasts').then(module => ({ default: module.NotificationToasts })));
const AdminFab = React.lazy(() => import('./components/admin/AdminPanel').then(module => ({ default: module.AdminFab })));
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel').then(module => ({ default: module.AdminPanel })));
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const StorePage = React.lazy(() => import('./pages/StorePage').then(module => ({ default: module.StorePage })));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage').then(module => ({ default: module.BlogPostPage })));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage').then(module => ({ default: module.BlogListPage })));

export default function App() {
  const [showVideoOverlay, setShowVideoOverlay] = useState(true);

  // Auto-hide overlay after 3 seconds (fallback for fast networks or if video fails)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideoOverlay(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="relative overflow-x-hidden">
          {/* Main app — rendered immediately */}
          <React.Suspense fallback={<div className="min-h-screen bg-[var(--cream)]" />}>
            <div className={showVideoOverlay ? 'opacity-0' : 'animate-[appFadeIn_0.6s_ease]'}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
            </Routes>
            {/* Global overlays — available on every page */}
            <React.Suspense fallback={null}>
              <QuickViewModal />
              <CartSidebar />
              <CheckoutModal />
              <OrderSuccessModal />
              <NotificationToasts />
              <AdminFab />
              <AdminPanel />
            </React.Suspense>
          </div>
        </React.Suspense>
          
          {/* Video overlay — absolute top layer */}
          {showVideoOverlay && (
            <VideoLoader
              onComplete={() => setShowVideoOverlay(false)}
              backgroundColor="bg-[var(--cream)]"
            />
          )}
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
