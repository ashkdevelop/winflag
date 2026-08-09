import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2, Copy, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { mediaApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import type { MediaAsset } from '../../types';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function AssetCard({ asset, onDelete }: { asset: MediaAsset; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm group">
      <div
        className="aspect-square bg-gray-50 relative cursor-pointer overflow-hidden"
        onClick={copyUrl}
        title="Click to copy URL"
      >
        {asset.mimeType.startsWith('image/') ? (
          <img
            src={asset.url}
            alt={asset.originalName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          {copied ? (
            <CheckCircle size={24} className="text-wf-green opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <Copy size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-charcoal truncate" title={asset.originalName}>
          {asset.originalName}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">{formatBytes(asset.size)}</p>
          <button
            onClick={onDelete}
            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(asset.createdAt).toLocaleDateString('en-IN')}
        </p>
      </div>
    </div>
  );
}

export default function AdminMedia() {
  const qc = useQueryClient();

  const { data: media = [], isPending } = useQuery({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => mediaApi.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        uploadMutation.mutate(file);
      }
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'] },
    multiple: true,
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this media asset? It cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Media Library</h1>
        <p className="text-sm text-gray-500">{media.length} assets</p>
      </div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 ${
          isDragActive
            ? 'border-wf-blue bg-blue-50'
            : 'border-gray-200 hover:border-wf-blue hover:bg-blue-50/30'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={36} className="mx-auto mb-3 text-gray-400" />
        {uploadMutation.isPending ? (
          <p className="text-wf-blue font-semibold">Uploading…</p>
        ) : isDragActive ? (
          <p className="text-wf-blue font-semibold">Drop images here…</p>
        ) : (
          <>
            <p className="text-gray-600 font-semibold">Drag & drop images here, or click to browse</p>
            <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF, WebP, SVG · multiple files supported</p>
          </>
        )}
      </div>

      {isPending ? (
        <PageSpinner />
      ) : media.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <ImageIcon size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">No media uploaded yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload images using the zone above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((asset: MediaAsset) => (
            <AssetCard key={asset.id} asset={asset} onDelete={() => handleDelete(asset.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
