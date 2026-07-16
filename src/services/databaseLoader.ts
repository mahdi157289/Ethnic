// Database service for loading/saving data from localStorage and seed data
// This can be adapted to load from actual APIs/database when available

import { 
  buildSeedCategories, 
  buildSeedFeaturedProduct, 
  buildSeedProducts 
} from '../data/productCatalog';
import img1 from '../assets/product pictures/571213930_1231364232366527_2109138059830827614_n.jpg';
import img2 from '../assets/product pictures/576374205_1237419018427715_5372252522487259330_n.jpg';
import img3 from '../assets/product pictures/580733069_1245051070997843_6039157899864910099_n.jpg';
import img4 from '../assets/product pictures/581772704_1245050987664518_6957091294094526148_n.jpg';
import img5 from '../assets/product pictures/591048340_1258603809642569_3829171289695157483_n.jpg';
import img6 from '../assets/product pictures/605465823_1280980504071566_1880378652509185128_n.jpg';
import img7 from '../assets/product pictures/615571975_1291969626305987_1674098473504197529_n.jpg';
import img8 from '../assets/product pictures/626686311_1309375694565380_4054011785654238202_n.jpg';
import img9 from '../assets/product pictures/657310366_1355372823299000_3529125053196770722_n.jpg';
import { heroImage } from '../assets/brand';

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
  return [img1, img2, img3, img4, img5, img6, img7, img8, img9];
}

// Helper to get seed welcome images
function getSeedWelcomeImages(): string[] {
  return [heroImage];
}

// Helper to get seed blog posts
function getSeedBlogPosts(): BlogPost[] {
  return [
    {
      id: 1,
      title: "L'Artisanat au Cœur de nos Bijoux",
      content: "Découvrez comment chaque pièce est créée avec passion et savoir-faire ancestral dans notre atelier Ethnic. Nous mettons un point d'honneur à préserver les techniques traditionnelles tout en ajoutant une touche moderne.",
      image: img1,
      author: "Équipe Ethnic",
      createdAt: "15/06/2026"
    },
    {
      id: 2,
      title: "Comment Entretenir vos Bijoux Éthniques",
      content: "Conseils pratiques pour prendre soin de vos bijoux et conserver leur éclat au fil du temps. Nettoyage, rangement, précautions à prendre — on vous dit tout !",
      image: img2,
      author: "Marie Dubois",
      createdAt: "20/06/2026"
    },
    {
      id: 3,
      title: "Notre Nouvelle Collection Été 2026",
      content: "Présentation de notre toute nouvelle collection inspirée par les voyages et les cultures du monde. Couleurs vibrantes, designs uniques — ne la ratez pas !",
      image: img3,
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