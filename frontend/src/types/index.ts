export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  material: string;
  price: number;
  stockQty?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: ProductCategory;
  variants: ProductVariant[];
  moq: number;
  basePrice: number;
  imageUrl?: string;
  images?: string[];
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'InProduction'
  | 'QualityCheck'
  | 'Dispatched'
  | 'OutForDelivery'
  | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  trackingNumber?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  flagType: string;
  size?: string;
  material?: string;
  quantity: number;
  occasion?: string;
  designHelp: boolean;
  designFileUrl?: string;
  deliveryPincode?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryType?: 'Standard' | 'Express';
  message?: string;
  quotedPrice?: number;
  status: 'New' | 'Reviewed' | 'Quoted' | 'Converted' | 'Closed';
  createdAt: string;
}

export interface PageSection {
  section: string;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  metaJson?: Record<string, unknown>;
}

export interface PageContent {
  pageKey: string;
  sections: PageSection[];
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  occasion?: string;
  isActive: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  occasion?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  tags?: string[];
  authorName?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
