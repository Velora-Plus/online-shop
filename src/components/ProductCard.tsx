import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Zap, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isLiked: boolean;
  onToggleLike: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
}

export default function ProductCard({ 
  product, 
  isLiked, 
  onToggleLike, 
  onQuickView, 
  onQuickAdd 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addingState, setAddingState] = useState(false);

  const displayImage = isHovered && product.hoverImage ? product.hoverImage : product.image;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingState(true);
    // Add default first size
    const defaultSize = product.sizes[0] || 'M';
    onQuickAdd(product, defaultSize);
    setTimeout(() => setAddingState(false), 850);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'New': return 'bg-indigo-600 text-white';
      case 'Sale': return 'bg-red-500 text-white';
      case 'Bestseller': return 'bg-indigo-700 text-white';
      case 'Limited': return 'bg-indigo-900 text-white';
      default: return 'bg-slate-800 text-white';
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 transition duration-300 hover:shadow-xl hover:border-slate-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-50">
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs ${getTagColor(product.tag)}`}>
              {product.tag}
            </span>
          )}
          {product.localStock <= 3 && (
            <span className="flex items-center gap-1 bg-slate-900/90 text-white px-2.5 py-1 text-[10px] font-semibold rounded-full backdrop-blur-xs">
              <Flame className="h-3 w-3 text-indigo-400 fill-indigo-400" />
              <span>Only {product.localStock} left local</span>
            </span>
          )}
        </div>

        {/* Wishlist toggle action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(product.id);
          }}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-xs transition hover:scale-110 hover:bg-white text-slate-800"
          aria-label="Add to wishlist"
        >
          <Heart 
            className={`h-4.5 w-4.5 transition ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'}`} 
          />
        </button>

        {/* Hover quick action overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2 px-3">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center justify-center gap-1.5 bg-white/95 text-xs font-semibold uppercase tracking-wider hover:bg-slate-900 hover:text-white text-slate-900 px-3.5 py-2 rounded-lg shadow-sm transition transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Details</span>
          </button>
          
          <button
            onClick={handleQuickAddClick}
            disabled={addingState}
            className="flex items-center justify-center gap-1.5 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 px-3.5 py-2 rounded-lg shadow-sm transition transform translate-y-2 group-hover:translate-y-0 duration-300 disabled:bg-indigo-650"
          >
            {addingState ? (
              <span>Added!</span>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>+ Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-slate-400 text-xs tracking-wider uppercase font-medium mb-1">
          <span>{product.category}</span>
          <span className="flex items-center gap-1 text-indigo-600 font-semibold leading-none">
            <Zap className="h-3 w-3 fill-indigo-600 stroke-none animate-pulse" />
            {product.deliveryTime}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition tracking-tight">
          <button onClick={() => onQuickView(product)} className="text-left font-bold cursor-pointer">
            {product.name}
          </button>
        </h3>

        {/* Stars */}
        <div className="mt-1 flex items-center gap-1">
          <div className="flex text-amber-400">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount})</span>
        </div>

        {/* Pricing tag */}
        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-slate-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-sm uppercase tracking-wide font-medium">
            Local Warehouse
          </span>
        </div>
      </div>
    </div>
  );
}
