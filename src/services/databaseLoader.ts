// Database service for loading/saving data from localStorage and seed data
// This can be adapted to load from actual APIs/database when available

import { 
  buildSeedCategories, 
  buildSeedFeaturedProduct, 
  buildSeedProducts 
} from '../data/productCatalog';
import adminData from '../assets/admin-data.json';

const STORAGE_VERSION = '1';
const STORAGE_VERSION_KEY = 'db_storage_version';

export interface DatabaseService {
  loadProducts(): Promise<Product[]>;
  loadCategories(): Promise<Category[]>;
  loadBlogPosts(): Promise<BlogPost[]>;
  loadFeaturedProduct(): Promise<FeaturedProduct | null>;
  loadGalleryImages(): Promise<string[]>;
  loadWelcomeImages(): Promise<string[]>;
  saveProducts(products: Product[]): Promise<void>;
  saveCategories(categories: Category[]): Promise<void>;
  saveBlogPosts(blogPosts: BlogPost[]): Promise<void>;
  saveFeaturedProduct(featuredProduct: FeaturedProduct | null): Promise<void>;
  saveGalleryImages(images: string[]): Promise<void>;
  saveWelcomeImages(images: string[]): Promise<void>;
  clearAllData(): Promise<void>;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  images: string[];
  category: string;
  type: 'normal' | 'featured';
  tags: string[];
  rating: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export interface FeaturedProduct extends Product {
  type: 'featured';
}

// Helper to get seed gallery images
function getSeedGalleryImages(): string[] {
  const imageModules = import.meta.glob<string>('../assets/product pictures/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  });
  return Object.values(imageModules).slice(0, 9);
}

// Helper to get seed welcome images
function getSeedWelcomeImages(): string[] {
  const imageModules = import.meta.glob<string>('../assets/product pictures/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  });
  return Object.values(imageModules).slice(0, 1);
}

// Helper to get seed blog posts
function getSeedBlogPosts(): BlogPost[] {
  const imageModules = import.meta.glob<string>('../assets/product pictures/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  });
  const images = Object.values(imageModules);
  return [
    {
      id: 1,
      title: "L'Artisanat au Cœur de nos Bijoux",
      content: "Découvrez comment chaque pièce est créée avec passion et savoir-faire ancestral dans notre atelier Ethnic. Nous mettons un point d'honneur à préserver les techniques traditionnelles tout en ajoutant une touche moderne.",
      image: images[0] ?? '',
      author: "Équipe Ethnic",
      createdAt: "15/06/2026"
    },
    {
      id: 2,
      title: "Comment Entretenir vos Bijoux Éthniques",
      content: "Conseils pratiques pour prendre soin de vos bijoux et conserver leur éclat au fil du temps. Nettoyage, rangement, précautions à prendre — on vous dit tout !",
      image: images[1] ?? '',
      author: "Marie Dubois",
      createdAt: "20/06/2026"
    },
    {
      id: 3,
      title: "Notre Nouvelle Collection Été 2026",
      content: "Présentation de notre toute nouvelle collection inspirée par les voyages et les cultures du monde. Couleurs vibrantes, designs uniques — ne la ratez pas !",
      image: images[2] ?? '',
      author: "Lucas Martin",
      createdAt: "22/06/2026"
    }
  ];
}

class MockDatabaseService implements DatabaseService {
  
  private init(): void {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== STORAGE_VERSION) {
      console.log('Old storage version found, clearing all data...');
      this.clearAllData();
      localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
    }
  }
  
  constructor() {
    this.init();
  }
  
  private saveToLocalStorage<T>(data: T, key: string): void {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved to localStorage: ${key}`);
  }
  
  private loadFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
  
  async loadProducts(): Promise<Product[]> {
    const localStorageData = this.loadFromLocalStorage<{ products: Product[] }>('db_products-seed.json');
    if (localStorageData && localStorageData.products.length > 0) {
      return localStorageData.products;
    }
    // Use committed admin data (admin-data.json) as seed if available
    const adminProducts = (adminData as Record<string, unknown>)['db_products-seed.json'] as
      | { products: Product[] }
      | undefined;
    if (adminProducts && Array.isArray(adminProducts.products) && adminProducts.products.length > 0) {
      return adminProducts.products;
    }
    // Fallback to seed data
    return buildSeedProducts();
  }
  
  async loadCategories(): Promise<Category[]> {
    const localStorageData = this.loadFromLocalStorage<Category[]>('db_categories-seed.json');
    if (localStorageData && localStorageData.length > 0) {
      return localStorageData;
    }
    // Fallback to seed data
    return buildSeedCategories();
  }
  
  async loadBlogPosts(): Promise<BlogPost[]> {
    const localStorageData = this.loadFromLocalStorage<BlogPost[]>('db_blogposts-seed.json');
    if (localStorageData && localStorageData.length > 0) {
      return localStorageData;
    }
    // Fallback to seed data
    return getSeedBlogPosts();
  }
  
  async loadFeaturedProduct(): Promise<FeaturedProduct | null> {
    const localStorageData = this.loadFromLocalStorage<FeaturedProduct>('db_featured-seed.json');
    if (localStorageData) {
      return localStorageData;
    }
    // Fallback to seed data
    const seedProducts = buildSeedProducts();
    return buildSeedFeaturedProduct(seedProducts);
  }
  
  async loadGalleryImages(): Promise<string[]> {
    const localStorageData = this.loadFromLocalStorage<string[]>('db_gallery-seed.json');
    if (localStorageData && localStorageData.length > 0) {
      return localStorageData;
    }
    // Fallback to seed data
    return getSeedGalleryImages();
  }
  
  async loadWelcomeImages(): Promise<string[]> {
    const localStorageData = this.loadFromLocalStorage<string[]>('db_welcome-seed.json');
    if (localStorageData && localStorageData.length > 0) {
      return localStorageData;
    }
    // Fallback to seed data
    return getSeedWelcomeImages();
  }
  
  async saveProducts(products: Product[]): Promise<void> {
    this.saveToLocalStorage({ products }, 'db_products-seed.json');
  }
  
  async saveCategories(categories: Category[]): Promise<void> {
    this.saveToLocalStorage(categories, 'db_categories-seed.json');
  }
  
  async saveBlogPosts(blogPosts: BlogPost[]): Promise<void> {
    this.saveToLocalStorage(blogPosts, 'db_blogposts-seed.json');
  }
  
  async saveFeaturedProduct(featuredProduct: FeaturedProduct | null): Promise<void> {
    this.saveToLocalStorage(featuredProduct, 'db_featured-seed.json');
  }
  
  async saveGalleryImages(images: string[]): Promise<void> {
    this.saveToLocalStorage(images, 'db_gallery-seed.json');
  }
  
  async saveWelcomeImages(images: string[]): Promise<void> {
    this.saveToLocalStorage(images, 'db_welcome-seed.json');
  }
  
  async clearAllData(): Promise<void> {
    localStorage.removeItem('db_products-seed.json');
    localStorage.removeItem('db_categories-seed.json');
    localStorage.removeItem('db_blogposts-seed.json');
    localStorage.removeItem('db_featured-seed.json');
    localStorage.removeItem('db_gallery-seed.json');
    localStorage.removeItem('db_welcome-seed.json');
  }
}

// Singleton database service
export const db = new MockDatabaseService();

// Helper function to initialize app with database
export async function initializeDatabase() {
  try {
    const [products, categories, blogposts, featured] = await Promise.all([
      db.loadProducts(),
      db.loadCategories(),
      db.loadBlogPosts(),
      db.loadFeaturedProduct(),
    ]);
    return { products, categories, blogposts, featured };
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Return seed data as fallback
    const seedProducts = buildSeedProducts();
    return {
      products: seedProducts,
      categories: buildSeedCategories(),
      blogposts: getSeedBlogPosts(),
      featured: buildSeedFeaturedProduct(seedProducts),
    };
  }
}