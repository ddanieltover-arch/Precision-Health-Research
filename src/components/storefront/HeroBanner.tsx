import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { 
  ArrowRight, 
  FlaskConical, 
  Calculator, 
  FileCheck2, 
  ShieldCheck, 
  Sparkles,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

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

          {/* Right Column: Hero Visual Card with highlighted compound */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              {/* Card top banner */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Featured Formulation
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[11px] font-bold">
                  HPLC: 99.64%
                </span>
              </div>

              {/* Product Hero Image & Spec */}
              <div className="py-6 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4 flex items-center justify-center">
                  <ProductImage
                    src="/heroes/phr-tb-500-hero-1779562911590.png"
                    productId="bpc-tb-blend"
                    alt="BPC-157 & TB-500 Blend"
                    purity="99.64%"
                    priority={true}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full"
                  />
                </div>

                <h3 className="text-lg font-extrabold text-white font-display">
                  BPC-157 &amp; TB-500 Synergistic Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Equimolar dual peptide blend for tissue remodeling &amp; angiogenic laboratory assays.
                </p>
                
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Lot: PHR-2026-08</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs text-emerald-400 font-medium">In Stock (UK Hub)</span>
                </div>
              </div>

              {/* Quick Card Action */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting at</span>
                  <span className="text-lg font-bold text-white">£64.99</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('injectables');
                    setActiveView('catalog');
                  }}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Blend</span>
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
