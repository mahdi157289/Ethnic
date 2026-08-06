import { Helmet } from 'react-helmet-async';
import { AboutSection } from '../components/storefront/AboutSection';
import { BlogSection } from '../components/storefront/BlogSection';
import { CategoriesSection } from '../components/storefront/CategoriesSection';
import { CollectionCarouselSection } from '../components/storefront/CollectionCarouselSection';
import { FeaturedSection } from '../components/storefront/FeaturedSection';
import { Footer } from '../components/layout/Footer';
import { GallerySection } from '../components/storefront/GallerySection';
import { Hero } from '../components/storefront/Hero';
import { Nav } from '../components/layout/Nav';
import { NewsletterSection } from '../components/storefront/NewsletterSection';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Ethnic | Bijoux Artisanaux Uniques</title>
        <meta name="description" content="Découvrez nos bijoux artisanaux uniques, créés avec passion et savoir-faire traditionnel. Explorez nos collections et trouvez votre bijou préféré." />
        <meta property="og:title" content="Ethnic | Bijoux Artisanaux Uniques" />
        <meta property="og:description" content="Découvrez nos bijoux artisanaux uniques, créés avec passion et savoir-faire traditionnel. Explorez nos collections et trouvez votre bijou préféré." />
        <meta property="og:url" content="https://ethnic-s2m2.onrender.com/" />
        <link rel="canonical" href="https://ethnic-s2m2.onrender.com/" />
        <meta property="og:image" content="https://ethnic-s2m2.onrender.com/favicon.svg" />
        <meta name="twitter:image" content="https://ethnic-s2m2.onrender.com/favicon.svg" />
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Ethnic",
          "url": "https://ethnic-s2m2.onrender.com/"
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
    </>
  );
}
