import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, Phone, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginView) {
      if (!email || !password) {
        setError('Please fill in all email and password fields.');
        return;
      }
      
      const simulatedUser: User = {
        id: 'usr_1',
        email: email,
        name: email.split('@')[0].toUpperCase(),
        phone: '+1 (555) 304-1928',
        address: '1048 Valencia Street',
        city: 'San Francisco',
        zipCode: '94110',
        isLoggedIn: true
      };

      setSuccess('Logged in successfully!');
      setTimeout(() => {
        onLogin(simulatedUser);
        onClose();
      }, 1000);
    } else {
      if (!name || !email || !password || !phone || !address || !zipCode) {
        setError('Please complete all fields to establish local Delivery profile.');
        return;
      }

      const simulatedUser: User = {
        id: 'usr_new',
        email,
        name,
        phone,
        address,
        city,
        zipCode,
        isLoggedIn: true
      };

      setSuccess('Account created and shipping profile saved!');
      setTimeout(() => {
        onLogin(simulatedUser);
        onClose();
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl md:p-8 border border-slate-100"
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            {isLoginView ? 'Welcome Back' : 'Create Delivery Account'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-medium">
            {isLoginView 
              ? 'Sign in to access rapid delivery tracking & wishlists' 
              : 'Add your local courier addresses and size profiles'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-full bg-red-50 py-2.5 px-4 text-xs font-bold text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-indigo-50 py-2.5 px-4 text-xs font-bold text-indigo-700 border border-indigo-150">
            <CheckCircle className="h-4 w-4 shrink-0 text-indigo-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1 pl-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-full border border-slate-200 py-2.5 pr-4 pl-11 text-sm focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1 pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-slate-200 py-2.5 pr-4 pl-11 text-sm focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-655 text-slate-600 uppercase tracking-wider mb-1 pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-slate-200 py-2.5 pr-4 pl-11 text-sm focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
              />
            </div>
          </div>

          {!isLoginView && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1 pl-1">
                  Mobile Number (for Courier updates)
                </label>
                <div className="relative">
                  <Phone className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-full border border-slate-200 py-2.5 pr-4 pl-11 text-sm focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1 pl-1">
                  Local Delivery Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="123 Fashion Blvd, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-full border border-slate-200 py-2.5 pr-4 pl-11 text-sm focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1 pl-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-full border border-slate-200 py-2.5 px-4 text-sm bg-white focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
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
                  <label className="block text-[10px] font-bold text-slate-655 text-slate-600 uppercase tracking-wider mb-1 pl-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    placeholder="94110"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full rounded-full border border-slate-200 py-2.5 px-4 text-sm focus:border-indigo-500 focus:ring-0 focus:outline-hidden transition"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-indigo-650 text-white py-3 text-sm font-semibold hover:bg-indigo-700 transition focus:outline-hidden cursor-pointer shadow-sm mt-2"
          >
            {isLoginView ? 'Sign In' : 'Register Delivery Courier Profile'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {isLoginView ? (
            <p className="font-semibold">
              Don't have a shipping profile?{' '}
              <button 
                onClick={() => { setIsLoginView(false); setError(''); }}
                className="font-bold text-indigo-600 underline hover:text-indigo-700 cursor-pointer"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p className="font-semibold">
              Already registered with LocalStyle?{' '}
              <button 
                onClick={() => { setIsLoginView(true); setError(''); }}
                className="font-bold text-indigo-600 underline hover:text-indigo-700 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
