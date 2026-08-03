import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, User as UserIcon, ShieldCheck, Truck, Clock, CreditCard, Send } from 'lucide-react';
import { CartItem, Order, User, DeliveryStep } from '../types';
import { DELIVERY_OPTIONS } from '../data/products';

interface CheckoutSectionProps {
  cartItems: CartItem[];
  appliedPromo: string;
  discountPercent: number;
  currentUser: User | null;
  onPlaceOrder: (order: Order) => void;
  onBackToShop: () => void;
  onTriggerLogin: () => void;
}

export default function CheckoutSection({
  cartItems,
  appliedPromo,
  discountPercent,
  currentUser,
  onPlaceOrder,
  onBackToShop,
  onTriggerLogin
}: CheckoutSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [zipCode, setZipCode] = useState('');
  const [deliveryOptionId, setDeliveryOptionId] = useState('del_same');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPlacing, setIsPlacing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Auto populate shipping form from current user account details
  useEffect(() => {
    if (currentUser && currentUser.isLoggedIn) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setStreet(currentUser.address || '');
      setCity(currentUser.city || 'San Francisco');
      setZipCode(currentUser.zipCode || '');
    }
  }, [currentUser]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const selectedOption = DELIVERY_OPTIONS.find(o => o.id === deliveryOptionId) || DELIVERY_OPTIONS[1];
  
  // Custom Promo Calculations
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  
  // Calculate delivery costs
  const shippingCost = deliveryOptionId === 'del_same' && subtotal > 120 ? 0 : selectedOption.price;
  const tax = Math.round((subtotal - discountAmount) * 0.0825);
  const total = subtotal - discountAmount + shippingCost + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !phone || !street || !zipCode) {
      setValidationError('Please capture all delivery detail fields to dispatch local couriers.');
      return;
    }

    setIsPlacing(true);

    // Dynamic Tracking construction
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const standardSteps: DeliveryStep[] = [
      { id: 1, title: 'Order Dispatched', description: 'Your clothing order was transmitted & received by primary LocalStyle hub.', status: 'current', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 2, title: 'Personal Stylist Picking', description: 'Boutique stylists are carefully picking and packing your sizing choices.', status: 'pending' },
      { id: 3, title: 'Courier Delivery Transit', description: 'Active bike courier loading garments on thermal carrier.', status: 'pending' },
      { id: 4, title: 'Safe Delivery Complete', description: 'Verified handoff at your doorstep or drop box.', status: 'pending' }
    ];

    const couriers = ['Rafa J. (Cyclist)', 'Sienna K. (E-Scooter)', 'Arthur M. (Cargo Bike)', 'Jaxon T. (Courier)'];
    const selectedCourier = couriers[Math.floor(Math.random() * couriers.length)];

    const newOrder: Order = {
      id: orderId,
      date: dateStr,
      items: cartItems,
      subtotal,
      shippingCost,
      tax,
      discount: discountAmount,
      total,
      deliveryOption: {
        id: selectedOption.id,
        name: selectedOption.name,
        price: shippingCost,
        time: selectedOption.time
      },
      shippingAddress: {
        name,
        street,
        city,
        zipCode,
        phone
      },
      status: 'placed',
      paymentMethod,
      steps: standardSteps,
      courierName: selectedCourier,
      courierPhone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      etaMinutes: deliveryOptionId === 'del_express' ? 45 : (deliveryOptionId === 'del_same' ? 180 : 360)
    };

    setTimeout(() => {
      onPlaceOrder(newOrder);
      setIsPlacing(false);
    }, 1500);
  };

  return (
    <div id="checkout-section-root" className="max-w-6xl mx-auto px-4 py-8 md:py-12 font-sans">
      <button
        onClick={onBackToShop}
        className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-505 text-slate-500 hover:text-indigo-600 mb-8 transition"
      >
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        <span>Back to boutique catalogue</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Aspect: Shipping Details */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Local Shipping Details</h2>
          <p className="text-xs text-slate-400 mb-6">Enter address and contact details for bike courier routing.</p>

          {!currentUser?.isLoggedIn && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
              <span className="text-xs text-indigo-950 font-bold">
                Have a LocalStyle profile? Sign in to autofill addresses.
              </span>
              <button
                type="button"
                onClick={onTriggerLogin}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider py-1.5 px-4 rounded-full transition"
              >
                Sign In
              </button>
            </div>
          )}

          {validationError && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-650 border border-red-100">
              {validationError}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recipient Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm rounded-full border border-slate-200 py-3 pr-4 pl-10 focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (for Courier SMS updates)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm rounded-full border border-slate-200 py-3 pr-4 pl-10 focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Street Name, Apartment, Unit Numbers"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-sm rounded-full border border-slate-200 py-3 pr-4 pl-10 focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm rounded-full border border-slate-200 py-3 px-4 bg-white focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                >
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Brooklyn">Brooklyn</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Seattle">Seattle</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ZIP Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="94110"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full text-sm rounded-full border border-slate-200 py-3 px-4 focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                />
              </div>
            </div>

            {/* Delivery speed pricing selectors */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Select Local Delivery Speed
              </h3>
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((opt) => {
                  const calculatedPrice = opt.id === 'del_same' && subtotal > 120 ? 0 : opt.price;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${
                        deliveryOptionId === opt.id
                          ? 'border-indigo-600 bg-indigo-50/20'
                          : 'border-slate-150 hover:border-indigo-600/30 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery_speed"
                          checked={deliveryOptionId === opt.id}
                          onChange={() => setDeliveryOptionId(opt.id)}
                          className="h-4 w-4 border-slate-300 text-indigo-650 focus:ring-0"
                        />
                        <div>
                          <span className="block text-sm font-bold text-slate-900">{opt.name}</span>
                          <span className="block text-xs text-slate-400 mt-0.5">{opt.time}</span>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900">
                        {calculatedPrice === 0 ? 'FREE' : `$${calculatedPrice}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Method mockup */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-full border font-bold text-xs uppercase cursor-pointer transition ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 bg-white hover:border-indigo-600 hover:bg-indigo-50/20'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-full border font-bold text-xs uppercase cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 bg-white hover:border-indigo-600 hover:bg-indigo-50/20'
                  }`}
                >
                  <Truck className="h-4 w-4" />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-150">
                  <div>
                    <input
                      type="text"
                      disabled
                      value="4111 2222 3333 4444"
                      className="w-full text-xs font-mono bg-slate-100/80 rounded-full border border-slate-200 py-2.5 px-4 text-slate-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="w-full text-xs font-mono bg-slate-100/80 rounded-full border border-slate-200 py-2.5 px-4 text-slate-500 text-center"
                    />
                    <input
                      type="text"
                      disabled
                      value="903"
                      className="w-full text-xs font-mono bg-slate-100/80 rounded-full border border-slate-200 py-2.5 px-4 text-slate-500 text-center"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400 text-center">
                    Demo Mode: Standard test credit credentials active.
                  </span>
                </div>
              )}
            </div>

            {/* Place Order Dispatch Button */}
            <button
              type="submit"
              disabled={isPlacing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{isPlacing ? 'Dispatching active riders...' : 'Transmit order to delivery hub'}</span>
            </button>
          </form>
        </div>

        {/* Right Aspect: Side Cart Summary */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-150 p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Order Summary</h2>
          
          {/* Item scroll list */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="h-12 w-10 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</span>
                    <span className="text-xs font-extrabold text-slate-905">${item.product.price * item.quantity}</span>
                  </div>
                  <div className="flex text-[10px] text-slate-405">
                    <span className="text-slate-500 font-medium">Size: {item.selectedSize} | Color: {item.selectedColor.name}</span>
                    <span className="ml-auto font-bold text-slate-800">Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations list */}
          <div className="space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-indigo-650 font-bold">
                <span>Coupon Sale Applied!</span>
                <span>-${discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Plan: {selectedOption.name}</span>
              <span className="font-bold text-slate-800">
                {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Tax (8.25%)</span>
              <span className="font-semibold text-slate-800">${tax}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
              <span>Final Charge</span>
              <span>${total}</span>
            </div>
          </div>

          <div className="bg-indigo-50/70 text-indigo-950 p-4 rounded-2xl flex items-start gap-2 border border-indigo-100">
            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>LocalStyle Guarantees:</strong> 100% contactless rapid handoff. Real-time bike tracking with SMS alerts immediately after routing completes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
