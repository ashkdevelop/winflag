import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Save, Image as ImageIcon, Library } from 'lucide-react';
import { contentApi, mediaApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import type { PageSection, MediaAsset } from '../../types';

const PAGE_OPTIONS = [
  { key: 'home', label: 'Home Page' },
  { key: 'about', label: 'About Us' },
  { key: 'contact', label: 'Contact Page' },
  { key: 'products', label: 'Products Page' },
  { key: 'gallery', label: 'Gallery Page' },
  { key: 'faq', label: 'FAQ Page' },
];

function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data: media = [], isPending } = useQuery({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
    enabled: isOpen,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => mediaApi.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Media Library" size="full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{media.length} assets</p>
        <div className="flex items-center gap-2">
          {uploadMutation.isPending && <span className="text-xs text-gray-400">Uploading…</span>}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-wf-blue hover:bg-wf-blue-dark text-white font-semibold rounded-lg text-sm transition-colors"
          >
            <ImageIcon size={14} />
            Upload Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {isPending ? (
        <PageSpinner />
      ) : media.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon size={40} className="mx-auto mb-2 text-gray-300" />
          <p>No media uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
          {media.map((asset: MediaAsset) => (
            <button
              key={asset.id}
              onClick={() => { onSelect(asset.url); onClose(); }}
              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-wf-blue transition-colors bg-gray-100"
              title={asset.originalName}
            >
              <img
                src={asset.url}
                alt={asset.originalName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <p className="text-white text-xs font-medium truncate px-1 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {asset.originalName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

function SectionCard({
  pageKey,
  section,
}: {
  pageKey: string;
  section: PageSection;
}) {
  const qc = useQueryClient();
  const [mediaOpen, setMediaOpen] = useState(false);
  const focusedImageField = useRef<string | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: section.title || '',
      subtitle: section.subtitle || '',
      body: section.body || '',
      imageUrl: section.imageUrl || '',
      ctaText: section.ctaText || '',
      ctaLink: section.ctaLink || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: typeof section) => contentApi.updatePageSection(pageKey, section.section, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['page', pageKey] }),
  });

  const currentImageUrl = watch('imageUrl');

  const handleSelectMedia = (url: string) => {
    setValue('imageUrl', url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 bg-orange-100 text-wf-blue text-xs font-bold rounded-lg uppercase tracking-wide">
          {section.section}
        </span>
        {mutation.isSuccess && (
          <span className="text-xs text-wf-green font-medium">Saved!</span>
        )}
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d as typeof section))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
              placeholder="Section title"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Subtitle</label>
            <input
              {...register('subtitle')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
              placeholder="Section subtitle"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Body</label>
          <textarea
            {...register('body')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue resize-none"
            placeholder="Main body text…"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Image</label>
          <div className="flex gap-2">
            <input
              {...register('imageUrl')}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
              placeholder="https://…"
              onFocus={() => { focusedImageField.current = 'imageUrl'; }}
            />
            <button
              type="button"
              onClick={() => { focusedImageField.current = 'imageUrl'; setMediaOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Library size={13} />
              Library
            </button>
          </div>
          {currentImageUrl && (
            <div className="mt-2">
              <img
                src={currentImageUrl}
                alt="Preview"
                className="h-24 w-auto rounded-lg object-cover border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">CTA Text</label>
            <input
              {...register('ctaText')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
              placeholder="e.g. Get Quote"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">CTA Link</label>
            <input
              {...register('ctaLink')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
              placeholder="/quote"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMediaOpen(true)}
            className="flex items-center gap-2 text-sm text-wf-blue font-semibold hover:underline"
          >
            <Library size={14} />
            Open Media Library
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-wf-blue hover:bg-wf-blue-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            <Save size={14} />
            {mutation.isPending ? 'Saving…' : 'Save Section'}
          </button>
        </div>
      </form>

      <MediaLibraryModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={handleSelectMedia}
      />
    </div>
  );
}

export default function AdminContent() {
  const [selectedPage, setSelectedPage] = useState('home');

  const { data: sections = [], isPending } = useQuery({
    queryKey: ['page', selectedPage],
    queryFn: () => contentApi.getPage(selectedPage),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Content Editor</h1>
      </div>

      {/* Page selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <label className="block text-xs font-semibold text-gray-500 mb-2">Select Page</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
        >
          {PAGE_OPTIONS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-2">
          Edit any section on this page. Changes are saved individually per section.
        </p>
      </div>

      {isPending ? (
        <PageSpinner />
      ) : sections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">
            No sections defined for this page yet. Add sections via the API or check the page key.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard key={section.section} pageKey={selectedPage} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
