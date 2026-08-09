import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { productsApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import type { Product } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required'),
  description: z.string().min(5, 'Description required'),
  basePrice: z.coerce.number().positive('Price must be positive'),
  moq: z.coerce.number().int().positive('MOQ required'),
  categoryId: z.string().min(1, 'Category required'),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function ProductForm({
  product,
  categoryOptions,
  onSubmit,
  loading,
}: {
  product?: Product;
  categoryOptions: { id: string; name: string }[];
  onSubmit: (data: FormData) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          basePrice: product.basePrice,
          moq: product.moq,
          categoryId: product.categoryId,
          isActive: product.isActive,
          imageUrl: product.imageUrl || '',
        }
      : { isActive: true, moq: 50 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
          <input
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
            placeholder="e.g. Polyester Hand Flag"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Slug</label>
          <input
            {...register('slug')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
            placeholder="polyester-hand-flag"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue resize-none"
          placeholder="Product description…"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Base Price (₹)</label>
          <input
            {...register('basePrice')}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
          />
          {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">MOQ</label>
          <input
            {...register('moq')}
            type="number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
          />
          {errors.moq && <p className="text-red-500 text-xs mt-1">{errors.moq.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
          <select
            {...register('categoryId')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
          >
            <option value="">Select…</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
        <input
          {...register('imageUrl')}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
          placeholder="https://…"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register('isActive')} type="checkbox" className="w-4 h-4 accent-wf-blue" />
        <span className="text-sm font-medium text-charcoal">Active (visible on site)</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-sm"
      >
        {loading ? 'Saving…' : product ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const { data: products = [], isPending } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => productsApi.create(data as Partial<Product>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => productsApi.update(editProduct!.id, data as Partial<Product>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      setModalOpen(false);
      setEditProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const openAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: FormData) => {
    if (editProduct) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isPending) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-wf-blue hover:bg-wf-blue-dark text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Product</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Price</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">MOQ</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={32} className="mx-auto mb-2 text-gray-300" />
                    No products yet. Add your first product.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-charcoal">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.slug}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="gray">{p.category?.name ?? p.categoryId}</Badge>
                    </td>
                    <td className="px-5 py-3 font-semibold text-charcoal">₹{p.basePrice}</td>
                    <td className="px-5 py-3 text-gray-600">{p.moq}</td>
                    <td className="px-5 py-3">
                      <Badge variant={p.isActive ? 'green' : 'gray'}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        title={editProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editProduct ?? undefined}
          categoryOptions={categories}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
