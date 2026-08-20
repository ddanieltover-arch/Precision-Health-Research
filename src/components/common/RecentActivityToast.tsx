import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/catalog';
import { ProductImage } from './ProductImage';

interface SaleEvent {
  city: string;
  region: string;
  productName: string;
  quantity: string;
  timeAgo: string;
  productImg: string;
}

const SAMPLE_SALES: SaleEvent[] = [
  {
    city: 'London',
    region: 'UK',
    productName: 'Tirzepatide 60mg High Potency',
    quantity: '2 Vials',
    timeAgo: '4 mins ago',
    productImg: '/heroes/peptide-t-60mg.png'
  },
  {
    city: 'Cambridge',
    region: 'UK',
    productName: 'BPC-157 & TB-500 Synergistic Blend',
    quantity: '1 Kit',
    timeAgo: '11 mins ago',
    productImg: '/heroes/phr-tb-500-hero-1779562911590.png'
  },
  {
    city: 'Manchester',
    region: 'UK',
    productName: 'Semaglutide GLP-1 Research Peptide',
    quantity: '3 Vials',
    timeAgo: '19 mins ago',
    productImg: '/heroes/semaglutide.png'
  },
  {
    city: 'Oxford',
    region: 'UK',
    productName: 'NAD+ (Reduced Cellular Coenzyme)',
    quantity: '2 Vials',
    timeAgo: '27 mins ago',
    productImg: '/heroes/phr-nad-plus-hero-1779584196468.png'
  },
  {
    city: 'Edinburgh',
    region: 'UK',
    productName: 'Retatrutide Triple Agonist 15mg',
    quantity: '1 Vial',
    timeAgo: '35 mins ago',
    productImg: '/heroes/retatrutide.png'
  },
  {
    city: 'Bristol',
    region: 'UK',
    productName: 'Glow Peptide Synergy Blend',
    quantity: '2 Vials',
    timeAgo: '48 mins ago',
    productImg: '/heroes/glow-10mg-70mg-10mg.png'
  },
  {
    city: 'Birmingham',
    region: 'UK',
    productName: 'Somatropin 191aa Recombinant HGH',
    quantity: '1 Kit',
    timeAgo: '1 hour ago',
    productImg: '/heroes/hgh-191aa-somatropin.png'
  }
];

export const RecentActivityToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { openProductDetail } = useStore();

  useEffect(() => {
    if (isDismissed) return;

    // Show initial notification after 6 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    // Interval to cycle every 24 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SAMPLE_SALES.length);
        setIsVisible(true);
      }, 1000);
    }, 24000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = SAMPLE_SALES[currentIndex];
  const matchedProduct = PRODUCTS.find((p) => p.name.includes(current.productName.split(' ')[0]));

  const handleClick = () => {
    if (matchedProduct) {
      openProductDetail(matchedProduct);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm hidden sm:block animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div 
        onClick={handleClick}
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-3.5 shadow-xl shadow-slate-900/10 flex items-center gap-3.5 cursor-pointer hover:border-[#335e90]/50 transition-all group"
      >
        <ProductImage
          src={current.productImg}
          productId={matchedProduct?.id}
          alt={current.productName}
          className="w-11 h-11 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200 group-hover:scale-105 transition-transform"
          containerClassName="w-11 h-11 shrink-0"
        />

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Verified Lab Order</span>
          </div>
          <h5 className="text-xs font-bold text-slate-900 truncate font-display mt-0.5">
            {current.productName}
          </h5>
          <p className="text-[10px] text-slate-500">
            {current.city}, {current.region} &bull; <span className="font-semibold text-slate-700">{current.timeAgo}</span>
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
          title="Dismiss alerts"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
