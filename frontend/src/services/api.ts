import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import type {
  Product,
  ProductCategory,
  Order,
  Quote,
  PageSection,
  MediaAsset,
  Testimonial,
  GalleryItem,
  Faq,
  BlogPost,
  AuthUser,
  AuthResponse,
} from '../types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  me: () =>
    apiClient.get<AuthUser>('/auth/me').then((r) => r.data),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (params?: { category?: string; search?: string }) =>
    apiClient.get<Product[]>('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<Product>(`/products/slug/${slug}`).then((r) => r.data),

  getCategories: () =>
    apiClient.get<ProductCategory[]>('/products/categories').then((r) => r.data),

  create: (data: Partial<Product>) =>
    apiClient.post<Product>('/products', data).then((r) => r.data),

  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),

  createCategory: (data: Partial<ProductCategory>) =>
    apiClient.post<ProductCategory>('/products/categories', data).then((r) => r.data),

  updateCategory: (id: string, data: Partial<ProductCategory>) =>
    apiClient.put<ProductCategory>(`/products/categories/${id}`, data).then((r) => r.data),

  deleteCategory: (id: string) =>
    apiClient.delete(`/products/categories/${id}`).then((r) => r.data),
};

// ─── Content ──────────────────────────────────────────────────────────────────

export const contentApi = {
  submitQuote: (data: Partial<Quote>) =>
    apiClient.post<{ orderNumber: string; message: string }>('/content/quotes', data).then((r) => r.data),

  getQuotes: () =>
    apiClient.get<Quote[]>('/content/quotes').then((r) => r.data),

  updateQuote: (id: string, data: Partial<Quote>) =>
    apiClient.put<Quote>(`/content/quotes/${id}`, data).then((r) => r.data),

  getTestimonials: () =>
    apiClient.get<Testimonial[]>('/content/testimonials').then((r) => r.data),

  createTestimonial: (data: Partial<Testimonial>) =>
    apiClient.post<Testimonial>('/content/testimonials', data).then((r) => r.data),

  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    apiClient.put<Testimonial>(`/content/testimonials/${id}`, data).then((r) => r.data),

  deleteTestimonial: (id: string) =>
    apiClient.delete(`/content/testimonials/${id}`).then((r) => r.data),

  getGallery: (occasion?: string) =>
    apiClient.get<GalleryItem[]>('/content/gallery', { params: occasion ? { occasion } : undefined }).then((r) => r.data),

  createGalleryItem: (data: Partial<GalleryItem>) =>
    apiClient.post<GalleryItem>('/content/gallery', data).then((r) => r.data),

  updateGalleryItem: (id: string, data: Partial<GalleryItem>) =>
    apiClient.put<GalleryItem>(`/content/gallery/${id}`, data).then((r) => r.data),

  deleteGalleryItem: (id: string) =>
    apiClient.delete(`/content/gallery/${id}`).then((r) => r.data),

  getFaq: (category?: string) =>
    apiClient.get<Faq[]>('/content/faq', { params: category ? { category } : undefined }).then((r) => r.data),

  createFaq: (data: Partial<Faq>) =>
    apiClient.post<Faq>('/content/faq', data).then((r) => r.data),

  updateFaq: (id: string, data: Partial<Faq>) =>
    apiClient.put<Faq>(`/content/faq/${id}`, data).then((r) => r.data),

  deleteFaq: (id: string) =>
    apiClient.delete(`/content/faq/${id}`).then((r) => r.data),

  getBlog: () =>
    apiClient.get<BlogPost[]>('/content/blog').then((r) => r.data),

  getBlogBySlug: (slug: string) =>
    apiClient.get<BlogPost>(`/content/blog/${slug}`).then((r) => r.data),

  createBlogPost: (data: Partial<BlogPost>) =>
    apiClient.post<BlogPost>('/content/blog', data).then((r) => r.data),

  updateBlogPost: (id: string, data: Partial<BlogPost>) =>
    apiClient.put<BlogPost>(`/content/blog/${id}`, data).then((r) => r.data),

  deleteBlogPost: (id: string) =>
    apiClient.delete(`/content/blog/${id}`).then((r) => r.data),

  getPage: (pageKey: string) =>
    apiClient.get<PageSection[]>(`/content/page/${pageKey}`).then((r) => r.data),

  updatePageSection: (pageKey: string, section: string, data: Partial<PageSection>) =>
    apiClient.put<PageSection>(`/content/page/${pageKey}/${section}`, data).then((r) => r.data),
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export const ordersApi = {
  place: (data: Partial<Order>) =>
    apiClient.post<Order>('/orders', data).then((r) => r.data),

  track: (orderNumber: string) =>
    apiClient.get<Order>(`/orders/track/${orderNumber}`).then((r) => r.data),

  getAll: (params?: { status?: string }) =>
    apiClient.get<Order[]>('/orders', { params }).then((r) => r.data),

  update: (id: string, data: Partial<Order>) =>
    apiClient.put<Order>(`/orders/${id}`, data).then((r) => r.data),
};

// ─── Media ───────────────────────────────────────────────────────────────────

export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<MediaAsset>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  getAll: () =>
    apiClient.get<MediaAsset[]>('/media').then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/media/${id}`).then((r) => r.data),
};

export default apiClient;
