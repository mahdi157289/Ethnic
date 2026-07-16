import type { Category, FeaturedProduct, Product } from '../types';

const imageModules = import.meta.glob<string>('../assets/product pictures/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Groups product images by their base name (without "(1)" or extension) to combine multiple views of the same product. */
function groupProductImages(): string[][] {
  const groups: Record<string, string[]> = {};
  
  Object.entries(imageModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([path, url]) => {
      // Normalize path to forward slashes
      const normalizedPath = path.replace(/\\/g, '/');
      // Extract base name without "(1)" suffix or extension
      const baseName = normalizedPath
        .replace(/\s\(\d+\)\.jpg$/i, '')
        .replace(/\.jpg$/i, '');
      
      if (!groups[baseName]) {
        groups[baseName] = [];
      }
      groups[baseName].push(url);
    });
  
  return Object.values(groups);
}

const productImageGroups = groupProductImages();

const CATEGORY_NAMES = ['Colliers', 'Bracelets', 'Boucles', 'Bagues', 'Broches', 'Parures'] as const;

const PRODUCT_PREFIX: Record<(typeof CATEGORY_NAMES)[number], string> = {
  Colliers: 'Collier',
  Bracelets: 'Bracelet',
  Boucles: 'Boucle',
  Bagues: 'Bague',
  Broches: 'Broche',
  Parures: 'Parure',
};

const DESCRIPTIONS = [
  'Bijou fini à la main dans notre atelier Ethnic, mêlant artisanat traditionnel et élégance contemporaine.',
  'Création artisanale conçue pour sublimer votre style avec des finitions précises et durables.',
  'Pièce Ethnic exclusive — matériaux nobles, savoir-faire ancestral et silhouette intemporelle.',
  'Réalisé en petites séries avec une attention particulière aux détails, textures et éclat.',
];

function pickDescription(index: number): string {
  return DESCRIPTIONS[index % DESCRIPTIONS.length];
}

function buildProductName(index: number, category: (typeof CATEGORY_NAMES)[number]): string {
  const prefix = PRODUCT_PREFIX[category];
  return `${prefix} ${String(index + 1).padStart(2, '0')}`;
}

function priceForIndex(index: number): number {
  const tiers = [120, 180, 250, 320, 420, 580, 750, 890, 1150, 1380];
  return tiers[index % tiers.length];
}

export function buildSeedCategories(): Category[] {
  return CATEGORY_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    image: productImageGroups[i * 8]?.[0] ?? productImageGroups[0]?.[0] ?? '',
    count: productImageGroups.filter((_, idx) => idx % CATEGORY_NAMES.length === i).length,
  }));
}

const TAG_OPTIONS = ['Bestseller', 'Nouveau', 'Artisanal', 'Édition Limitée', 'Cadeau'] as const;

function pickRandomTags(): string[] {
  // Pick 0-2 random tags
  const numTags = Math.floor(Math.random() * 3);
  const tags: string[] = [];
  const availableTags = [...TAG_OPTIONS];
  for (let i = 0; i < numTags; i++) {
    const randomIndex = Math.floor(Math.random() * availableTags.length);
    tags.push(availableTags[randomIndex]);
    availableTags.splice(randomIndex, 1);
  }
  return tags;
}

function pickRandomRating(): number {
  // Pick 4 or 5 stars (most products are well rated)
  return Math.floor(Math.random() * 2) + 4;
}

export function buildSeedProducts(): Product[] {
  return productImageGroups.map((imageGroup, index) => {
    const category = CATEGORY_NAMES[index % CATEGORY_NAMES.length];
    return {
      id: index + 1,
      name: buildProductName(index, category),
      price: priceForIndex(index),
      description: pickDescription(index),
      images: imageGroup,
      category,
      type: 'normal' as const,
      tags: pickRandomTags(),
      rating: pickRandomRating(),
    };
  });
}

export function buildSeedFeaturedProduct(products: Product[]): FeaturedProduct | null {
  if (products.length === 0) return null;
  const featured = products[0];
  const original = featured.price;
  return {
    ...featured,
    id: 10_000,
    type: 'featured',
    salePrice: Math.round(original * 0.82),
    price: original,
    name: 'Collier Signature',
    description:
      'Notre bijou phare de la semaine — sélectionné pour son artisanat, son éclat et sa présence unique.',
    images: featured.images,
    tags: ['Bestseller', 'Édition Limitée'],
    rating: 5,
  };
}
