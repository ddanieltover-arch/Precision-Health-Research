import React, { useMemo } from 'react';
import { PRODUCTS } from '../../data/catalog';
import { ProductCard } from '../storefront/ProductCard';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  FlaskConical, 
  Dna, 
  Activity, 
  Flame, 
  Syringe, 
  Pill,
  Award
} from 'lucide-react';

export const HomeCuratedSections: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  // Top Featured & Best Sellers (limited to 4 high-demand products)
  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  }, []);

  const metabolicHomeSlugs = new Set([
    'mots-c',
    'bam15',
    'adipotide',
    '5-amino-1mq',
    'tudca-250mg',
    'semaglutide',
    'tirzepatide',
    'retatrutide',
    'cagrilintide',
    'fat-blaster-lc526',
    'ss-31',
    'aod-9604',
  ]);

  const repairHomeSlugs = new Set([
    'bpc-157',
    'tb-500',
    'ghk-cu',
    'ahk-cu',
    'epitalon',
    'thymosin-alpha-1',
    'bpc-157-tb-500-blend',
    'glow-peptide-blend',
    'klow-peptide-blend',
  ]);

  const blendHomeSlugs = new Set([
    'bpc-157-tb-500-blend',
    'glow-peptide-blend',
    'klow-peptide-blend',
    'win-depot-50mg',
    'sustanon-250mg',
    'trenbolone-enanthate-200mg',
    'tren-a-100mg',
    'tnt-400',
    'tnt-200',
    'testosterone-undecanoate-250mg',
  ]);

  // Metabolic signaling + incretin research compounds
  const metabolicProducts = useMemo(() => {
    return PRODUCTS.filter((p) => metabolicHomeSlugs.has(p.slug)).slice(0, 4);
  }, []);

  // Tissue repair & cellular peptides
  const repairProducts = useMemo(() => {
    return PRODUCTS.filter((p) => repairHomeSlugs.has(p.slug)).slice(0, 4);
  }, []);

  // Synergistic blends & injectables
  const blendProducts = useMemo(() => {
    return PRODUCTS.filter((p) => blendHomeSlugs.has(p.slug)).slice(0, 4);
  }, []);

  const handleViewAll = (categorySlug: string = 'all') => {
    setSelectedCategory(categorySlug);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* SECTION 1: Featured & High-Demand Research Compounds */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Highest Demand Syntheses</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Featured Research Compounds
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top requested reference standards with verified HPLC chromatograms and strict analytical specifications.
            </p>
          </div>

          <button
            onClick={() => handleViewAll('all')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#335e90] hover:text-[#264a73] uppercase tracking-wider group"
          >
            <span>Browse Full Catalog ({PRODUCTS.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 2: Metabolic & Incretin Research (GLP-1 / GIP / Longevity) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Metabolic Signaling &amp; Cellular Aging</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Metabolic Research Compounds
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              GLP-1 receptor modulators, dual/triple incretin agonists, and mitochondrial biogenesis peptides.
            </p>
          </div>

          <button
            onClick={() => handleViewAll('metabolic')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#335e90] hover:text-[#264a73] uppercase tracking-wider group"
          >
            <span>View All Metabolic ({PRODUCTS.filter(p => p.categorySlug === 'metabolic').length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metabolicProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Quick Scientific Quality Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#10243d] to-[#1b3552] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Analytical Purity Guarantee</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                Need Specific Reconstitution Calculations?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Use our interactive laboratory peptide reconstitution calculator to determine exact microgram volume draw per unit on U-100 syringes.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => {
                  setActiveView('calculator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-lg transition-all"
              >
                Launch Peptide Calculator
              </button>
              <button
                onClick={() => {
                  setActiveView('research');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all border border-white/20"
              >
                Explore Research Hub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Tissue Regeneration & Cellular Repair */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Dna className="w-4 h-4" />
              <span>Cellular Signaling &amp; Angiogenesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Cellular Repair Peptides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pure lyophilized BPC-157, TB-500, GHK-Cu, Epitalon, and secretagogues for cellular research.
            </p>
          </div>

          <button
            onClick={() => handleViewAll('peptides')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#335e90] hover:text-[#264a73] uppercase tracking-wider group"
          >
            <span>View All Repair Peptides ({PRODUCTS.filter(p => p.categorySlug === 'peptides').length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {repairProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Synergistic Blends & Multi-Compound Formulations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <Syringe className="w-4 h-4" />
              <span>Synergistic Multi-Pathway Formulations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Synergistic Blends &amp; Injectables
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pre-mixed co-lyophilized matrices including Glow (90mg), Klow (80mg), and BPC+TB blends.
            </p>
          </div>

          <button
            onClick={() => handleViewAll('injectables')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#335e90] hover:text-[#264a73] uppercase tracking-wider group"
          >
            <span>View All Blends ({PRODUCTS.filter(p => p.categorySlug === 'injectables').length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blendProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Catalog Footer CTA to Explore All Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-4">
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200/80 space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
            Looking for something specific?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Explore our complete scientific library including SARMs, Oral Compounds, HGH kits, and lab supplies.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleViewAll('all')}
              className="px-8 py-3.5 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore All {PRODUCTS.length} Compounds in Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
