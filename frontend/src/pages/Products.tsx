import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { productsApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import type { Product } from '../types';

// ── Default products shown when backend has no data yet ──────────────────────
const DEFAULT_PRODUCTS = [
  {
    id: 'd1', slug: 'single-table-flag-transparent',
    name: 'Single Table Flag – Transparent Acrylic Stand',
    description: 'Elegant transparent acrylic base with stainless steel pole. Perfect for conference tables, corporate desks, and diplomatic settings. Custom country or logo print on 100% polyester fabric.',
    category: { id: 'c1', name: 'Single Table Flag', slug: 'single-table-flag', displayOrder: 1 },
    categoryId: 'c1', moq: 50, basePrice: 770,
    imageUrl: '/images/1.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd2', slug: 'single-table-flag-brass',
    name: 'Single Table Flag – Brass Stand',
    description: 'Premium brass finish stand with stainless steel pole. Gold-toned base gives a prestigious look for government offices, embassies, and board rooms.',
    category: { id: 'c1', name: 'Single Table Flag', slug: 'single-table-flag', displayOrder: 1 },
    categoryId: 'c1', moq: 50, basePrice: 870,
    imageUrl: '/images/2.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd3', slug: 'cross-table-flag-acrylic',
    name: 'Cross Table Flag – Black Acrylic + Gold Top',
    description: 'Cross-base design for extra stability. Black acrylic base with gold-tone top cap. Ideal for bilateral meetings, diplomatic events, and international summits.',
    category: { id: 'c2', name: 'Cross Table Flag', slug: 'cross-table-flag', displayOrder: 2 },
    categoryId: 'c2', moq: 50, basePrice: 871,
    imageUrl: '/images/2.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd4', slug: 'india-country-flag-2x3ft',
    name: 'Country Flag – India (2ft × 3ft)',
    description: 'BIS-standard Indian Tricolour and all 195 country flags. Premium knitted polyester, vivid dye-sublimation print. Available in 2×3ft, 3×4.5ft, and 4×6ft sizes.',
    category: { id: 'c3', name: 'Country Flag', slug: 'country-flag', displayOrder: 3 },
    categoryId: 'c3', moq: 50, basePrice: 180,
    imageUrl: '/images/3.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd5', slug: 'sports-flag-csk-ipl',
    name: 'IPL Cricket Flag – 3ft × 5ft',
    description: 'Cheer your favourite IPL team with bold, full-colour team flags. Available for all 10 IPL franchises. Ideal for stadiums, fan zones, and watch parties.',
    category: { id: 'c4', name: 'Sports Flag', slug: 'sports-flag', displayOrder: 4 },
    categoryId: 'c4', moq: 50, basePrice: 999,
    imageUrl: '/images/13.png', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd6', slug: 'sports-flag-mi-ipl',
    name: 'IPL Cricket Flag – Mumbai Indians',
    description: 'Bright blue and gold team flag with official team logo print. 3ft × 5ft, lightweight polyester, double-stitched edges for durability in outdoor use.',
    category: { id: 'c4', name: 'Sports Flag', slug: 'sports-flag', displayOrder: 4 },
    categoryId: 'c4', moq: 50, basePrice: 999,
    imageUrl: '/images/14.png', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd7', slug: 'advertising-flag-2x6ft',
    name: 'Advertising Flag – 2ft × 6ft',
    description: 'Tall single-pole advertising flags for outdoor promotions, retail stores, exhibitions, and events. Vivid sublimation print, weather-resistant polyester fabric.',
    category: { id: 'c5', name: 'Advertising Flags', slug: 'advertising-flags', displayOrder: 5 },
    categoryId: 'c5', moq: 50, basePrice: 350,
    imageUrl: '/images/4.png', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd8', slug: 'feather-flag-3m',
    name: 'Feather Flag – 3 Metre',
    description: 'Eye-catching feather-shaped outdoor flag for exhibitions, trade shows, and retail. Includes ground stake and cross base. 110gsm polyester with vibrant all-over print.',
    category: { id: 'c6', name: 'Feather Flags', slug: 'feather-flags', displayOrder: 6 },
    categoryId: 'c6', moq: 50, basePrice: 1200,
    imageUrl: '/images/7.png', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd9', slug: 'car-flag-inside',
    name: 'Car Flag – Inside the Car',
    description: 'Flag mounted on window-clip pole for car windows. Popular for political rallies, national days, and sports events. Custom design on polyester fabric.',
    category: { id: 'c7', name: 'Car Flag', slug: 'car-flag', displayOrder: 7 },
    categoryId: 'c7', moq: 50, basePrice: 120,
    imageUrl: '/images/6.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd10', slug: 'political-flag-outdoor',
    name: 'Political Outdoor Flag – 4ft × 6ft',
    description: 'Large outdoor political flags for rallies, processions, and campaign events. Heavy-duty polyester, grommets on all four sides, UV-resistant ink.',
    category: { id: 'c8', name: 'Political Flag', slug: 'political-flag', displayOrder: 8 },
    categoryId: 'c8', moq: 100, basePrice: 280,
    imageUrl: '/images/9.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd11', slug: 'armed-forces-flag-army',
    name: 'Armed Forces Table Flag – Indian Army',
    description: 'Official Indian Army table flag on premium stainless steel stand. Available for Army, Navy, Air Force, Coast Guard, and NCC. Perfect for regimental offices.',
    category: { id: 'c9', name: 'Armed Forces Flag', slug: 'armed-forces-flag', displayOrder: 9 },
    categoryId: 'c9', moq: 50, basePrice: 890,
    imageUrl: '/images/3.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
  {
    id: 'd12', slug: 'custom-logo-flag',
    name: 'Custom Logo Flag – Any Size',
    description: 'Fully custom branded flags with your company logo, slogan, or event artwork. Minimum 50 units. Provide your design or use our free design service (500+ units).',
    category: { id: 'c10', name: 'Custom Flag', slug: 'custom', displayOrder: 10 },
    categoryId: 'c10', moq: 50, basePrice: 200,
    imageUrl: '/images/8.jpg', variants: [], isActive: true,
    createdAt: '', updatedAt: '',
  },
] as Product[];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-video overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blue-100 to-blue-200">
            🚩
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-charcoal text-base leading-snug">{product.name}</h3>
          {product.category && (
            <Badge variant="blue">{product.category.name}</Badge>
          )}
        </div>
        {product.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
        )}
        <p className="text-wf-blue font-bold text-lg mb-4">
          From ₹{product.basePrice.toFixed(0)}/unit
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">MOQ: {product.moq} units</span>
          <Link
            to={`/products/${product.slug}`}
            className="px-4 py-2 bg-wf-blue hover:bg-wf-blue-dark text-white text-sm font-semibold rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const activeCategory = searchParams.get('category') || 'all';

  const { data: categories = [], isPending: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const { data: products = [], isPending: prodLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(
        (p) => p.category?.slug === activeCategory || p.categoryId === activeCategory
      );
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, searchTerm]);

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') {
      next.delete('category');
    } else {
      next.set('category', slug);
    }
    setSearchParams(next);
  };

  const displayProducts = products.length > 0 ? filteredProducts : DEFAULT_PRODUCTS.filter((p) => {
    if (activeCategory !== 'all' && p.category?.slug !== activeCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const displayCategories = categories.length > 0
    ? categories
    : [...new Map(DEFAULT_PRODUCTS.map((p) => [p.categoryId, p.category!])).values()];

  if (catLoading || prodLoading) return <PageSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-2">All Products</h1>
        <p className="text-gray-500">Browse our complete range of flags and banners</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wf-blue/50 focus:border-wf-blue"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal size={16} className="text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-wf-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-wf-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-charcoal mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try a different search term or category</p>
          <button
            onClick={() => { setSearchTerm(''); setCategory('all'); }}
            className="px-5 py-2 bg-wf-blue text-white font-semibold rounded-lg hover:bg-wf-blue-dark transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
