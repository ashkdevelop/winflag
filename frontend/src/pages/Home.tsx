import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  Truck,
  FileText,
  Zap,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { productsApi, contentApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import type { ProductCategory } from '../types';

// â”€â”€ Static category definitions (used when API returns nothing) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATIC_CATEGORIES = [
  {
    name: 'Single Table Flag',
    slug: 'single-table-flag',
    sub: 'Acrylic Â· Brass Â· Stainless Steel Â· Wooden',
    image: '/images/1.jpg',
    gradient: 'from-blue-700 to-blue-950',
  },
  {
    name: 'Cross Table Flag',
    slug: 'cross-table-flag',
    sub: 'T-Shape Â· Y-Shape Â· Acrylic Â· Metal',
    image: '/images/2.jpg',
    gradient: 'from-indigo-700 to-blue-900',
  },
  {
    name: 'Car Flag',
    slug: 'car-flag',
    sub: 'Inside the car Â· Outside the car',
    image: null,
    gradient: 'from-red-600 to-red-900',
  },
  {
    name: 'Country Flag',
    slug: 'country-flag',
    sub: '2Ã—3ft Â· 3Ã—4.5ft Â· 4Ã—6ft',
    image: '/images/3.jpg',
    gradient: 'from-green-700 to-emerald-900',
  },
  {
    name: 'Feather & Teardrop Flags',
    slug: 'feather-teardrop-flags',
    sub: 'Event Â· Exhibition Â· Retail',
    image: '/images/4.png',
    gradient: 'from-purple-600 to-violet-900',
  },
  {
    name: 'Advertising Flags',
    slug: 'advertising-flags',
    sub: '2Ã—6ft Â· 3Ã—7ft Â· 4Ã—8ft Â· Custom',
    image: '/images/7.png',
    gradient: 'from-orange-600 to-red-800',
  },
  {
    name: 'Armed Forces Flag',
    slug: 'armed-forces-flag',
    sub: 'Army Â· Navy Â· Air Force Â· NCC',
    image: null,
    gradient: 'from-slate-600 to-slate-900',
  },
  {
    name: 'Sports Flag',
    slug: 'sports-flag',
    sub: 'Cricket Â· Football Â· All sports',
    image: '/images/5.jpg',
    gradient: 'from-yellow-500 to-orange-700',
  },
  {
    name: 'Custom / Logo Flag',
    slug: 'custom',
    sub: 'Any design Â· Any size Â· Bulk orders',
    image: '/images/8.jpg',
    gradient: 'from-pink-600 to-rose-800',
  },
];

// Stand types shown as pills below the category grid
const TABLE_FLAG_STANDS = [
  'Transparent Acrylic',
  'Black Acrylic + Gold Top',
  'Brass Stand',
  'Stainless Steel Round',
  'Stainless Steel Square',
  'Wooden (10 inch)',
  'Wooden (15 inch)',
  'T-Shape',
  'Y-Shape',
  'L-Shape',
];

// All additional flag types shown in the "Browse All" strip
const ALL_FLAG_TYPES = [
  { label: 'Indian National Flag', slug: 'indian-national-flag' },
  { label: 'Political Flag', slug: 'political-flag' },
  { label: 'Hand Flags', slug: 'hand-flags' },
  { label: 'Wall Mount Flag', slug: 'wall-mount-flag' },
  { label: 'String Flags', slug: 'string-flags' },
  { label: 'Pennants Flags', slug: 'pennants-flags' },
  { label: 'Pride Flags', slug: 'pride-flags' },
  { label: 'Group Flags', slug: 'group-flags' },
  { label: 'Hotel Flag', slug: 'hotel-flag' },
  { label: 'School / University Flags', slug: 'school-flags' },
  { label: 'Promotional Flags', slug: 'promotional-flags' },
  { label: 'Tour Guide Flag', slug: 'tour-guide-flag' },
  { label: 'Sharkfin Flags', slug: 'sharkfin-flags' },
  { label: 'Plain / Solid Colour Flags', slug: 'solid-colour-flags' },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: <FileText size={28} />,
    title: 'Submit Your Requirement',
    desc: 'Fill our quick quote form with flag type, size, quantity, and delivery details.',
  },
  {
    step: 2,
    icon: <MessageCircle size={28} />,
    title: 'Get a Custom Quote',
    desc: 'Our team reviews your order and sends a detailed quote within 2 business hours.',
  },
  {
    step: 3,
    icon: <CheckCircle size={28} />,
    title: 'Approve & Pay',
    desc: 'Approve the design proof, confirm the order, and make payment via UPI/NEFT.',
  },
  {
    step: 4,
    icon: <Truck size={28} />,
    title: 'Pan-India Delivery',
    desc: 'Your flags are packed and dispatched within 3â€“7 business days, anywhere in India.',
  },
];

