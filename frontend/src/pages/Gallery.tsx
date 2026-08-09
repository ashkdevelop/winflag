import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, ZoomIn } from 'lucide-react';
import { contentApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import type { GalleryItem } from '../types';

const OCCASIONS = ['All', 'Political', 'Sports', 'National', 'Corporate', 'Cultural'];

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: 'g1', imageUrl: '/images/5.jpg', title: 'IPL 2024 Fan Zone Flags', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g2', imageUrl: '/images/11.jpg', title: 'FIFA World Cup Flags', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g3', imageUrl: '/images/6.jpg', title: 'G20 Summit – National Flags', occasion: 'National', createdAt: '', isActive: true },
  { id: 'g4', imageUrl: '/images/13.png', title: 'CSK Cricket Fan Flags', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g5', imageUrl: '/images/14.png', title: 'IPL Team Flags – MI', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g6', imageUrl: '/images/15.png', title: 'RCB Sports Flags', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g7', imageUrl: '/images/9.jpg', title: 'Political Rally Flags', occasion: 'Political', createdAt: '', isActive: true },
  { id: 'g8', imageUrl: '/images/10.jpg', title: 'Corporate Event Branding', occasion: 'Corporate', createdAt: '', isActive: true },
  { id: 'g9', imageUrl: '/images/8.jpg', title: 'Cultural Festival Flags', occasion: 'Cultural', createdAt: '', isActive: true },
  { id: 'g10', imageUrl: '/images/16.png', title: 'KKR IPL Flags', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g11', imageUrl: '/images/17.png', title: 'PBKS Fan Flags', occasion: 'Sports', createdAt: '', isActive: true },
  { id: 'g12', imageUrl: '/images/3.jpg', title: 'Indian National Flag', occasion: 'National', createdAt: '', isActive: true },
];

function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div
        className="relative z-10 max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={28} />
        </button>
        <img
          src={item.imageUrl}
          alt={item.title || 'Gallery image'}
          className="w-full max-h-[80vh] object-contain rounded-xl"
        />
        {(item.title || item.occasion) && (
          <div className="mt-3 text-center">
            {item.title && <h3 className="text-white font-bold text-lg">{item.title}</h3>}
            {item.occasion && <p className="text-gray-400 text-sm mt-1">{item.occasion}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const activeOccasion = searchParams.get('occasion') || 'All';

  const { data: gallery = [], isPending } = useQuery({
    queryKey: ['gallery', activeOccasion === 'All' ? undefined : activeOccasion],
    queryFn: () => contentApi.getGallery(activeOccasion === 'All' ? undefined : activeOccasion),
  });

  const setOccasion = (occ: string) => {
    const next = new URLSearchParams(searchParams);
    if (occ === 'All') {
      next.delete('occasion');
    } else {
      next.set('occasion', occ);
    }
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-2">Our Work</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Flags and banners we've produced for events across India
        </p>
      </div>

      {/* Occasion tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {OCCASIONS.map((occ) => (
          <button
            key={occ}
            onClick={() => setOccasion(occ)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeOccasion === occ
                ? 'bg-wf-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {occ}
          </button>
        ))}
      </div>

      {isPending ? (
        <PageSpinner />
      ) : (() => {
        const displayGallery = gallery.length > 0
          ? gallery
          : DEFAULT_GALLERY.filter((g) =>
              activeOccasion === 'All' || g.occasion === activeOccasion
            );
        return displayGallery.length > 0 ? (
        /* Masonry grid via CSS columns */
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {displayGallery.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setLightboxItem(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title || item.occasion || 'Gallery image'}
                className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors flex items-center justify-center">
                <ZoomIn
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              {item.occasion && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
                  <p className="text-white text-xs font-semibold">{item.occasion}</p>
                  {item.title && <p className="text-white/80 text-xs">{item.title}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="text-xl font-bold text-charcoal mb-2">No items for this occasion yet</h3>
          <p className="text-gray-500">Try selecting "All" to see everything.</p>
        </div>
      );
      })()}

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
