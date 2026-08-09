import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Tag } from 'lucide-react';
import { contentApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import type { BlogPost } from '../types';

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      {post.coverImageUrl ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <span className="text-5xl">📝</span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="blue" size="sm">
              <Tag size={10} className="mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-bold text-charcoal text-lg leading-snug mb-2 group-hover:text-wf-blue transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <Calendar size={13} className="text-gray-400" />
          <span className="text-xs text-gray-400">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Draft'}
          </span>
          {post.authorName && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{post.authorName}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'b1', slug: 'how-to-choose-table-flag',
    title: 'How to Choose the Right Table Flag for Your Office or Event',
    excerpt: 'Single pole or cross base? Acrylic, brass, or stainless steel? This guide walks you through all stand types and flag sizes to help you pick the perfect table flag for any setting.',
    coverImageUrl: '/images/1.jpg',
    tags: ['Table Flags', 'Office Décor', 'Buying Guide'],
    authorName: 'WINFLAG Team',
    isPublished: true,
    publishedAt: '2025-06-15T10:00:00Z',
    content: '', createdAt: '', updatedAt: '',
  },
  {
    id: 'b2', slug: 'guide-to-advertising-flags',
    title: 'A Complete Guide to Advertising Flags for Events & Retail',
    excerpt: 'Feather flags, teardrop flags, sharkfin flags — which outdoor advertising flag is right for your event? Learn about sizes, base options, and material choices.',
    coverImageUrl: '/images/4.png',
    tags: ['Advertising Flags', 'Events', 'Outdoor'],
    authorName: 'WINFLAG Team',
    isPublished: true,
    publishedAt: '2025-07-01T10:00:00Z',
    content: '', createdAt: '', updatedAt: '',
  },
  {
    id: 'b3', slug: 'ipl-cricket-flags-guide',
    title: 'IPL Season 2025: Order Your Cricket Fan Flags Early',
    excerpt: 'Cheer your team louder this IPL season with custom cricket flags. We stock all 10 IPL franchise flags in 3×5ft. Quick dispatch, bulk discounts for group orders.',
    coverImageUrl: '/images/13.png',
    tags: ['Sports Flags', 'Cricket', 'IPL'],
    authorName: 'WINFLAG Team',
    isPublished: true,
    publishedAt: '2025-07-20T10:00:00Z',
    content: '', createdAt: '', updatedAt: '',
  },
  {
    id: 'b4', slug: 'country-flags-specifications',
    title: 'Country Flags: Understanding Sizes, Materials & Standards',
    excerpt: 'From the Indian Tricolour to flags of all 195 countries — how we ensure colour accuracy, correct proportions, and BIS-compliant fabric for every national flag order.',
    coverImageUrl: '/images/3.jpg',
    tags: ['Country Flags', 'National Flag', 'Quality'],
    authorName: 'WINFLAG Team',
    isPublished: true,
    publishedAt: '2025-08-01T10:00:00Z',
    content: '', createdAt: '', updatedAt: '',
  },
  {
    id: 'b5', slug: 'car-flags-for-events',
    title: 'Car Flags for Rallies, Elections & National Days — A Buyer\'s Guide',
    excerpt: 'Inside-the-car or outside mounting? What size works best? How many per vehicle? Everything you need to know about ordering car flags for large-scale events and political campaigns.',
    coverImageUrl: '/images/6.jpg',
    tags: ['Car Flags', 'Political', 'Events'],
    authorName: 'WINFLAG Team',
    isPublished: true,
    publishedAt: '2025-08-05T10:00:00Z',
    content: '', createdAt: '', updatedAt: '',
  },
  {
    id: 'b6', slug: 'armed-forces-flags-guide',
    title: 'Armed Forces Flags: Table, Car & Outdoor Options for Army, Navy & Air Force',
    excerpt: 'Official flag variants for Army, Navy, Air Force, Coast Guard, and NCC. Available as table flags, car dashboard flags, and large outdoor flags — with premium stand options.',
    coverImageUrl: '/images/9.jpg',
    tags: ['Armed Forces', 'Military', 'Specialty Flags'],
    authorName: 'WINFLAG Team',
    isPublished: true,
    publishedAt: '2025-08-08T10:00:00Z',
    content: '', createdAt: '', updatedAt: '',
  },
];

export default function Blog() {
  const { data: posts = [], isPending } = useQuery({
    queryKey: ['blog'],
    queryFn: contentApi.getBlog,
  });

  const published = posts.filter((p) => p.isPublished);
  const displayPosts = published.length > 0 ? published : DEFAULT_POSTS;

  if (isPending) return <PageSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">Blog & Resources</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Tips, guides, and news from the WINFLAG team
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