const TRUST_ITEMS = [
  { icon: <Package size={22} />, title: '50+ MOQ', sub: 'Minimum order quantity' },
  { icon: <Zap size={22} />, title: '48-Hr Express', sub: 'Rush production available' },
  { icon: <FileText size={22} />, title: 'GST Invoice', sub: 'For all B2B orders' },
  { icon: <Truck size={22} />, title: 'Pan-India', sub: 'Delivery to all states' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

// â”€â”€ Category card using either a background image or gradient â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StaticCategoryCard({
  cat,
}: {
  cat: (typeof STATIC_CATEGORIES)[number];
}) {
  return (
    <Link
      to={`/products?category=${cat.slug}`}
      className="group relative overflow-hidden rounded-2xl h-52 flex flex-col justify-end p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {cat.image ? (
        <img
          src={cat.image}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : null}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          cat.image ? 'from-black/75 via-black/30 to-transparent' : `bg-gradient-to-br ${cat.gradient}`
        }`}
      />
      {!cat.image && (
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
      )}
      <div className="relative z-10">
        <h3 className="text-white font-bold text-lg leading-tight">{cat.name}</h3>
        <p className="text-white/75 text-xs mt-0.5">{cat.sub}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-yellow-300 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Browse <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

// â”€â”€ API-driven category card (when backend has categories seeded) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const API_GRADIENTS = [
  'from-blue-700 to-blue-950',
  'from-indigo-700 to-blue-900',
  'from-red-600 to-red-900',
  'from-green-700 to-emerald-900',
  'from-purple-600 to-violet-900',
  'from-orange-600 to-red-800',
  'from-slate-600 to-slate-900',
  'from-yellow-500 to-orange-700',
  'from-pink-600 to-rose-800',
];

function ApiCategoryCard({ category, index }: { category: ProductCategory; index: number }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-2xl h-52 flex flex-col justify-end p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {category.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : null}
      <div
        className={`absolute inset-0 ${
          category.imageUrl
            ? 'bg-gradient-to-t from-black/75 via-black/30 to-transparent'
            : `bg-gradient-to-br ${API_GRADIENTS[index % API_GRADIENTS.length]}`
        }`}
      />
      <div className="relative z-10">
        <h3 className="text-white font-bold text-lg leading-tight">{category.name}</h3>
        {category.description && (
          <p className="text-white/75 text-xs mt-0.5 line-clamp-1">{category.description}</p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 text-yellow-300 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Browse <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

function TestimonialsCarousel() {
  const [page, setPage] = useState(0);
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: contentApi.getTestimonials,
  });

  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  if (testimonials.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visible.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-50">
            <StarRating rating={t.rating} />
            <p className="mt-3 text-gray-700 text-sm leading-relaxed italic">"{t.content}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-wf-blue to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm">{t.name}</p>
                {t.role && (
                  <p className="text-xs text-gray-500">
                    {t.role}
                    {t.company ? `, ${t.company}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === page ? 'bg-wf-blue' : 'bg-gray-300'
              }`}
            />
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { data: categories = [], isPending: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => contentApi.getGallery(),
  });

  const galleryTeaser = gallery.slice(0, 6);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center"
        style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #1D4ED8 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-white/80 text-sm font-medium">
              <Clock size={14} />
              3â€“7 days delivery Â· MOQ 50 units Â· GST Invoice
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Every Type of Flag.{' '}
              <span className="text-yellow-300">Bulk.</span>{' '}
              <span className="text-white/90">Fast.</span>{' '}
              <br />India-wide.
            </h1>
            <p className="text-lg text-white/85 mb-4 leading-relaxed">
              Table flags, car flags, feather flags, country flags, advertising flags â€” custom-printed
              and bulk-dispatched across India. GST-compliant billing for all B2B orders.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Single Table Flag', 'Cross Table Flag', 'Car Flag', 'Feather Flag', 'Country Flag', 'Custom'].map((t) => (
                <span key={t} className="px-3 py-1 bg-white/15 rounded-full text-sm text-white/90 font-medium">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/quote"
                className="px-7 py-3.5 bg-white text-wf-blue font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
              >
                Get an Instant Quote
              </Link>
              <a
                href="https://wa.me/919972879599?text=Hi%20WINFLAG!%20I%20need%20flags%20for%20an%20event."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.524 5.85L.057 23.571a.75.75 0 0 0 .94.94l5.747-1.484A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.93 0-3.733-.527-5.271-1.443l-.377-.224-3.91 1.01 1.032-3.791-.245-.39A9.793 9.793 0 0 1 2.182 12c0-5.418 4.4-9.818 9.818-9.818 5.419 0 9.818 4.4 9.818 9.818 0 5.418-4.399 9.818-9.818 9.818z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <div className="text-wf-blue">{item.icon}</div>
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Category Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">
              Shop by Flag Type
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From table flags to outdoor advertising flags â€” every type, every size, in bulk.
            </p>
          </div>

          {catLoading ? (
            <PageSpinner />
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {categories.slice(0, 9).map((cat, i) => (
                <ApiCategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {STATIC_CATEGORIES.map((cat) => (
                <StaticCategoryCard key={cat.slug} cat={cat} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-wf-blue text-wf-blue font-semibold rounded-xl hover:bg-wf-blue hover:text-white transition-colors"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Table Flag Stand Types */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0">
              <p className="text-sm font-bold text-charcoal uppercase tracking-wider">Table Flag Stand Types</p>
              <p className="text-xs text-gray-400 mt-0.5">Choose your preferred stand material</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TABLE_FLAG_STANDS.map((stand) => (
                <Link
                  key={stand}
                  to={`/products?category=single-table-flag&stand=${encodeURIComponent(stand)}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-wf-blue hover:text-white text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  {stand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse All Flag Types */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0">
              <p className="text-sm font-bold text-charcoal uppercase tracking-wider">More Flag Types</p>
              <p className="text-xs text-gray-400 mt-0.5">Our complete range</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_FLAG_TYPES.map((t) => (
                <Link
                  key={t.slug}
                  to={`/products?category=${t.slug}`}
                  className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-wf-blue hover:text-white hover:border-wf-blue text-gray-600 text-xs font-medium rounded-lg transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">How It Works</h2>
            <p className="text-gray-500">Order your flags in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-wf-blue mb-4">
                  {step.icon}
                </div>
                <div className="absolute top-5 left-[calc(50%+32px)] right-0 h-px bg-gradient-to-r from-gray-200 to-transparent hidden lg:block" />
                <span className="inline-block w-6 h-6 rounded-full bg-wf-blue text-white text-xs font-bold mb-2 leading-6">
                  {step.step}
                </span>
                <h3 className="font-bold text-charcoal mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Trusted by political parties, corporates & event organisers across India
            </p>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Gallery Teaser */}
      {galleryTeaser.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">Our Work</h2>
              <p className="text-gray-500">Flags we've made for events across India</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryTeaser.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.occasion && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium">{item.occasion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white font-semibold rounded-xl hover:bg-charcoal-light transition-colors"
              >
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 bg-wf-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Order? Let's Talk.
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Get a custom quote in under 2 hours. No commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/quote"
              className="px-8 py-4 bg-white text-wf-blue font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-md text-base"
            >
              Get Quote
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

