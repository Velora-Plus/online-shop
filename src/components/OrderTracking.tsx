import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, MapPin, Navigation, Compass, Shield, User, Play, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Order, DeliveryStep } from '../types';

interface OrderTrackingProps {
  order: Order | null;
  onBackToShop: () => void;
}

export default function OrderTracking({ order: initialOrder, onBackToShop }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [activeStepId, setActiveStepId] = useState(1);
  const [eta, setEta] = useState(45);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      setActiveStepId(1);
      setEta(initialOrder.etaMinutes || 45);
    }
  }, [initialOrder]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-12 text-center bg-white rounded-2xl border border-neutral-100 my-16 shadow-xs">
        <AlertCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4 animate-bounce" />
        <h3 className="text-base font-bold text-neutral-900">No active tracking coordinates</h3>
        <p className="text-xs text-neutral-400 mt-2">Place an order with LocalStyle and receive an energetic bike-delivery tracker!</p>
        <button
          onClick={onBackToShop}
          className="mt-6 bg-neutral-900 text-white font-semibold text-xs uppercase px-5 py-2.5 rounded-lg select-none cursor-pointer hover:bg-neutral-800"
        >
          Go Shop Products
        </button>
      </div>
    );
  }

  // Advance simulation steps automatically or manually
  const simulateStepProgress = () => {
    if (activeStepId >= 4) return;
    const nextStep = activeStepId + 1;
    setActiveStepId(nextStep);

    // Update timestamps on steps
    const updatedSteps = order.steps.map((st) => {
      if (st.id === nextStep) {
        return {
          ...st,
          status: 'current' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      if (st.id < nextStep) {
        return { ...st, status: 'completed' as const };
      }
      return st;
    });

    let newStatus: Order['status'] = 'placed';
    let newEta = eta;

    if (nextStep === 2) {
      newStatus = 'preparing';
      newEta = Math.round(eta * 0.75);
    } else if (nextStep === 3) {
      newStatus = 'transit';
      newEta = Math.round(eta * 0.4);
    } else if (nextStep === 4) {
      newStatus = 'delivered';
      newEta = 0;
    }

    setEta(newEta);
    setOrder({
      ...order,
      status: newStatus,
      steps: updatedSteps
    });
  };

  // Determine coordinate layout position of biker on mock SVG map
  const getBikerCoordinates = () => {
    switch (activeStepId) {
      case 1: return { x: 50, y: 70 }; // hub
      case 2: return { x: 140, y: 150 }; // stylist shop
      case 3: return { x: 260, y: 90 }; // transit highway
      case 4: return { x: 380, y: 220 }; // destination house
      default: return { x: 50, y: 70 };
    }
  };

  const bikerPos = getBikerCoordinates();

  return (
    <div id="order-tracking-root" className="max-w-5xl mx-auto px-4 py-8 md:py-12 font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {order.status === 'delivered' ? 'Safely Arrived' : 'On Route to Your Door'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• ID: {order.id}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Dispatch & Courier Routing
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {activeStepId < 4 && (
            <button
              onClick={simulateStepProgress}
              className="inline-flex items-center gap-2 bg-slate-950 border border-slate-950 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4.5 rounded-full shadow-xs cursor-pointer hover:bg-indigo-650 transition"
              title="Advance courier delivery status for previewing stages"
            >
              <Play className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" />
              <span>Simulate progress ({activeStepId}/4)</span>
            </button>
          )}

          <button
            onClick={onBackToShop}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full transition cursor-pointer"
          >
            Return to Boutique Store
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Aspect: Delivery Steps Timeline & Handoff Address */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-8 shadow-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-6 text-center">
            <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                Estimated Handoff
              </span>
              <span className="font-extrabold text-slate-900 flex items-center justify-center gap-1 text-xs sm:text-sm">
                <Clock className="h-3.5 w-3.5 text-indigo-650 shrink-0" />
                {order.status === 'delivered' ? 'COMPLETED' : `${eta} mins`}
              </span>
            </div>

            <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                Your Biker Courier
              </span>
              <span className="font-extrabold text-slate-900 flex items-center justify-center gap-1 text-xs sm:text-sm line-clamp-1">
                <User className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                {order.courierName}
              </span>
            </div>

            <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                Carrier Plan
              </span>
              <span className="font-extrabold text-slate-900 text-xs truncate block pt-0.5">
                {order.deliveryOption.name.split(' (')[0]}
              </span>
            </div>
          </div>

          {/* Timeline steps */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Live Delivery Log</h3>
            <div className="space-y-6 relative">
              {/* Connecting rail */}
              <div className="absolute top-2 left-3.5 bottom-2 w-0.5 bg-slate-100 -z-0" />

              {order.steps.map((step, idx) => {
                const isActive = step.id === activeStepId;
                const isCompleted = step.id < activeStepId;
                const isPending = step.id > activeStepId;

                return (
                  <div key={idx} className="relative flex gap-4 pl-8 items-start">
                    {/* Circle icon marker */}
                    <span 
                      className={`absolute left-0 top-1 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 transition ${
                        isCompleted 
                          ? 'border-indigo-600 bg-indigo-600 text-white' 
                          : isActive 
                            ? 'border-slate-950 bg-white text-slate-950 scale-110 shadow-md shadow-slate-100' 
                            : 'border-slate-200 bg-white text-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4.5 w-4.5 fill-indigo-600 stroke-indigo-600" />
                      ) : (
                        <span className="text-xs font-extrabold">{step.id}</span>
                      )}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold tracking-tight ${
                          isActive ? 'text-indigo-650' : isCompleted ? 'text-slate-705' : 'text-slate-400'
                        }`}>
                          {step.title}
                        </h4>
                        {step.timestamp && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-sm">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${
                        isActive ? 'text-slate-600 font-medium' : 'text-slate-400 font-normal'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispatch coordinates info */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Handoff Instructions</h3>
            <div className="text-xs text-slate-650 space-y-2 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
              <p>
                <strong>Delivery Recipient:</strong> {order.shippingAddress.name} ({order.shippingAddress.phone})
              </p>
              <p>
                <strong>Coordinates:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}
              </p>
              <p>
                <strong>Instruction note:</strong> Call buyer once courier pulls up on the sidewalk. Contactless drop option configured.
              </p>
            </div>
          </div>
        </div>

        {/* Right Aspect: Interactive Map with bike overlay */}
        <div className="lg:col-span-6 bg-slate-950 rounded-3xl border border-slate-900 overflow-hidden relative shadow-xl h-[400px] lg:h-[500px] flex flex-col justify-between">
          
          {/* Top dark header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 select-none">
            <div className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-indigo-400 animate-spin-pulse" />
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Courier Map Navigation
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-wider">
                ACTIVE RADAR
              </span>
            </div>
          </div>

          {/* Core Mapping Canvas Area */}
          <div className="flex-1 bg-slate-950 relative overflow-hidden">
            {/* Grid backgrounds to look technical and high precision */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
            
            {/* Vector paths representing city blocks */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-800 stroke-2 fill-none stroke-dasharray-4">
              {/* Roads structure */}
              <line x1="20" y1="70" x2="420" y2="70" />
              <line x1="140" y1="20" x2="140" y2="350" />
              <line x1="20" y1="150" x2="420" y2="150" />
              <line x1="260" y1="20" x2="260" y2="350" />
              <line x1="20" y1="220" x2="420" y2="220" />
              
              {/* Delivery Path active highlighting in indigo color */}
              {activeStepId >= 1 && (
                <path 
                  d="M 50 70 L 140 70 L 140 150 L 260 150 L 260 90 L 260 220 L 380 220" 
                  className="stroke-indigo-500/85 stroke-3 stroke-linecap-round" 
                />
              )}
            </svg>

            {/* City Landmarks layout */}
            {/* Landmark 1: Supply hub */}
            <div className="absolute left-[30px] top-[45px] flex flex-col items-center">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] text-slate-300 font-bold">
                H
              </span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5 select-none bg-slate-950 px-1.5 rounded-sm">
                Hub
              </span>
            </div>

            {/* Landmark 2: Stylist studio */}
            <div className="absolute left-[120px] top-[165px] flex flex-col items-center">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] text-slate-300 font-bold">
                B
              </span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5 select-none bg-slate-950 px-1.5 rounded-sm">
                Boutique
              </span>
            </div>

            {/* Landmark 3: Target Address Destination */}
            <div className="absolute left-[360px] top-[235px] flex flex-col items-center">
              <span className="h-5 w-5 rounded-full bg-indigo-950 border border-indigo-500 flex items-center justify-center text-[8px] text-indigo-450 font-bold animate-pulse">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              </span>
              <span className="text-[8px] text-indigo-400 font-mono font-bold mt-1 select-none bg-slate-950 px-1.5 rounded-sm">
                Doorstep
              </span>
            </div>

            {/* Pulsing bike rider marker cursor */}
            <motion.div
              animate={{ 
                x: bikerPos.x, 
                y: bikerPos.y, 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                type: 'spring', 
                damping: 20, 
                stiffness: 120 
              }}
              className="absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-950 z-20 cursor-crosshair"
              title={`${order.courierName}`}
            >
              <Navigation className="h-3 w-3 fill-current transform rotate-45" />
            </motion.div>
          </div>

          {/* Bottom telemetry indicators */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 text-[10px] text-slate-400 font-mono">
            <div>
              <p className="text-slate-500">COURIER MAP COORDINATE</p>
              <p className="font-semibold text-slate-300">Downtown Dispatch Hub</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">TRANSIT SPEED</p>
              <p className="font-semibold text-slate-300">
                {order.status === 'delivered' ? 'STOPPED' : order.status === 'transit' ? '24 mph' : '0 mph'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
