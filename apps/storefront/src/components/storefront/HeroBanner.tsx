import React, { useMemo } from 'react';
import { PRODUCTS } from '../../data/catalog';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { getProductImageCandidates } from '../../lib/productImages';
import { 
  ArrowRight, 
  Calculator, 
  Sparkles,
} from 'lucide-react';

/** Featured hero compound — real catalog SKU (matches vial artwork). */
const HERO_PRODUCT_ID = 'tb-500';

export const HeroBanner: React.FC = () => {
  const { setActiveView, setSelectedCategory, openProductDetail, formatPrice } = useStore();

  const featuredProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === HERO_PRODUCT_ID) ?? PRODUCTS.find((p) => p.isFeatured) ?? PRODUCTS[0],
    []
  );

  const heroImageSrc = getProductImageCandidates(
    featuredProduct.thumbnailUrl,
    featuredProduct.id
  )[0];

  const purityLabel = featuredProduct.purity.replace(/^≥\s*/, '');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1d2f] via-[#1b3552] to-[#0a1522] text-white border-b border-slate-800">
      {/* Background Subtle Lab Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#335e90]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, badges, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>2026 HPLC Verified Batch Catalog Available</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] font-display">
              Lab-Grade Purity. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-200 to-indigo-200">
                Verified on Every Batch.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Precision Health Research synthesizes ultra-pure lyophilized peptides and analytical reference standards (&gt;99% purity). Every synthesis lot includes public RP-HPLC chromatograms and MS spectrum analysis.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-shop-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveView('catalog');
                }}
                className="px-6 py-3.5 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#335e90]/40 flex items-center gap-2 hover:translate-y-[-1px] transition-all"
              >
                <span>Browse Research Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-calc-btn"
                onClick={() => setActiveView('calculator')}
                className="px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition-all"
              >
                <Calculator className="w-4 h-4 text-sky-400" />
                <span>Reconstitution Calculator</span>
              </button>

              <button
                id="hero-compare-btn"
                onClick={() => setActiveView('compare')}
                className="px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Compare Compounds</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-display">&gt;99.2%</div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Min HPLC Purity</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-display">24-48h</div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Royal Mail 24</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-display">100%</div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">UK Batch Tested</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured catalog product */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Featured Formulation
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[11px] font-bold">
                  HPLC: {purityLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openProductDetail(featuredProduct)}
                className="w-full py-6 flex flex-col items-center text-center group"
              >
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4 flex items-center justify-center rounded-2xl bg-white/95 p-3">
                  <ProductImage
                    src={heroImageSrc}
                    productId={featuredProduct.id}
                    alt={featuredProduct.name}
                    purity={featuredProduct.purity}
                    priority={true}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full"
                  />
                </div>

                <h3 className="text-lg font-extrabold text-white font-display group-hover:text-sky-200 transition-colors">
                  {featuredProduct.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {featuredProduct.shortDesc}
                </p>
                
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Lot: {featuredProduct.variants[0]?.sku ?? 'PHR-2026'}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs text-emerald-400 font-medium">
                    {featuredProduct.stock > 0 ? 'In Stock (UK Hub)' : 'Backordered'}
                  </span>
                </div>
              </button>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting at</span>
                  <span className="text-lg font-bold text-white">{formatPrice(featuredProduct.basePrice)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openProductDetail(featuredProduct)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>View Product</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
