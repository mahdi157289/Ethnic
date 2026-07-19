import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { seedCategories, seedFeaturedProduct, seedProducts } from '../data/seed';
import { db } from '../services/databaseLoader';
import type {
  AdminPage,
  BlogPost,
  CartItem,
  Category,
  Customer,
  FeaturedProduct,
  NotificationType,
  Order,
  Product,
  Subscriber,
  Toast,
} from '../types';
import { formatPrice } from '../utils/formatPrice';

interface StoreContextValue {
  categories: Category[];
  products: Product[];
  featuredProduct: Product | null;
  cart: CartItem[];
  orders: Order[];
  customers: Customer[];
  subscribers: Subscriber[];
  blogPosts: BlogPost[];
  galleryImages: string[];
  welcomeImages: string[];
  currentCategoryFilter: string | null;
  cartOpen: boolean;
  checkoutOpen: boolean;
  successOpen: boolean;
  quickViewProduct: Product | null;
  adminOpen: boolean;
  adminPage: AdminPage;
  sidebarCollapsed: boolean;
  hasNewOrders: boolean;
  emailModalOpen: boolean;
  emailModalProduct: Product | null;
  notifiedSubscribers: Subscriber[];
  toasts: Toast[];
  initialProductCount: number;
  editingProduct: Product | null;
  setAdminPage: (page: AdminPage) => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleCart: () => void;
  toggleCheckout: () => void;
  closeSuccessModal: () => void;
  openQuickView: (productId: number) => void;
  closeQuickView: () => void;
  toggleAdmin: () => void;
  closeAdmin: () => void;
  addToCart: (name: string, price: number) => void;
  removeFromCart: (name: string) => void;
  cartTotal: number;
  cartCount: number;
  filterByCategory: (name: string) => void;
  clearCategoryFilter: () => void;
  addCategory: (name: string, image: string) => boolean;
  deleteCategory: (id: number) => void;
  addProduct: (data: {
    name: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    type: 'normal' | 'featured';
    salePrice?: number;
    tags?: string[];
    rating?: number;
  }) => void;
  updateProduct: (id: number, data: {
    name: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    type: 'normal' | 'featured';
    salePrice?: number;
    tags?: string[];
    rating?: number;
  }) => void;
  deleteProduct: (id: number) => void;
  removeFeatured: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  subscribeNewsletter: (email: string) => void;
  removeSubscriber: (email: string) => void;
  placeOrder: (data: { name: string; email: string; phone: string; address: string }) => void;
  showNotification: (message: string, type: NotificationType) => void;
  closeEmailModal: () => void;
  getProductById: (id: number) => Product | undefined;
  addBlogPost: (data: {
    title: string;
    content: string;
    image: string;
    author: string;
  }) => void;
  updateBlogPost: (id: number, data: {
    title: string;
    content: string;
    image: string;
    author: string;
  }) => void;
  deleteBlogPost: (id: number) => void;
  addGalleryImage: (image: string) => void;
  deleteGalleryImage: (index: number) => void;
  addWelcomeImage: (image: string) => void;
  updateWelcomeImage: (index: number, image: string) => void;
  deleteWelcomeImage: (index: number) => void;
  setEditingProduct: (product: Product | null) => void;
  formatPrice: typeof formatPrice;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<FeaturedProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [welcomeImages, setWelcomeImages] = useState<string[]>([]);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailModalProduct, setEmailModalProduct] = useState<Product | null>(null);
  const [notifiedSubscribers, setNotifiedSubscribers] = useState<Subscriber[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const initialProductCount = useRef(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Save functions that sync to localStorage
  const saveProducts = useCallback(async (newProducts: Product[]) => {
    await db.saveProducts(newProducts);
  }, []);

  const saveCategories = useCallback(async (newCategories: Category[]) => {
    await db.saveCategories(newCategories);
  }, []);

  const saveBlogPosts = useCallback(async (newBlogPosts: BlogPost[]) => {
    await db.saveBlogPosts(newBlogPosts);
  }, []);

  const saveFeaturedProduct = useCallback(async (product: FeaturedProduct | null) => {
    await db.saveFeaturedProduct(product);
  }, []);

  const saveGalleryImages = useCallback(async (images: string[]) => {
    await db.saveGalleryImages(images);
  }, []);

  const saveWelcomeImages = useCallback(async (images: string[]) => {
    await db.saveWelcomeImages(images);
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      // Try to load from database first
      const [loadedProducts, loadedCategories, loadedBlogPosts, loadedFeatured, loadedGallery, loadedWelcome] = await Promise.all([
        db.loadProducts(),
        db.loadCategories(),
        db.loadBlogPosts(),
        db.loadFeaturedProduct(),
        db.loadGalleryImages(),
        db.loadWelcomeImages(),
      ]);
      
      setProducts(loadedProducts);
      setCategories(loadedCategories);
      setBlogPosts(loadedBlogPosts);
      setFeaturedProduct(loadedFeatured);
      setGalleryImages(loadedGallery);
      setWelcomeImages(loadedWelcome);
      setInitialProductCountRef(loadedProducts?.length || 0);
    } catch (error) {
      console.log('Using seed data (database not available)');
      // Fallback to seed data directly
      setProducts(seedProducts);
      setCategories(seedCategories);
      setFeaturedProduct(seedFeaturedProduct);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  const setInitialProductCountRef = useCallback((count: number) => {
    initialProductCount.current = count;
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const getProductById = useCallback(
    (id: number) => {
      if (featuredProduct?.id === id) return featuredProduct;
      return products.find((p) => p.id === id);
    },
    [products, featuredProduct],
  );

  const sendProductNotifications = useCallback(
    (product: Product) => {
      if (subscribers.length === 0) return;
      setNotifiedSubscribers([...subscribers]);
      setEmailModalProduct(product);
      setEmailModalOpen(true);
    },
    [subscribers],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const addToCart = useCallback(
    (name: string, price: number) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.name === name);
        if (existing) {
          return prev.map((i) => (i.name === name ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...prev, { name, price, quantity: 1 }];
      });
      showNotification(`${name} added to cart`, 'success');
    },
    [showNotification],
  );

  const removeFromCart = useCallback((name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const toggleCart = useCallback(() => setCartOpen((o) => !o), []);

  const toggleCheckout = useCallback(() => setCheckoutOpen((o) => !o), []);

  const closeSuccessModal = useCallback(() => setSuccessOpen(false), []);

  const openQuickView = useCallback(
    (productId: number) => {
      const product = getProductById(productId);
      if (product) setQuickViewProduct(product);
    },
    [getProductById],
  );

  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  const toggleAdmin = useCallback(() => {
    setAdminOpen((open) => {
      if (!open) {
        setAdminPage('dashboard');
        setHasNewOrders(false);
      }
      return !open;
    });
  }, []);

  const closeAdmin = useCallback(() => setAdminOpen(false), []);

  const filterByCategory = useCallback((name: string) => {
    setCurrentCategoryFilter(name);
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const clearCategoryFilter = useCallback(() => setCurrentCategoryFilter(null), []);

  const addCategory = useCallback(
    (name: string, image: string) => {
      if (!name.trim()) {
        showNotification('Please enter a category name', 'error');
        return false;
      }
      if (!image) {
        showNotification('Please upload a category image', 'error');
        return false;
      }
      if (categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
        showNotification('Category already exists', 'error');
        return false;
      }
      const newCat: Category = {
        id: Date.now(),
        name: name.trim(),
        image,
        count: 0,
      };
      const updatedCategories = [...categories, newCat];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      showNotification(`Category "${name}" added`, 'success');
      return true;
    },
    [categories, showNotification, saveCategories],
  );

  const deleteCategory = useCallback(
    (id: number) => {
      const cat = categories.find((c) => c.id === id);
      if (!cat) return;
      if (!confirm(`Delete category "${cat.name}"? Products in this category will remain.`)) return;
      const updatedCategories = categories.filter((x) => x.id !== id);
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      if (currentCategoryFilter === cat.name) setCurrentCategoryFilter(null);
      showNotification('Category deleted', 'success');
    },
    [categories, currentCategoryFilter, showNotification, saveCategories],
  );

  const addProduct = useCallback(
    (data: {
      name: string;
      category: string;
      price: number;
      description: string;
      images: string[];
      type: 'normal' | 'featured';
      salePrice?: number;
      tags?: string[];
      rating?: number;
    }) => {
      let newProduct: Product | FeaturedProduct;
      if (data.type === 'featured') {
        const featuredProductData: FeaturedProduct = {
          id: Date.now(),
          name: data.name,
          price: data.price,
          salePrice: data.salePrice ?? Math.floor(data.price * 0.8),
          images: data.images,
          category: data.category,
          type: 'featured',
          description:
            data.description ||
            `Découvrez ${data.name}. Un bijou exceptionnel de notre collection ${data.category}, disponible à prix spécial.`,
          tags: data.tags ?? [],
          rating: data.rating ?? 5,
        };
        newProduct = featuredProductData;
        setFeaturedProduct(featuredProductData);
        saveFeaturedProduct(featuredProductData);
      } else {
        newProduct = {
          id: Date.now(),
          name: data.name,
          price: data.price,
          images: data.images,
          category: data.category,
          type: 'normal',
          description: data.description || '',
          tags: data.tags ?? [],
          rating: data.rating ?? 5,
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
      }
      sendProductNotifications(newProduct);
      showNotification('Product added successfully', 'success');
    },
    [sendProductNotifications, showNotification, products, saveProducts, saveFeaturedProduct],
  );

  const updateProduct = useCallback(
    (id: number, data: {
      name: string;
      category: string;
      price: number;
      description: string;
      images: string[];
      type: 'normal' | 'featured';
      salePrice?: number;
      tags?: string[];
      rating?: number;
    }) => {
      const existingProduct = products.find(p => p.id === id) ?? featuredProduct;
      const existingTags = existingProduct?.tags ?? [];
      const existingRating = existingProduct?.rating ?? 5;
      
      const updatedProductBase = {
        id,
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        images: data.images,
        tags: data.tags ?? existingTags,
        rating: data.rating ?? existingRating,
      };

      if (data.type === 'featured') {
        const updatedFeaturedProduct: FeaturedProduct = {
          ...updatedProductBase,
          type: 'featured',
          salePrice: data.salePrice ?? Math.floor(data.price * 0.8),
        };
        setFeaturedProduct(updatedFeaturedProduct);
        saveFeaturedProduct(updatedFeaturedProduct);
        const updatedProducts = products.filter((x) => x.id !== id);
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
      } else {
        const updatedProduct: Product = {
          ...updatedProductBase,
          type: 'normal',
        };
        const updatedProducts = products.map((x) => x.id === id ? updatedProduct : x);
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
        if (featuredProduct?.id === id) {
          setFeaturedProduct(null);
          saveFeaturedProduct(null);
        }
      }
      showNotification('Product updated successfully', 'success');
    },
    [products, featuredProduct, showNotification, saveProducts, saveFeaturedProduct],
  );

  const deleteProduct = useCallback(
    (id: number) => {
      if (!confirm('Are you sure you want to delete this product?')) return;
      const updatedProducts = products.filter((x) => x.id !== id);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      if (featuredProduct?.id === id) {
        setFeaturedProduct(null);
        saveFeaturedProduct(null);
      }
      showNotification('Product deleted successfully', 'error');
    },
    [products, featuredProduct, showNotification, saveProducts, saveFeaturedProduct],
  );

  const removeFeatured = useCallback(() => {
    if (!confirm('Retirer ce bijou de la section vedette ?')) return;
    setFeaturedProduct(null);
    saveFeaturedProduct(null);
    showNotification('Bijou vedette retiré', 'success');
  }, [showNotification, saveFeaturedProduct]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((o) => o.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
  }, []);

  const subscribeNewsletter = useCallback(
    (email: string) => {
      if (subscribers.some((s) => s.email === email)) {
        showNotification('You are already subscribed!', 'error');
        return;
      }
      setSubscribers((s) => [
        ...s,
        { email, source: 'newsletter', subscribedAt: new Date().toLocaleDateString() },
      ]);
      showNotification('Successfully subscribed!', 'success');
    },
    [subscribers, showNotification],
  );

  const removeSubscriber = useCallback(
    (email: string) => {
      if (!confirm('Remove this subscriber?')) return;
      setSubscribers((s) => s.filter((x) => x.email !== email));
      showNotification('Subscriber removed', 'success');
    },
    [showNotification],
  );

  const placeOrder = useCallback(
    (data: { name: string; email: string; phone: string; address: string }) => {
      const customerId = Date.now();
      setCustomers((prev) => {
        if (prev.find((c) => c.email === data.email)) return prev;
        return [
          ...prev,
          {
            id: customerId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            createdAt: new Date().toLocaleDateString(),
          },
        ];
      });

      const existing = customers.find((c) => c.email === data.email);
      const customerIdForOrder = existing?.id ?? customerId;

      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        customerId: customerIdForOrder,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerAddress: data.address,
        items: [...cart],
        total: cartTotal,
        status: 'pending',
        createdAt: new Date().toLocaleString(),
      };

      setOrders((o) => [order, ...o]);
      setHasNewOrders(true);

      if (!subscribers.find((s) => s.email === data.email)) {
        setSubscribers((s) => [
          ...s,
          {
            email: data.email,
            name: data.name,
            source: 'purchase',
            subscribedAt: new Date().toLocaleDateString(),
          },
        ]);
      }

      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setTimeout(() => setSuccessOpen(true), 300);
    },
    [cart, cartTotal, customers, subscribers],
  );

  const closeEmailModal = useCallback(() => {
    setEmailModalOpen(false);
    setEmailModalProduct(null);
    setNotifiedSubscribers([]);
  }, []);

  const addBlogPost = useCallback(
    (data: {
      title: string;
      content: string;
      image: string;
      author: string;
    }) => {
      if (!data.title.trim()) {
        showNotification('Please enter a blog title', 'error');
        return;
      }
      if (!data.content.trim()) {
        showNotification('Please enter blog content', 'error');
        return;
      }
      if (!data.image) {
        showNotification('Please upload a blog image', 'error');
        return;
      }
      const newPost: BlogPost = {
        id: Date.now(),
        title: data.title.trim(),
        content: data.content.trim(),
        image: data.image,
        author: data.author.trim(),
        createdAt: new Date().toLocaleDateString(),
      };
      const updatedBlogPosts = [newPost, ...blogPosts];
      setBlogPosts(updatedBlogPosts);
      saveBlogPosts(updatedBlogPosts);
      showNotification('Blog post added successfully', 'success');
    },
    [blogPosts, showNotification, saveBlogPosts],
  );

  const deleteBlogPost = useCallback(
    (id: number) => {
      if (!confirm('Are you sure you want to delete this blog post?')) return;
      const updatedBlogPosts = blogPosts.filter((p) => p.id !== id);
      setBlogPosts(updatedBlogPosts);
      saveBlogPosts(updatedBlogPosts);
      showNotification('Blog post deleted successfully', 'success');
    },
    [blogPosts, showNotification, saveBlogPosts],
  );

  const updateBlogPost = useCallback(
    (id: number, data: {
      title: string;
      content: string;
      image: string;
      author: string;
    }) => {
      if (!data.title.trim()) {
        showNotification('Please enter a blog title', 'error');
        return;
      }
      if (!data.content.trim()) {
        showNotification('Please enter blog content', 'error');
        return;
      }
      if (!data.image) {
        showNotification('Please upload a blog image', 'error');
        return;
      }
      const updatedBlogPosts = blogPosts.map((p) =>
        p.id === id
          ? { ...p, title: data.title.trim(), content: data.content.trim(), image: data.image, author: data.author.trim() }
          : p,
      );
      setBlogPosts(updatedBlogPosts);
      saveBlogPosts(updatedBlogPosts);
      showNotification('Blog post updated successfully', 'success');
    },
    [blogPosts, showNotification, saveBlogPosts],
  );

  const addGalleryImage = useCallback(
    (image: string) => {
      if (!image) {
        showNotification('Please upload a gallery image', 'error');
        return;
      }
      const updatedGalleryImages = [image, ...galleryImages];
      setGalleryImages(updatedGalleryImages);
      saveGalleryImages(updatedGalleryImages);
      showNotification('Gallery image added successfully', 'success');
    },
    [galleryImages, showNotification, saveGalleryImages],
  );

  const deleteGalleryImage = useCallback(
    (index: number) => {
      if (!confirm('Are you sure you want to delete this gallery image?')) return;
      const updatedGalleryImages = galleryImages.filter((_, i) => i !== index);
      setGalleryImages(updatedGalleryImages);
      saveGalleryImages(updatedGalleryImages);
      showNotification('Gallery image deleted successfully', 'success');
    },
    [galleryImages, showNotification, saveGalleryImages],
  );

  const addWelcomeImage = useCallback(
    (image: string) => {
      if (!image) {
        showNotification('Please upload a welcome image', 'error');
        return;
      }
      const updatedWelcomeImages = [...welcomeImages, image];
      setWelcomeImages(updatedWelcomeImages);
      saveWelcomeImages(updatedWelcomeImages);
      showNotification('Welcome image added successfully', 'success');
    },
    [welcomeImages, showNotification, saveWelcomeImages],
  );

  const updateWelcomeImage = useCallback(
    (index: number, image: string) => {
      if (!image) {
        showNotification('Please upload a welcome image', 'error');
        return;
      }
      const updatedWelcomeImages = welcomeImages.map((img, i) => i === index ? image : img);
      setWelcomeImages(updatedWelcomeImages);
      saveWelcomeImages(updatedWelcomeImages);
      showNotification('Welcome image updated successfully', 'success');
    },
    [welcomeImages, showNotification, saveWelcomeImages],
  );

  const deleteWelcomeImage = useCallback(
    (index: number) => {
      if (!confirm('Are you sure you want to delete this welcome image?')) return;
      const updatedWelcomeImages = welcomeImages.filter((_, i) => i !== index);
      setWelcomeImages(updatedWelcomeImages);
      saveWelcomeImages(updatedWelcomeImages);
      showNotification('Welcome image deleted successfully', 'success');
    },
    [welcomeImages, showNotification, saveWelcomeImages],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      categories,
      products,
      featuredProduct,
      editingProduct,
      cart,
      orders,
      customers,
      subscribers,
      blogPosts,
      galleryImages,
      welcomeImages,
      currentCategoryFilter,
      cartOpen,
      checkoutOpen,
      successOpen,
      quickViewProduct,
      adminOpen,
      adminPage,
      sidebarCollapsed,
      hasNewOrders,
      emailModalOpen,
      emailModalProduct,
      notifiedSubscribers,
      toasts,
      initialProductCount: initialProductCount.current,
      setAdminPage,
      setSidebarCollapsed,
      toggleCart,
      toggleCheckout,
      closeSuccessModal,
      openQuickView,
      closeQuickView,
      toggleAdmin,
      closeAdmin,
      addToCart,
      removeFromCart,
      cartTotal,
      cartCount,
      filterByCategory,
      clearCategoryFilter,
      addCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      removeFeatured,
      updateOrderStatus,
      subscribeNewsletter,
      removeSubscriber,
      placeOrder,
      showNotification,
      closeEmailModal,
      getProductById,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addGalleryImage,
      deleteGalleryImage,
      addWelcomeImage,
      updateWelcomeImage,
      deleteWelcomeImage,
      setEditingProduct,
      formatPrice,
    }),
    [
      categories,
      products,
      featuredProduct,
      editingProduct,
      cart,
      orders,
      customers,
      subscribers,
      blogPosts,
      galleryImages,
      welcomeImages,
      currentCategoryFilter,
      cartOpen,
      checkoutOpen,
      successOpen,
      quickViewProduct,
      adminOpen,
      adminPage,
      sidebarCollapsed,
      hasNewOrders,
      emailModalOpen,
      emailModalProduct,
      notifiedSubscribers,
      toasts,
      setAdminPage,
      setSidebarCollapsed,
      addToCart,
      removeFromCart,
      cartTotal,
      cartCount,
      toggleCart,
      toggleCheckout,
      closeSuccessModal,
      openQuickView,
      closeQuickView,
      toggleAdmin,
      closeAdmin,
      filterByCategory,
      clearCategoryFilter,
      addCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      removeFeatured,
      updateOrderStatus,
      subscribeNewsletter,
      removeSubscriber,
      placeOrder,
      showNotification,
      closeEmailModal,
      getProductById,
      addBlogPost,
      deleteBlogPost,
      addGalleryImage,
      deleteGalleryImage,
      addWelcomeImage,
      updateWelcomeImage,
      deleteWelcomeImage,
      setEditingProduct,
      formatPrice,
    ],
  );

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (!dataLoaded) {
    return null; // Or a loading spinner, but VideoLoader is already handling initial load
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}