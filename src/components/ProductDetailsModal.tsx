import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Truck, BadgeAlert, Star, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ColorOption } from '../types';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption, qty: number) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  isLiked,
  onToggleLike,
  onAddToCart
}: ProductDetailsModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Synchronize dynamic product states on modal triggers
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || null);
      setQuantity(1);
      setActiveTab('description');
      setAddedSuccess(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCartClick = () => {
    if (!selectedColor) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs" 
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl h-[90vh] md:h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-white/80 p-2 text-neutral-800 hover:bg-white shadow-md transition"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Aspect: Product Media */}
        <div className="relative w-full md:w-1/2 bg-slate-100 h-1/2 md:h-full">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <span className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm">
              {product.tag}
            </span>
          )}
        </div>

        {/* Right Aspect: Detailed configuration panel */}
        <div className="w-full md:w-1/2 flex flex-col h-1/2 md:h-full bg-white">
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                {product.category}
              </span>
              <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
                <Truck className="h-3.5 w-3.5 shrink-0" />
                <span>{product.deliveryTime}</span>
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-slate-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded-sm">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Star ratings */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex text-amber-400">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Urgency Counter indicator */}
            {product.localStock <= 4 && (
              <div className="mt-4 flex items-center gap-2 bg-indigo-50/50 text-indigo-950 p-3.5 rounded-xl border border-indigo-100 text-xs">
                <BadgeAlert className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Limited Stock:</strong> Sourced locally from downtown partners. Only {product.localStock} left in your area!
                </span>
              </div>
            )}

            {/* Tabs for Info / Reviews */}
            <div className="mt-6 border-b border-slate-100 flex gap-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
                  activeTab === 'description' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
                  activeTab === 'reviews' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                Local Reviews ({product.reviews?.length || 0})
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            </div>

            {/* Tab content space */}
            <div className="py-4 text-sm text-slate-600 min-h-[100px]">
              {activeTab === 'description' ? (
                <p className="leading-relaxed">{product.description}</p>
              ) : (
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-slate-50 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-xs">{rev.author}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 text-xs my-0.5">
                          {'★'.repeat(rev.rating)}
                          {'☆'.repeat(5 - rev.rating)}
                        </div>
                        <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Be the first to review this local piece.</p>
                  )}
                </div>
              )}
            </div>

            {/* Option Selectors */}
            <div className="mt-4 space-y-4 pt-4 border-t border-slate-150">
              {/* Size selectors */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[40px] px-3.5 py-1.5 text-xs font-bold rounded-full border text-center transition cursor-pointer ${
                        selectedSize === sz
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:border-indigo-600 hover:bg-indigo-50/20'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selectors */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Color:{' '}
                  <span className="text-slate-950 font-extrabold">
                    {selectedColor?.name}
                  </span>
                </span>
                <div className="flex gap-3">
                  {product.colors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col)}
                      className={`relative h-7 w-7 rounded-full border border-slate-200 transition hover:scale-115 cursor-pointer flex items-center justify-center`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColor?.name === col.name && (
                        <Check 
                          className={`h-4 w-4 ${
                            col.hex === '#EAE6DF' || col.hex === '#F9F6F0' ? 'text-black' : 'text-white'
                          }`} 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity config */}
              <div className="flex items-center gap-4 pt-1">
                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quantity
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-full overflow-hidden w-28">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 font-bold text-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-slate-800 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.localStock, q + 1))}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 font-bold text-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="pt-5 text-slate-400 text-xs">
                  Available locally: {product.localStock}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action and Wishlist toggling */}
          <div className="border-t border-slate-100 bg-slate-50 p-6 flex gap-4">
            <button
              onClick={() => onToggleLike(product.id)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition text-slate-755"
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-500 hover:text-red-500'}`} />
            </button>

            <button
              onClick={handleAddToCartClick}
              disabled={addedSuccess}
              className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-sm uppercase tracking-wider shadow-sm transition cursor-pointer ${
                addedSuccess 
                  ? 'bg-indigo-650 text-white' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Added successfully to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Courier delivery Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
