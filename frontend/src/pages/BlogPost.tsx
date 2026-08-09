import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { contentApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isPending, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => contentApi.getBlogBySlug(slug!),
    enabled: !!slug,
  });

  if (isPending) return <PageSpinner />;

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Post not found</h2>
        <Link to="/blog" className="text-wf-blue font-medium hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-wf-blue transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      {post.coverImageUrl && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-md">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag) => (
          <Badge key={tag} variant="blue">
            <Tag size={10} className="mr-1" />
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
        <Calendar size={14} />
        <span>
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
            <span>·</span>
            <span>By {post.authorName}</span>
          </>
        )}
      </div>

      {post.excerpt && (
        <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
      )}

      <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <div className="bg-blue-50 rounded-2xl p-6 text-center border border-orange-100">
          <h3 className="font-bold text-charcoal mb-2">Need flags for your event?</h3>
          <p className="text-gray-500 text-sm mb-4">
            Get a custom quote from WINFLAG — India's bulk flag specialist.
          </p>
          <Link
            to="/quote"
            className="inline-block px-6 py-3 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors"
          >
            Get Instant Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
