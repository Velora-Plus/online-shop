import React from 'react';
import { ShoppingBag, Heart, Search, MapPin, User as UserIcon, LogOut, Package, Menu } from 'lucide-react';
import { User } from '../types';
import { CITIES } from '../data/products';

interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  onTriggerLogin: () => void;
  onTriggerLogout: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeTab: 'shop' | 'wishlist' | 'tracking';
  onTabChange: (tab: 'shop' | 'wishlist' | 'tracking') => void;
}

export default function Header({
  onCartClick,
  cartCount,
  wishlistCount,
  currentUser,
  onTriggerLogin,
  onTriggerLogout,
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchQueryChange,
  activeTab,
  onTabChange
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      {/* Top Banner Alert Bar */}
      <div className="bg-slate-900 px-4 py-2 text-center text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest flex items-center justify-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
        Getting orders delivered locally in {selectedCity} under 2 Hours! Code: <strong className="text-indigo-400">LOCALSTYLE15</strong> (15% OFF)
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand/Identity */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onTabChange('shop')}
              className="flex items-baseline gap-1 focus:outline-hidden cursor-pointer"
            >
              <span className="text-2xl font-bold tracking-tighter text-indigo-600 uppercase">
                Local<span className="text-slate-900 font-normal tracking-normal">Style</span>
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            </button>

            {/* City Selection Dropdown to showcase localization */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-600 focus:outline-hidden cursor-pointer py-0 pl-1 pr-6"
                style={{ MozAppearance: 'none', WebkitAppearance: 'none' }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar integration matching Sleek Interface theme style */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 gap-3 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="bg-transparent border-none outline-hidden text-sm w-full text-slate-900 placeholder-slate-400 focus:ring-0"
              />
            </div>
          </div>

          {/* Controls & Badges */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* View selectors */}
            <nav className="flex space-x-1 border border-slate-100 bg-slate-50 p-1 rounded-full">
              <button
                onClick={() => onTabChange('shop')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer select-none ${
                  activeTab === 'shop'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                Catalog
              </button>
              
              <button
                onClick={() => onTabChange('wishlist')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer relative select-none ${
                  activeTab === 'wishlist'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('tracking')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 relative select-none ${
                  activeTab === 'tracking'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>Track</span>
              </button>
            </nav>

            {/* Shopping cart toggle trigger */}
            <button
              onClick={onCartClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 transition text-slate-700"
              aria-label="Open Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account authentication state displays */}
            <div className="border-l border-slate-200 pl-3 md:pl-4">
              {currentUser && currentUser.isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:block text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Courier Profiling</span>
                    <span className="block text-xs font-extrabold text-slate-800 truncate max-w-[100px]" title={currentUser.name}>
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={onTriggerLogout}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-100 hover:bg-slate-100 transition"
                    title="Log Out Courier Settings"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onTriggerLogin}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-full shadow-xs transition cursor-pointer"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Sign In</span>
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
}
