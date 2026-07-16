import { buildSeedCategories, buildSeedFeaturedProduct, buildSeedProducts } from './productCatalog';

export const seedProducts = buildSeedProducts();
export const seedCategories = buildSeedCategories();
export const seedFeaturedProduct = buildSeedFeaturedProduct(seedProducts);
