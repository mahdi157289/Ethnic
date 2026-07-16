import { buildSeedCategories, buildSeedFeaturedProduct, buildSeedProducts } from './productCatalog';
import type { FeaturedProduct } from '../types';

export const seedProducts = buildSeedProducts();
export const seedCategories = buildSeedCategories();
export const seedFeaturedProduct: FeaturedProduct | null = buildSeedFeaturedProduct(seedProducts);
