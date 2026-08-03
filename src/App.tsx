import { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Search, 
  ArrowRight, 
  Package, 
  Truck, 
  TrendingUp, 
  BadgeAlert, 
  Grid, 
  SlidersHorizontal,
  Flame,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Type declarations & Mock Data
import { Product, CartItem, Order, User, ColorOption } from './types';
import { PRODUCTS, CITIES } from './data/products';

// Subcomponents
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutSection from './components/CheckoutSection';
import OrderTracking from './components/OrderTracking';
import AuthModal from './components/AuthModal';

export default function App() {
  // --- Persistent LocalState Hooks ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('localstyle_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('localstyle_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('localstyle_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const stored = localStorage.getItem('localstyle_active_order');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // --- Dynamic UI State Hooks ---
  const [activeTab, setActiveTab] = useState<'shop' | 'wishlist' | 'tracking'>('shop');
  const [selectedCity, setSelectedCity] = useState('San Francisco');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [priceRange, setPriceRange] = useState<number>(200);

  // Modal triggers
  const [currentDetailProduct, setCurrentDetailProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);

  // Checkout discount passes
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Toast confirmation triggers
  const [toastMessage, setToastMessage] = useState('');

  // --- Synchronize storage states on updates ---
  useEffect(() => {
    localStorage.setItem('localstyle_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('localstyle_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('localstyle_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('localstyle_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('localstyle_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('localstyle_active_order');
    }
  }, [activeOrder]);

  // --- Utility functions ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Auth logins
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    triggerToast(`Logged in safely as ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Profile logged out safely.');
  };

  // Wishlist actions
  const handleToggleLike = (id: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        triggerToast('Removed piece from your wishlist.');
        return prev.filter((item) => item !== id);
      } else {
        triggerToast('Piece added to your wishlist!');
        return [...prev, id];
      }
    });
  };

  // Cart actions
  const handleAddToCart = (product: Product, size: string, color: ColorOption, qty: number) => {
    setCartItems((prev) => {
      const cartItemId = `${product.id}-${size}-${color.name}`;
      const existingIndex = prev.findIndex((i) => i.id === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = Math.min(product.localStock, updated[existingIndex].quantity + qty);
        return updated;
      } else {
        return [...prev, {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty
        }];
      }
    });
    triggerToast(`${product.name} added to courier delivery Bag.`);
  };

  const handleUpdateQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }

    setCartItems((prev) => 
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.product.localStock;
          return {
            ...item,
            quantity: Math.min(maxStock, qty)
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
    triggerToast('Piece removed from your bag.');
  };

  const handleTriggerCheckout = (promo: string, pct: number) => {
    setAppliedPromo(promo);
    setDiscountPercent(pct);
    setCheckoutMode(true);
    setActiveTab('shop'); // Keep root navigation simple
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCartItems([]); // flush cart
    setCheckoutMode(false);
    setActiveTab('tracking'); // instantly open order tracker
    triggerToast(`Order placed successfully! ID: ${newOrder.id}`);
  };

  // --- Filtering & Sorting Compute Logic ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter code
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      // Search matches
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = p.price <= priceRange;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      // Sort configurations
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return 0; // standard featured
    });
  }, [selectedCategory, searchQuery, selectedSort, priceRange]);

  // Wishlisted objects list
  const wishlistProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 transform -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full shadow-2xl flex items-center gap-2"
          >
            <CheckCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header navigation */}
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        currentUser={currentUser}
        onTriggerLogin={() => setIsAuthModalOpen(true)}
        onTriggerLogout={handleLogout}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCheckoutMode(false); // Force back from checkout if tab changed
        }}
      />

      {/* Primary body switcher */}
      <main className="flex-1 w-full">
        {checkoutMode ? (
          /* Checkout mode screen */
          <CheckoutSection
            cartItems={cartItems}
            appliedPromo={appliedPromo}
            discountPercent={discountPercent}
            currentUser={currentUser}
            onPlaceOrder={handlePlaceOrder}
            onBackToShop={() => setCheckoutMode(false)}
            onTriggerLogin={() => setIsAuthModalOpen(true)}
          />
        ) : (
          <>
            {/* View Tab switcher */}
            {activeTab === 'shop' && (
              <div id="shop-catalog-view">
                {/* Sleek Theme Hero Section Marquee */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                  <div className="relative h-auto md:h-76 rounded-3xl overflow-hidden bg-slate-900 group shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent z-10" />
                    
                    <div className="relative z-20 h-full p-8 md:p-12 flex flex-col justify-center text-white max-w-2xl select-none">
                      <span className="inline-block w-fit px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                        LIMITED DROP • LOCAL EXPEDITED SHIPPING FLEET
                      </span>
                      <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-3">
                        The Urban Nomad<br/>Collection '24
                      </h1>
                      <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                        Handcrafted essentials for the modern explorer. We connect premium clothing outlets in <span className="text-white underline font-semibold">{selectedCity}</span> with rapid bike messengers for instant 2-Hour deliveries.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Truck className="h-4 w-4 text-indigo-400" />
                          <span>2 Hrs Handoff Average</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-indigo-400" />
                          <span>Locally Sourced boutique garments</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Glowing background circles for modern Sleek aesthetics */}
                    <div className="absolute right-20 bottom-[-50px] w-64 h-96 bg-indigo-500 rounded-full blur-[80px] opacity-20" />
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex gap-4 z-10">
                      <div className="w-28 h-40 bg-slate-800 rounded-2xl border border-slate-700/60 shadow-inner flex items-center justify-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">Local Fleet</div>
                      <div className="w-28 h-40 bg-slate-800 rounded-2xl border border-slate-700/60 shadow-inner flex items-center justify-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">Premium</div>
                    </div>
                  </div>
                </section>

                {/* Main Shop Products Space */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Filters rail */}
                    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-100 p-6 shrink-0 space-y-6 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                          Outfit Filters
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCategory('All');
                            setSearchQuery('');
                            setPriceRange(200);
                            setSelectedSort('featured');
                          }}
                          className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-605 transition-colors"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Search container in filter sidebar */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Search</label>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Type keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-xs rounded-full border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-8 focus:border-indigo-500 focus:bg-white focus:ring-0 focus:outline-hidden transition"
                          />
                        </div>
                      </div>

                      {/* Sorting options */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Sort By</label>
                        <select
                          value={selectedSort}
                          onChange={(e) => setSelectedSort(e.target.value)}
                          className="w-full text-xs rounded-full border border-slate-200 bg-white py-2 px-3 focus:border-indigo-500 focus:outline-hidden transition"
                        >
                          <option value="featured">Featured Curations</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="rating">Reviews and Rating</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Max Price</span>
                          <span className="text-slate-900 font-bold">${priceRange}</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          step="10"
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      {/* Stock availability urgency text */}
                      <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-[11px] leading-relaxed text-indigo-950">
                        Orders placed via standard shipping are fulfilled within {selectedCity} city limits directly from nearby partner closets.
                      </div>
                    </aside>

                    {/* Products display list config */}
                    <div className="flex-1 w-full space-y-6">
                      
                      {/* Sub-Header bar categorizers */}
                      <div className="flex flex-wrap gap-2 items-center justify-between border-b border-slate-200 pb-3">
                        {/* Categories List */}
                        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                          {['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition cursor-pointer select-none ${
                                selectedCategory === cat
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-indigo-600 bg-white border border-slate-100'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <span className="text-xs font-semibold text-slate-400">
                          Found {filteredProducts.length} Premium Pieces
                        </span>
                      </div>

                      {/* Core dynamic Grid */}
                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-2xl border border-neutral-100">
                          <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                          <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wide">No pieces match filters</h3>
                          <p className="text-xs text-neutral-400 mt-1">Try relaxing your slide parameters or entering simpler keywords.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                          {filteredProducts.map((prod) => (
                            <ProductCard
                              key={prod.id}
                              product={prod}
                              isLiked={wishlistIds.includes(prod.id)}
                              onToggleLike={handleToggleLike}
                              onQuickView={setCurrentDetailProduct}
                              onQuickAdd={(p, s) => {
                                const defaultColor = p.colors[0];
                                handleAddToCart(p, s, defaultColor, 1);
                              }}
                            />
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Wishlist Tab view */}
            {activeTab === 'wishlist' && (
              <div id="wishlist-tab-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="border-b border-neutral-200 pb-5 mb-8">
                  <h1 className="text-2xl font-black text-neutral-950 uppercase tracking-tight">Your Wishlist</h1>
                  <p className="text-xs text-neutral-400 mt-1">Sizing styles you curated for local courier dispatching references</p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
                    <Heart className="h-10 w-10 text-neutral-300 mx-auto mb-3 animate-pulse" />
                    <h3 className="text-sm font-semibold text-neutral-800">Your wishlist is empty</h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                      Click the small heart icon markers on boutique pieces while browsing the store.
                    </p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="mt-6 inline-flex justify-center bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-lg hover:bg-neutral-800 transition"
                    >
                      Browse Boutique Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isLiked={wishlistIds.includes(p.id)}
                        onToggleLike={handleToggleLike}
                        onQuickView={setCurrentDetailProduct}
                        onQuickAdd={(prod, size) => {
                          const defaultColor = prod.colors[0];
                          handleAddToCart(prod, size, defaultColor, 1);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Live Order tracking Tab view */}
            {activeTab === 'tracking' && (
              <div id="tracking-tab-view">
                <OrderTracking
                  order={activeOrder}
                  onBackToShop={() => setActiveTab('shop')}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Slide-out cart drawer list */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleTriggerCheckout}
          />
        )}
      </AnimatePresence>

      {/* Dedicated details overview modal */}
      <AnimatePresence>
        {currentDetailProduct && (
          <ProductDetailsModal
            isOpen={!!currentDetailProduct}
            onClose={() => setCurrentDetailProduct(null)}
            product={currentDetailProduct}
            isLiked={wishlistIds.includes(currentDetailProduct.id)}
            onToggleLike={handleToggleLike}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Authentications form overlays */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>

      {/* Humble literal footer layout */}
      <footer className="bg-white border-t border-slate-100 py-10 select-none">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between text-xs space-y-4 sm:space-y-0 text-slate-500 font-medium font-sans">
          <div>
            <p className="text-indigo-600 font-black tracking-tight text-sm uppercase mb-1">
              LocalStyle – Premium Apparel Delivery Platform
            </p>
            <p>© 2026 LocalStyle Inc. All boutique rights reserved.</p>
          </div>
          <div className="flex justify-center gap-4 text-[11px] font-sans">
            <a href="#rules" className="hover:text-indigo-650 transition">Terms of Delivery</a>
            <a href="#privacy" className="hover:text-indigo-650 transition">Rider Coordination</a>
            <a href="#help" className="hover:text-indigo-650 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
