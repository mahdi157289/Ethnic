import { Helmet } from 'react-helmet-async';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { CollectionSection } from '../components/storefront/CollectionSection';

export function StorePage() {
  return (
    <>
      <Helmet>
        <title>Collection Complète | Ethnic</title>
        <meta name="description" content="Parcourez tous nos bijoux et filtrez par catégorie. Découvrez notre collection complète de bijoux artisanaux." />
        <meta property="og:title" content="Collection Complète | Ethnic" />
        <meta property="og:description" content="Parcourez tous nos bijoux et filtrez par catégorie. Découvrez notre collection complète de bijoux artisanaux." />
        <meta property="og:url" content="https://yourdomain.com/store" />
        <link rel="canonical" href="https://yourdomain.com/store" />
      </Helmet>
      <Nav />
      <div className="pt-44 md:pt-52 bg-white">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-10 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-[#0F0F0F]">
            Collection Complète
          </h1>
          <p className="text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto">
            Parcourez tous nos bijoux et filtrez par catégorie.
          </p>
        </div>
      </div>
      <CollectionSection hideTitle />
      <Footer />
    </>
  );
}

