import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ShieldCheck, 
  ThermometerSnowflake,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { setActiveView } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      setSearched(true);
    }
  };

  const sampleOrderNum = orderQuery.trim().toUpperCase().startsWith('PHR-') 
    ? orderQuery.trim().toUpperCase() 
    : `PHR-${orderQuery.trim().toUpperCase() || '849201'}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Fulfillment &amp; Cold-Chain Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Track Laboratory Shipment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Monitor your research shipment progress, lot quality checkpoints, and real-time Royal Mail delivery updates from our UK laboratory hub.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. PHR-849201)"
              className="w-full pl-9 pr-3 py-2.5 bg-white text-xs font-mono-code rounded-xl border border-slate-300 outline-none focus:border-[#335e90] focus:ring-1 focus:ring-[#335e90]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            Track
          </button>
        </form>
      </div>

      {/* Result Card (shown when searched or default benchmark) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs text-slate-500 font-medium">Order Reference:</span>
            <div className="text-lg font-extrabold text-slate-900 font-mono-code flex items-center gap-2 mt-0.5">
              <span>{searched ? sampleOrderNum : 'PHR-849201 (Example)'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                In Transit &bull; On Schedule
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 font-medium">Estimated Arrival</span>
            <div className="text-sm font-black text-[#335e90]">
              Wednesday by 1:00 PM GMT
            </div>
            <span className="text-[11px] text-slate-400">Royal Mail Tracked 24 Cold-Pack</span>
          </div>
        </div>

        {/* Shipment Step Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-slate-200 ml-4 sm:ml-6">
          
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Order Placed &amp; Certified</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              In-vitro research agreement signed. UK Bank / Crypto Payment verified.
            </p>
            <span className="text-[10px] text-slate-400 font-mono-code">Monday, 09:14 AM GMT</span>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Lot Quarantined &amp; HPLC Verified</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Vials inspected from cold storage (-20°C). Batch Lot PHR-TB-2026 COA matched.
            </p>
            <span className="text-[10px] text-slate-400 font-mono-code">Monday, 11:30 AM GMT</span>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Dispatched from UK Distribution Hub</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Scanned at Royal Mail Mail Centre (Tracking #GB 2948 1029 4RM).
            </p>
            <span className="text-[10px] text-slate-400 font-mono-code">Monday, 03:45 PM GMT</span>
          </div>

          {/* Step 4 (Active) */}
          <div className="relative">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-[#335e90] text-white flex items-center justify-center text-xs animate-pulse">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-extrabold text-[#335e90]">In Transit to Destination Facility</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Package moving through national Royal Mail logistics network. Temperature shield intact.
            </p>
            <span className="text-[10px] text-slate-400 font-mono-code">Current Status</span>
          </div>

          {/* Step 5 */}
          <div className="relative opacity-50">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-700">Out for Delivery &amp; Laboratory Receipt</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Signature / Delivery confirmation.
            </p>
          </div>

        </div>

        {/* Cold Chain Specs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <ThermometerSnowflake className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Thermal Barrier</span>
              <span className="text-[10px] text-slate-500">Mylar Bubble Insulated</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#335e90] shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Origin Hub</span>
              <span className="text-[10px] text-slate-500">London Hub, United Kingdom</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Delivery Guarantee</span>
              <span className="text-[10px] text-slate-500">Full Replacement on Loss</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
