export type ProductType = 'normal' | 'featured';

export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  images: string[];
  category: string;
  type: ProductType;
  tags: string[];
  rating: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Subscriber {
  email: string;
  name?: string;
  source: 'newsletter' | 'purchase';
  subscribedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export type AdminPage = 'dashboard' | 'products' | 'blog' | 'gallery';
export type NotificationType = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: NotificationType;
}
