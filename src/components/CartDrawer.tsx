import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: (discountCode: string, discountPct: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Calculate delivery costs
  const shippingCost = subtotal > 120 || subtotal === 0 ? 0 : 4.99;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const tax = Math.round((subtotal - discountAmount) * 0.0825);
  const total = subtotal - discountAmount + shippingCost + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'LOCALSTYLE15') {
      setDiscountPercent(15);
      setAppliedPromo('LOCALSTYLE15');
      setPromoCode('');
    } else if (code === 'FREESHIP') {
      setDiscountPercent(5); // symbolic discount plus free shipping
      setAppliedPromo('FREESHIP');
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon. Try "LOCALSTYLE15" for 15% off.');
    }
  };

  const handleCheckoutClick = () => {
    onCheckout(appliedPromo, discountPercent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-55 bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Delivery Bag</h2>
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-750 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items listing */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-8 w-full block">Your bag is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Select premium boutique pieces and get them dispatched via rapid courier in minutes.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-sm cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition bg-slate-50/40"
                >
                  <div className="h-20 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-sm font-extrabold text-slate-900 shrink-0">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>

                      {/* Configurations */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400 font-medium">
                        <span>Size: <strong className="text-slate-700 font-bold">{item.selectedSize}</strong></span>
                        <span className="flex items-center gap-1">
                          Color: 
                          <span 
                            className="inline-block h-2.5 w-2.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <strong className="text-slate-700 font-bold">{item.selectedColor.name}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200 font-semibold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200 font-semibold"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition p-1 rounded-sm"
                        title="Remove piece"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Calculations */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Promo: LOCALSTYLE15"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full text-xs rounded-full border border-slate-200 bg-white py-2 pr-4 pl-9 uppercase tracking-widest font-semibold focus:border-indigo-500 focus:ring-0 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 rounded-full tracking-wider cursor-pointer transition"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-red-650 font-bold mt-1 pl-2">{promoError}</p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between bg-indigo-50 text-indigo-950 text-xs py-2 px-3 rounded-xl border border-indigo-100">
                  <span className="flex items-center gap-1 font-semibold">
                    <Check className="h-3.5 w-3.5 text-indigo-600" />
                    Promo {appliedPromo} Applied!
                  </span>
                  <button 
                    onClick={() => { setAppliedPromo(''); setDiscountPercent(0); }}
                    className="text-indigo-900 hover:text-red-500 font-bold ml-2 underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Fee calculations detail */}
              <div className="space-y-2 text-sm text-slate-600 border-t border-dashed border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${subtotal}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-indigo-650 font-bold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Courier Dispatch
                    <span className="group relative cursor-help">
                      <Info className="h-3.5 w-3.5 text-slate-400" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white border text-[10px] p-2 rounded-md w-48 shadow-lg font-normal">
                        Bike courier is free for clothing orders over $120.
                      </span>
                    </span>
                  </span>
                  <span className="font-bold text-slate-800">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Local Sales Tax (8.25%)</span>
                  <span className="font-semibold text-slate-800">${tax}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-100 pt-2.5">
                  <span>Estimated Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Submit Checkout button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group shadow-md transition cursor-pointer"
              >
                <span>Proceed to Delivery Hub</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Dispatches from local warehouses for instantaneous deliveries.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
