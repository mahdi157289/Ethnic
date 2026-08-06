import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { VideoLoader } from './components/ui/VideoLoader';
import { QuickViewModal } from './components/product/QuickViewModal';
import { CartSidebar } from './components/cart/CartSidebar';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderSuccessModal } from './components/cart/OrderSuccessModal';
import { NotificationToasts } from './components/ui/NotificationToasts';
import { AdminFab, AdminPanel } from './components/admin/AdminPanel';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { BlogPostPage } from './pages/BlogPostPage';
import { BlogListPage } from './pages/BlogListPage';

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
          <div className={showVideoOverlay ? 'opacity-0' : 'animate-[appFadeIn_0.6s_ease]'}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
            </Routes>
            {/* Global overlays — available on every page */}
            <QuickViewModal />
            <CartSidebar />
            <CheckoutModal />
            <OrderSuccessModal />
            <NotificationToasts />
            <AdminFab />
            <AdminPanel />
          </div>
          
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
