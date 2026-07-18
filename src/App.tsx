import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { VideoLoader } from './components/ui/VideoLoader';
import { QuickViewModal } from './components/product/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { BlogPostPage } from './pages/BlogPostPage';
import { BlogListPage } from './pages/BlogListPage';

export default function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <>
      {!appReady && <VideoLoader onComplete={() => setAppReady(true)} />}
      {appReady && (
        <StoreProvider>
          <BrowserRouter>
            <div className="overflow-x-hidden animate-[appFadeIn_0.6s_ease]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
              </Routes>
              {/* Global quick-view modal — available on every page */}
              <QuickViewModal />
            </div>
          </BrowserRouter>
        </StoreProvider>
      )}
    </>
  );
}
