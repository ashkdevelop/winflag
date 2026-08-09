import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, MessageCircle, Package } from 'lucide-react';
import { productsApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import type { ProductVariant } from '../types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: product, isPending, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(50);

  const variant = selectedVariant ?? product?.variants?.[0] ?? null;
  const moq = product?.moq ?? 50;

  const unitPrice = variant?.price ?? product?.basePrice ?? 0;
  const subtotal = unitPrice * quantity;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const sizes = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.size))];
  }, [product]);

  const materials = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.material))];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');

  const handleAddToQuote = () => {
    const params = new URLSearchParams();
    if (product) {
      params.set('product', product.id);
      params.set('productName', product.name);
      params.set('category', product.category?.slug ?? '');
      if (variant) {
        params.set('size', variant.size);
        params.set('material', variant.material);
      }
      params.set('quantity', String(Math.max(quantity, moq)));
    }
    navigate(`/quote?${params.toString()}`);
  };

  if (isPending) return <PageSpinner />;

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Product not found</h2>
        <Link to="/products" className="text-wf-blue font-medium hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-wf-blue transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center text-8xl shadow-inner">
            🚩
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-wf-blue cursor-pointer transition-colors">
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start gap-3 mb-3">
            <h1 className="text-3xl font-extrabold text-charcoal leading-tight flex-1">
              {product.name}
            </h1>
            {product.category && <Badge variant="blue">{product.category.name}</Badge>}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags / Materials */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="gray">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-5 mb-6">
              {/* Size selector */}
              {sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          const found = product.variants.find(
                            (v) => v.size === size && (!selectedMaterial || v.material === selectedMaterial)
                          );
                          if (found) setSelectedVariant(found);
                        }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                          selectedSize === size || (!selectedSize && size === sizes[0])
                            ? 'border-wf-blue bg-blue-50 text-wf-blue'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Material selector */}
              {materials.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Material
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((material) => (
                      <button
                        key={material}
                        onClick={() => {
                          setSelectedMaterial(material);
                          const found = product.variants.find(
                            (v) => v.material === material && (!selectedSize || v.size === selectedSize)
                          );
                          if (found) setSelectedVariant(found);
                        }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                          selectedMaterial === material || (!selectedMaterial && material === materials[0])
                            ? 'border-wf-green bg-green-50 text-wf-green'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-charcoal">Quantity</label>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Package size={12} />
                MOQ: {moq} units
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={moq}
                max={5000}
                step={50}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 h-2 rounded-full accent-wf-blue"
              />
              <input
                type="number"
                min={moq}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(moq, Number(e.target.value)))}
                className="w-24 px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-semibold text-center focus:outline-none focus:border-wf-blue"
              />
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <h3 className="font-bold text-charcoal mb-3 text-sm">Price Estimate</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>₹{unitPrice.toFixed(2)} × {quantity} units</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span className="font-medium">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-charcoal">
                <span>Estimated Total</span>
                <span className="text-wf-blue">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">* Delivery charges calculated at checkout</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToQuote}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors text-base"
            >
              <ShoppingCart size={18} />
              Add to Quote
            </button>
            <a
              href={`https://wa.me/919972879599?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20-%20${quantity}%20units`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#25D366] text-[#25D366] font-bold rounded-xl hover:bg-green-50 transition-colors text-base"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

