import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, BookOpen, Eye, EyeOff } from 'lucide-react';
import { contentApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { BlogPost } from '../../types';

const schema = z.object({
  title: z.string().min(3, 'Title required'),
  slug: z.string().min(3, 'Slug required'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content required'),
  coverImageUrl: z.string().optional(),
  tags: z.string().optional(),
  authorName: z.string().optional(),
  isPublished: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function BlogEditor({
  post,
  onClose,
}: {
  post?: BlogPost;
  onClose: () => void;
}) {
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          coverImageUrl: post.coverImageUrl || '',
          tags: post.tags?.join(', ') || '',
          authorName: post.authorName || '',
          isPublished: post.isPublished,
        }
      : { isPublished: false },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<BlogPost>) => contentApi.createBlogPost(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); onClose(); },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<BlogPost>) => contentApi.updateBlogPost(post!.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); onClose(); },
  });

  const onSubmit = (data: FormData) => {
    const payload: Partial<BlogPost> = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      authorName: data.authorName,
      isPublished: data.isPublished,
    };
    if (post) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-charcoal">
            {post ? 'Edit Post' : 'New Blog Post'}
          </h1>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Title</label>
              <input
                {...register('title')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="Post title…"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Slug</label>
                <input
                  {...register('slug')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="url-friendly-slug"
                />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Author</label>
                <input
                  {...register('authorName')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Cover Image URL</label>
              <input
                {...register('coverImageUrl')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="https://…"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Tags (comma-separated)</label>
              <input
                {...register('tags')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="flags, bulk order, india…"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Excerpt</label>
              <textarea
                {...register('excerpt')}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue resize-none"
                placeholder="Short summary shown in blog listing…"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Content</label>
              <textarea
                {...register('content')}
                rows={12}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue resize-y font-mono"
                placeholder="Write your blog post content here…"
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('isPublished')}
                type="checkbox"
                className="w-4 h-4 accent-wf-blue"
              />
              <div>
                <p className="text-sm font-semibold text-charcoal">Published</p>
                <p className="text-xs text-gray-400">Make this post visible on the blog</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving…' : post ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const qc = useQueryClient();
  const [showEditor, setShowEditor] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);

  const { data: posts = [], isPending } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: contentApi.getBlog,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentApi.deleteBlogPost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blog'] }),
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (showEditor || editPost) {
    return (
      <BlogEditor
        post={editPost ?? undefined}
        onClose={() => { setShowEditor(false); setEditPost(null); }}
      />
    );
  }

  if (isPending) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Blog</h1>
        <button
          onClick={() => { setEditPost(null); setShowEditor(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-wf-blue hover:bg-wf-blue-dark text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Title</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Author</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Tags</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                    No blog posts yet. Write your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-charcoal line-clamp-1">{post.title}</p>
                      <p className="text-gray-400 text-xs">{post.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{post.authorName || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((t) => (
                          <Badge key={t} variant="gray" size="sm">{t}</Badge>
                        ))}
                        {(post.tags?.length ?? 0) > 2 && (
                          <Badge variant="gray" size="sm">+{(post.tags?.length ?? 0) - 2}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-IN')
                        : new Date(post.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {post.isPublished ? (
                          <Eye size={14} className="text-wf-green" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                        <Badge variant={post.isPublished ? 'green' : 'gray'}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditPost(post); }}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
