import { Helmet } from 'react-helmet-async';
import { AboutSection } from '../components/storefront/AboutSection';
import { BlogSection } from '../components/storefront/BlogSection';
import { CategoriesSection } from '../components/storefront/CategoriesSection';
import { CheckoutModal } from '../components/cart/CheckoutModal';
import { CollectionCarouselSection } from '../components/storefront/CollectionCarouselSection';
import { FeaturedSection } from '../components/storefront/FeaturedSection';
import { Footer } from '../components/layout/Footer';
import { GallerySection } from '../components/storefront/GallerySection';
import { Hero } from '../components/storefront/Hero';
import { Nav } from '../components/layout/Nav';
import { NewsletterSection } from '../components/storefront/NewsletterSection';
import { OrderSuccessModal } from '../components/cart/OrderSuccessModal';
import { AdminFab, AdminPanel } from '../components/admin/AdminPanel';
import { NotificationToasts } from '../components/ui/NotificationToasts';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Ethnic | Bijoux Artisanaux Uniques</title>
        <meta name="description" content="Découvrez nos bijoux artisanaux uniques, créés avec passion et savoir-faire traditionnel. Explorez nos collections et trouvez votre bijou préféré." />
        <meta property="og:title" content="Ethnic | Bijoux Artisanaux Uniques" />
        <meta property="og:description" content="Découvrez nos bijoux artisanaux uniques, créés avec passion et savoir-faire traditionnel. Explorez nos collections et trouvez votre bijou préféré." />
        <meta property="og:url" content="https://yourdomain.com/" />
        <link rel="canonical" href="https://yourdomain.com/" />
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Ethnic",
          "url": "https://yourdomain.com/"
        }
        `}</script>
      </Helmet>
      <Nav />
      <Hero />
      <CollectionCarouselSection />
      <FeaturedSection />
      <CategoriesSection />
      <BlogSection />
      <GallerySection />
      <AboutSection />
      <NewsletterSection />
      <Footer />
      <AdminFab />
      <AdminPanel />
      <CheckoutModal />
      <OrderSuccessModal />
      <NotificationToasts />
    </>
  );
}
