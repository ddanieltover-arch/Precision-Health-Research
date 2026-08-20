import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/catalog';
import { 
  BookOpen, 
  FlaskConical, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ThermometerSnowflake, 
  Droplets, 
  Dna, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Copy, 
  Check, 
  HelpCircle, 
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Clock,
  FileCheck2,
  Syringe,
  Box,
  Scale
} from 'lucide-react';

interface GuideCompound {
  name: string;
  category: string;
  sequence: string;
  molecularWeight: string;
  typicalVialSize: string;
  standardDiluent: string;
  solubilityNote: string;
  targetReceptor: string;
  primaryResearchFocus: string;
  halfLife: string;
  storageTemp: string;
  productSlug?: string;
}

const GUIDE_COMPOUNDS: GuideCompound[] = [
  {
    name: 'BPC-157 (Body Protection Compound)',
    category: 'Tissue Repair & Angiogenesis',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val (15 aa)',
    molecularWeight: '1419.5 g/mol',
    typicalVialSize: '5mg / 10mg',
    standardDiluent: 'Bacteriostatic Water (0.9% Benzyl Alcohol)',
    solubilityNote: 'Highly soluble in aqueous media. Rapid dissolution under gentle swirl.',
    targetReceptor: 'FAK-paxillin, VEGF transcription, eNOS pathway',
    primaryResearchFocus: 'Fibroblast migration, tendon/ligament collagen synthesis, cytoprotection',
    halfLife: '~4 hours in vitro aqueous',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'bpc-157'
  },
  {
    name: 'TB-500 (Thymosin Beta-4 Fragment)',
    category: 'Tissue Repair & Angiogenesis',
    sequence: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser (43 aa / LKKTET motif)',
    molecularWeight: '4963.5 g/mol',
    typicalVialSize: '5mg / 10mg',
    standardDiluent: 'Bacteriostatic Water',
    solubilityNote: 'Requires 2-3 minutes gentle resting to dissolve completely without foam.',
    targetReceptor: 'Actin filament polymerization, MMP-2/9 regulation',
    primaryResearchFocus: 'Cell motility, lamellipodia formation, myofibrillar remodeling',
    halfLife: '~24-36 hours systemic distribution',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'tb-500'
  },
  {
    name: 'Tirzepatide (Dual Incretin Co-Agonist)',
    category: 'Metabolic & Incretin Mimetics',
    sequence: '39-amino acid peptide with C20 fatty diacid moiety on Lys20',
    molecularWeight: '4813.5 g/mol',
    typicalVialSize: '5mg / 10mg / 15mg / 30mg',
    standardDiluent: 'Bacteriostatic Water (1.0 to 2.0 mL)',
    solubilityNote: 'Formulated with stabilizing buffer. Clear solution within 60 seconds.',
    targetReceptor: 'GIP Receptor + GLP-1 Receptor (Biased dual agonism)',
    primaryResearchFocus: 'Pancreatic beta-cell insulinotropism, WAT lipolysis, central satiety pathways',
    halfLife: '~5 days (due to albumin-binding diacid moiety)',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted (protect from light)',
    productSlug: 'tirzepatide-10mg'
  },
  {
    name: 'Semaglutide (GLP-1 Analog)',
    category: 'Metabolic & Incretin Mimetics',
    sequence: '31-amino acid peptide modified with Aib8 and C18 diacid spacer at Lys26',
    molecularWeight: '4113.6 g/mol',
    typicalVialSize: '5mg / 10mg',
    standardDiluent: 'Bacteriostatic Water',
    solubilityNote: 'Readily soluble in neutral pH bacteriostatic water.',
    targetReceptor: 'GLP-1 Receptor (Glucagon-like peptide-1)',
    primaryResearchFocus: 'Gastric emptying rate, hypothalamic POMC activation, glycemic homeostasis',
    halfLife: '~7 days in biological models',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'semaglutide-5mg'
  },
  {
    name: 'Retatrutide (Triple GGG Co-Agonist)',
    category: 'Metabolic & Incretin Mimetics',
    sequence: '39-amino acid single backbone peptide with alpha-methyl-L-leucine modifications',
    molecularWeight: '4731.4 g/mol',
    typicalVialSize: '5mg / 10mg / 15mg',
    standardDiluent: 'Bacteriostatic Water (2.0 mL recommended for 10mg+)',
    solubilityNote: 'Lipophilic side chain requires steady gentle swirling for complete clarity.',
    targetReceptor: 'GLP-1R + GIPR + Glucagon Receptor (Tri-agonist)',
    primaryResearchFocus: 'Hepatic lipid oxidation, energy expenditure escalation, metabolic rate',
    halfLife: '~6 days',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'retatrutide-10mg'
  },
  {
    name: 'CJC-1295 (with DAC & No-DAC / Mod GRF 1-29)',
    category: 'Growth Hormone Axis & Secretagogues',
    sequence: 'Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-Lys(Maleimidopropionyl) (DAC version)',
    molecularWeight: '3367.9 g/mol (Mod GRF) / 3647.2 g/mol (DAC)',
    typicalVialSize: '2mg / 5mg',
    standardDiluent: 'Bacteriostatic Water',
    solubilityNote: 'Soluble in aqueous neutral or slightly acidic bacteriostatic diluent.',
    targetReceptor: 'GHRH Receptor (Growth Hormone Releasing Hormone)',
    primaryResearchFocus: 'Pulsatile (No-DAC) vs sustained (DAC) somatotroph pituitary GH secretion',
    halfLife: '~30 mins (Mod GRF 1-29) / ~6-8 days (CJC with DAC)',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'cjc-1295-dac'
  },
  {
    name: 'Ipamorelin (Selective GH Secretagogue)',
    category: 'Growth Hormone Axis & Secretagogues',
    sequence: 'Aib-His-D-2-Nal-D-Phe-Lys-NH2 (Pentapeptide)',
    molecularWeight: '711.9 g/mol',
    typicalVialSize: '2mg / 5mg',
    standardDiluent: 'Bacteriostatic Water',
    solubilityNote: 'Fast dissolution without residue.',
    targetReceptor: 'GHS-R1a (Ghrelin receptor) - highly selective',
    primaryResearchFocus: 'Selective GH pulse induction without elevating cortisol, prolactin, or ACTH',
    halfLife: '~2 hours',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'ipamorelin-5mg'
  },
  {
    name: 'MOTS-c (Mitochondrial Derived Peptide)',
    category: 'Mitochondrial & Cellular Longevity',
    sequence: 'Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg (16 aa)',
    molecularWeight: '2174.6 g/mol',
    typicalVialSize: '5mg / 10mg',
    standardDiluent: 'Bacteriostatic Water',
    solubilityNote: 'Dissolves easily. Sensitive to high temperatures above 25°C.',
    targetReceptor: 'AMPK phosphorylation & AICAR pathway in skeletal muscle',
    primaryResearchFocus: 'Mitochondrial metabolic flexibility, glucose transport, insulin sensitivity',
    halfLife: '~4 hours',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'mots-c-10mg'
  },
  {
    name: 'Epithalon (Epitalon Tetrapeptide)',
    category: 'Mitochondrial & Cellular Longevity',
    sequence: 'Ala-Glu-Asp-Gly (4 aa)',
    molecularWeight: '390.35 g/mol',
    typicalVialSize: '10mg / 50mg',
    standardDiluent: 'Bacteriostatic Water (2.0 to 5.0 mL)',
    solubilityNote: 'Very small molecular weight; dissolves almost instantaneously.',
    targetReceptor: 'Pineal gland peptide regulation, Telomerase reverse transcriptase (TERT)',
    primaryResearchFocus: 'Telomere length preservation, circadian melatonin rhythms, oxidative resistance',
    halfLife: '~1-2 hours',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'epithalon-10mg'
  },
  {
    name: 'GHK-Cu (Copper Tripeptide-1)',
    category: 'Dermal & Tissue Remodeling',
    sequence: 'Gly-His-Lys:Cu2+ (Chelated tripeptide complex)',
    molecularWeight: '404.9 g/mol (free base) / ~500 g/mol (Cu complex)',
    typicalVialSize: '50mg / 100mg',
    standardDiluent: 'Bacteriostatic Water (distinctive blue solution)',
    solubilityNote: 'Forms a vibrant blue translucent solution upon copper hydration.',
    targetReceptor: 'TGF-beta1, decorin, MMP/TIMP balance, fibroblast collagen I/III',
    primaryResearchFocus: 'Collagen synthesis, dermal thickness, anti-inflammatory matrix remodeling',
    halfLife: '~2-4 hours',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted (protect from light)',
    productSlug: 'ghk-cu-50mg'
  },
  {
    name: 'Semax (Heptapeptide ACTH 4-10 Analog)',
    category: 'Nootropic & Cognitive Regulation',
    sequence: 'Met-Glu-His-Phe-Pro-Gly-Pro (7 aa)',
    molecularWeight: '813.9 g/mol',
    typicalVialSize: '10mg / 30mg',
    standardDiluent: 'Bacteriostatic Water or Sterile Deionized Water',
    solubilityNote: 'High water solubility.',
    targetReceptor: 'BDNF (Brain-Derived Neurotrophic Factor) & TrkB signaling in hippocampus',
    primaryResearchFocus: 'Neuroprotection, ischemic challenge recovery, memory formation, synaptic plasticity',
    halfLife: '~2-3 hours',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'semax-10mg'
  },
  {
    name: 'Selank (Tuftsin Analog Heptapeptide)',
    category: 'Nootropic & Cognitive Regulation',
    sequence: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro (7 aa)',
    molecularWeight: '751.9 g/mol',
    typicalVialSize: '10mg / 30mg',
    standardDiluent: 'Bacteriostatic Water',
    solubilityNote: 'Instant clear solubility.',
    targetReceptor: 'GABAergic neurotransmission, enkephalinase inhibition',
    primaryResearchFocus: 'Anxiolytic research models without sedative side effects, immune cytokine modulation',
    halfLife: '~2 hours',
    storageTemp: '-20°C lyophilized / 2-8°C reconstituted',
    productSlug: 'selank-10mg'
  }
];

export const PeptideGuideView: React.FC = () => {
  const { setActiveView, openProductDetail } = useStore();
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'reconstitution' | 'storage' | 'calculations' | 'compounds' | 'testing' | 'safety'>('overview');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Quick concentration calculation helper inside the guide
  const [calcVialMg, setCalcVialMg] = useState<number>(10);
  const [calcWaterMl, setCalcWaterMl] = useState<number>(2);
  const [calcTargetMcg, setCalcTargetMcg] = useState<number>(250);

  const calculatedConcentrationMgMl = calcWaterMl > 0 ? calcVialMg / calcWaterMl : 0;
  const calculatedConcentrationMcgPerMl = calculatedConcentrationMgMl * 1000;
  const calculatedDoseMl = calculatedConcentrationMcgPerMl > 0 ? calcTargetMcg / calculatedConcentrationMcgPerMl : 0;
  const calculatedSyringeUnits = calculatedDoseMl * 100; // U-100 syringe

  const categories = useMemo(() => {
    const set = new Set(GUIDE_COMPOUNDS.map(c => c.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredCompounds = useMemo(() => {
    return GUIDE_COMPOUNDS.filter(c => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchSearch = searchFilter.trim() === '' || 
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.targetReceptor.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.primaryResearchFocus.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchFilter]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleProductNavigate = (slug: string) => {
    const product = PRODUCTS.find(p => p.slug === slug || p.id === slug);
    if (product) {
      openProductDetail(product);
    } else {
      setActiveView('catalog');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#1b3552] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-sky-300 font-medium mb-3">
            <button onClick={() => setActiveView('home')} className="hover:underline">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200">Scientific Reference</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">Peptide Guide</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                COMPREHENSIVE PEPTIDE GUIDE &amp; LABORATORY PROTOCOLS
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                The Complete Peptide Research Guide
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                An authoritative technical manual covering peptide biochemistry, functional classifications, step-by-step reconstitution techniques, storage kinetics, HPLC purity validation, and dose calculation conversion tables.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => setActiveView('calculator')}
                className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Reconstitution Calculator</span>
              </button>
              <button
                onClick={() => setActiveView('coa')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-600 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Batch COA Hub</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Navigation Sticky Tabs */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'overview', label: '1. Fundamentals & Structure', icon: Dna },
              { id: 'reconstitution', label: '2. Reconstitution Protocol', icon: Droplets },
              { id: 'storage', label: '3. Storage & Stability', icon: ThermometerSnowflake },
              { id: 'calculations', label: '4. Concentration & Conversions', icon: Calculator },
              { id: 'compounds', label: '5. A-Z Compound Directory', icon: FlaskConical },
              { id: 'testing', label: '6. HPLC & Quality Standards', icon: FileCheck2 },
              { id: 'safety', label: '7. Laboratory Safety (RUO)', icon: ShieldCheck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    const el = document.getElementById(`section-${tab.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#335e90] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">

        {/* ========================================================================= */}
        {/* SECTION 1: FUNDAMENTALS & BIOCHEMICAL STRUCTURE */}
        {/* ========================================================================= */}
        <section id="section-overview" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#335e90] flex items-center justify-center font-bold">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">Module 01</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                What are Peptides? Biochemical Fundamentals
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                <strong>Peptides</strong> are biological polymers composed of short chains of amino acid residues linked together by covalent <em>amide (peptide) bonds</em>. Formed through condensation reactions between the carboxyl group (-COOH) of one amino acid and the amino group (-NH<sub>2</sub>) of another, peptides serve as fundamental signaling ligands, neurotransmitters, and hormones in biological systems.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider block">Oligopeptides</span>
                  <p className="text-xs text-slate-600">
                    2 to 20 amino acids (e.g. BPC-157, Epithalon, GHK-Cu). Highly membrane-permeable and specific.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider block">Polypeptides</span>
                  <p className="text-xs text-slate-600">
                    20 to 50 amino acids (e.g. Semaglutide, Tirzepatide, TB-500). Distinct secondary structural folds.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider block">Proteins</span>
                  <p className="text-xs text-slate-600">
                    &gt;50 amino acids (&gt;10 kDa) with complex tertiary and quaternary folded geometries (e.g. HGH 191aa).
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 pt-3">
                Why Are Research Peptides Supplied in Lyophilized Powder Form?
              </h3>
              <p>
                Peptide bonds in liquid solutions are susceptible to <strong>hydrolytic cleavage</strong>, deamidation of glutamine/asparagine residues, and oxidation of methionine/cysteine residues. To maintain stability, pure synthetic peptides are processed via <em>lyophilization</em> (freeze-drying):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li>Deep-freezing removes unbound water without altering the secondary peptide conformation.</li>
                <li>Sublimation under vacuum creates a stable, porous &ldquo;lyophilized cake&rdquo; with &lt;3% residual moisture.</li>
                <li>Protects synthetic chains from thermal and microbial degradation during cold-chain transit.</li>
              </ul>
            </div>

            {/* Quick Stat Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Synthesis &amp; Purity Benchmark</span>
              </div>
              <div className="space-y-3 divide-y divide-slate-800 text-xs">
                <div className="pt-2">
                  <span className="text-slate-400 block">Synthesis Method</span>
                  <span className="text-slate-200 font-semibold">Solid-Phase Peptide Synthesis (Fmoc/t-Bu SPPS)</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 block">Analytical Purity Baseline</span>
                  <span className="text-emerald-400 font-bold text-sm">≥99.0% by RP-HPLC</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 block">Identity Confirmation</span>
                  <span className="text-slate-200 font-semibold">Electrospray Ionization Mass Spectrometry (ESI-MS)</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 block">Standard Format</span>
                  <span className="text-slate-200 font-semibold">Sealed sterile 3mL / 10mL borosilicate glass vials</span>
                </div>
              </div>

              <button
                onClick={() => setActiveView('coa')}
                className="w-full py-2 px-3 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Real Batch HPLC Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 2: STEP-BY-STEP RECONSTITUTION PROTOCOL */}
        {/* ========================================================================= */}
        <section id="section-reconstitution" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Module 02</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  Step-by-Step Peptide Reconstitution Protocol
                </h2>
              </div>
            </div>

            <button
              onClick={() => setActiveView('calculator')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#335e90] hover:underline"
            >
              <span>Calculate exact volume in tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Essential Supplies Checklist */}
          <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#335e90]" />
              <span>Required Sterile Laboratory Supplies</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Lyophilized Peptide Vial</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bacteriostatic Water (0.9% Benzyl Alcohol)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>70% Isopropyl Alcohol Swabs</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sterile Syringes (1mL / U-100 insulin gauge)</span>
              </div>
            </div>
          </div>

          {/* Reconstitution Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Temperature Equilibration',
                desc: 'Allow both the peptide vial and the bacteriostatic water to acclimate to ambient room temperature (20-22°C) for 15-20 minutes before opening. This prevents condensation from forming on the lyophilized cake.',
                caution: 'Do not heat with external heating devices.'
              },
              {
                step: '02',
                title: 'Sanitize Rubber Septums',
                desc: 'Pop off the flip-off protective cap. Vigorously wipe the top rubber stopper of both the peptide vial and the diluent bottle with a sterile 70% IPA swab. Allow 15 seconds to completely air dry.',
                caution: 'Never touch the sterilized rubber septum with unsterile gloves.'
              },
              {
                step: '03',
                title: 'Measure & Draw Diluent',
                desc: 'Draw the calibrated volume of Bacteriostatic Water (typically 1.0 mL to 2.0 mL for 5mg or 10mg vials) into a sterile syringe. Double-check the meniscus line on the barrel.',
                caution: 'Always use sterile, non-pyrogenic syringes.'
              },
              {
                step: '04',
                title: 'Angle Wall Injection',
                desc: 'Insert the syringe needle into the peptide vial at a 45° angle, pointing the needle tip directly against the inner glass sidewall. Slowly depress the plunger, allowing the diluent to trickle down the glass wall.',
                caution: 'CRITICAL: NEVER spray water directly onto the lyophilized powder.'
              },
              {
                step: '05',
                title: 'Gentle Swirl Dissolution',
                desc: 'Gently swirl or roll the vial between your palms in a circular horizontal motion. Allow 2-5 minutes for complete dissolution. TB-500 and Retatrutide may require up to 8 minutes.',
                caution: 'NEVER shake vigorously. Agitation causes foaming & denatures peptide bonds.'
              },
              {
                step: '06',
                title: 'Visual Clarity Inspection & Storage',
                desc: 'Inspect under bright light. The solution must be crystal clear, free of precipitates or cloudiness (with exception of GHK-Cu which is naturally bright blue). Immediately label with date and refrigerate at 2-8°C.',
                caution: 'Discard if cloudiness, discoloration, or suspended flakes persist.'
              }
            ].map(item => (
              <div key={item.step} className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-lg bg-[#335e90] text-white text-xs font-black flex items-center justify-center font-mono-code">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Step</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-display mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 flex items-start gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{item.caution}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bacteriostatic Water vs Sterile Water Explainer */}
          <div className="mt-8 p-5 bg-sky-50/70 rounded-xl border border-sky-200/80">
            <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600" />
              <span>Why Use Bacteriostatic Water Over Plain Sterile Water?</span>
            </h4>
            <p className="text-xs text-sky-950 leading-relaxed">
              <strong>Bacteriostatic Water for Injection (BW)</strong> contains 0.9% (9mg/mL) benzyl alcohol as a bacteriostatic preservative. This preservative inhibits bacterial replication each time a needle penetrates the vial stopper, allowing a multi-dose reconstituted vial to remain microbiologically sterile for <strong>28–30 days</strong> when refrigerated. Plain sterile water contains no preservative and must be discarded within 24 hours of puncture.
            </p>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 3: STORAGE & STABILITY KINETICS */}
        {/* ========================================================================= */}
        <section id="section-storage" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Module 03</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Temperature &amp; Storage Stability Guidelines
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lyophilized vs Reconstituted Table */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Temperature vs. Stability Lifecycle</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">State</th>
                      <th className="p-3">Temperature</th>
                      <th className="p-3">Estimated Stability</th>
                      <th className="p-3">Best Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-slate-900">Lyophilized (Powder)</td>
                      <td className="p-3 text-indigo-600 font-medium">-20°C to -80°C</td>
                      <td className="p-3 font-bold text-emerald-600">24 – 36 Months</td>
                      <td className="p-3">Long-term archive</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">Lyophilized (Powder)</td>
                      <td className="p-3 text-sky-600 font-medium">2°C to 8°C (Fridge)</td>
                      <td className="p-3 font-bold text-emerald-600">12 – 24 Months</td>
                      <td className="p-3">Active research storage</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-slate-900">Lyophilized (Powder)</td>
                      <td className="p-3 text-amber-600 font-medium">20°C to 25°C (Ambient)</td>
                      <td className="p-3 font-semibold text-amber-600">30 – 90 Days</td>
                      <td className="p-3">Express transit window</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-semibold text-[#335e90]">Reconstituted (BW)</td>
                      <td className="p-3 text-sky-600 font-medium">2°C to 8°C (Fridge)</td>
                      <td className="p-3 font-bold text-indigo-600">28 – 35 Days</td>
                      <td className="p-3">Ongoing laboratory assays</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-[#335e90]">Reconstituted (BW)</td>
                      <td className="p-3 text-red-500 font-medium">Ambient &gt;25°C</td>
                      <td className="p-3 font-bold text-red-600">&lt; 48 Hours</td>
                      <td className="p-3">Avoid (Rapid degradation)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Degradation Vectors */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Primary Degradation Vectors to Guard Against
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    1. Freeze-Thaw Cycling
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Repeatedly freezing and thawing reconstituted peptides forms ice crystal shears that cleave peptide bonds. If long-term liquid storage is necessary, aliquot into single-use microcentrifuge tubes before freezing at -20°C.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    2. UV Photolysis &amp; Direct Sunlight
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Ultraviolet photons generate free radicals that oxidize aromatic amino acid residues (Tryptophan, Tyrosine, Phenylalanine). Store all peptide vials in dark amber boxes or opaque packaging.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    3. Mechanical Agitation &amp; Vortexing
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Vigorous shaking creates shear forces at the liquid-air interface, unfolding delicate tertiary structures into inactive aggregate precipitates. Always swirl or gently tilt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 4: CONCENTRATION & SYRINGE UNIT CONVERSIONS */}
        {/* ========================================================================= */}
        <section id="section-calculations" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Module 04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  Concentration Formulas &amp; Syringe Conversion Matrix
                </h2>
              </div>
            </div>

            <button
              onClick={() => setActiveView('calculator')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#335e90] text-white text-xs font-bold hover:bg-[#264a73] transition-colors"
            >
              <span>Full Interactive Calculator</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Mathematical Formulas */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Core Laboratory Calculation Formulas
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono-code text-xs space-y-2 relative">
                  <div className="text-slate-400 text-[11px] font-sans uppercase font-bold tracking-wider">
                    Formula A: Resulting Concentration
                  </div>
                  <div className="text-sky-300 font-bold">
                    Concentration (mg/mL) = Total Vial Mass (mg) ÷ Reconstitution Volume (mL)
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Example: 10 mg ÷ 2.0 mL = 5.0 mg/mL (5,000 mcg/mL)
                  </div>
                  <button 
                    onClick={() => copyToClipboard('Concentration (mg/mL) = Vial Mass (mg) / Diluent Volume (mL)', 'formA')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    title="Copy formula"
                  >
                    {copiedFormula === 'formA' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono-code text-xs space-y-2 relative">
                  <div className="text-slate-400 text-[11px] font-sans uppercase font-bold tracking-wider">
                    Formula B: Syringe Draw Volume (U-100 Gauge)
                  </div>
                  <div className="text-amber-300 font-bold">
                    Syringe Units = (Target Dose in mcg ÷ Concentration in mcg/mL) × 100
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Example: (250 mcg ÷ 5,000 mcg/mL) × 100 = 5 Units on U-100 syringe
                  </div>
                  <button 
                    onClick={() => copyToClipboard('Syringe Units = (Target Dose mcg / Concentration mcg/mL) * 100', 'formB')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    title="Copy formula"
                  >
                    {copiedFormula === 'formB' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Syringe Volume Rule of Thumb */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                  Syringe Calibration Reference (U-100 Standard)
                </span>
                <ul className="space-y-1 text-slate-600 list-disc pl-4">
                  <li><strong>1.0 mL Syringe</strong> = 100 total units (1 unit = 0.01 mL)</li>
                  <li><strong>0.5 mL Syringe</strong> = 50 total units (1 unit = 0.01 mL)</li>
                  <li><strong>0.3 mL Syringe</strong> = 30 total units (1 unit = 0.01 mL, high precision for &lt;200mcg)</li>
                </ul>
              </div>
            </div>

            {/* Embedded Live Mini-Calculator */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1b3552] text-white border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Quick Concentration Verifier
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                  LIVE BENCH TOOL
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Vial Size</label>
                  <select
                    value={calcVialMg}
                    onChange={(e) => setCalcVialMg(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-sky-400"
                  >
                    <option value={2}>2 mg</option>
                    <option value={5}>5 mg</option>
                    <option value={10}>10 mg</option>
                    <option value={15}>15 mg</option>
                    <option value={30}>30 mg</option>
                    <option value={50}>50 mg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Diluent (mL)</label>
                  <select
                    value={calcWaterMl}
                    onChange={(e) => setCalcWaterMl(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-sky-400"
                  >
                    <option value={1}>1.0 mL</option>
                    <option value={2}>2.0 mL</option>
                    <option value={2.5}>2.5 mL</option>
                    <option value={3}>3.0 mL</option>
                    <option value={5}>5.0 mL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Target Dose</label>
                  <input
                    type="number"
                    value={calcTargetMcg}
                    onChange={(e) => setCalcTargetMcg(Number(e.target.value))}
                    step={25}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-sky-400"
                    placeholder="mcg"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-700/60 pb-2">
                  <span className="text-slate-300">Reconstituted Concentration:</span>
                  <span className="font-bold text-sky-400 font-mono-code">
                    {calculatedConcentrationMgMl.toFixed(2)} mg/mL ({calculatedConcentrationMcgPerMl.toLocaleString()} mcg/mL)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-slate-700/60 pb-2">
                  <span className="text-slate-300">Volume Required:</span>
                  <span className="font-bold text-slate-200 font-mono-code">
                    {calculatedDoseMl.toFixed(4)} mL
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-200 font-bold">U-100 Syringe Draw Mark:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-400 font-mono-code">
                      {calculatedSyringeUnits.toFixed(1)} Units
                    </span>
                    <span className="text-[10px] text-slate-400 block">tick mark on 100U barrel</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => setActiveView('calculator')}
                  className="text-xs text-sky-300 hover:text-sky-200 font-semibold underline underline-offset-2 flex items-center justify-center gap-1 mx-auto"
                >
                  <span>Open Advanced Visual Syringe Barrel Simulator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 5: A-Z COMPOUND DIRECTORY & QUICK REFERENCE */}
        {/* ========================================================================= */}
        <section id="section-compounds" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Module 05</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  A-Z Research Peptide Directory &amp; Specifications
                </h2>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search compound, receptor, sequence..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#335e90]"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#335e90] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Classes' : cat}
              </button>
            ))}
          </div>

          {/* Compound Specification Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCompounds.map((comp) => (
              <div
                key={comp.name}
                className="p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wide mb-1">
                      {comp.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {comp.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono-code bg-slate-200/70 text-slate-700 px-2 py-1 rounded font-semibold shrink-0">
                    {comp.typicalVialSize}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  <strong>Focus:</strong> {comp.primaryResearchFocus}
                </p>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Molecular Weight:</span>
                    <span className="font-semibold text-slate-800 font-mono-code">{comp.molecularWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Receptor:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{comp.targetReceptor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Solubility:</span>
                    <span className="font-semibold text-emerald-700">{comp.solubilityNote}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Half-Life:</span>
                    <span className="font-semibold text-indigo-700 font-mono-code">{comp.halfLife}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <button
                    onClick={() => setActiveView('calculator')}
                    className="text-xs font-bold text-[#335e90] hover:underline flex items-center gap-1"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Calculate Draw</span>
                  </button>

                  {comp.productSlug && (
                    <button
                      onClick={() => handleProductNavigate(comp.productSlug!)}
                      className="px-3 py-1.5 rounded-lg bg-[#335e90] hover:bg-[#264a73] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>View in Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCompounds.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500 bg-slate-50 rounded-xl">
              No compounds matching &ldquo;{searchFilter}&rdquo;. Try searching by class or general name.
            </div>
          )}
        </section>


        {/* ========================================================================= */}
        {/* SECTION 6: HPLC & MASS SPECTROMETRY TESTING STANDARDS */}
        {/* ========================================================================= */}
        <section id="section-testing" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Module 06</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Analytical Verification: How to Read a Certificate of Analysis (COA)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1. High-Performance Liquid Chromatography (RP-HPLC)
              </h4>
              <p className="leading-relaxed text-slate-600">
                Measures the percentage area of the primary peptide peak relative to all detected impurities. A laboratory-grade compound must exhibit a sharp, symmetrical retention peak with <strong>≥99.0% area under the curve (AUC)</strong> at 214nm/220nm detection wavelengths.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                2. Electrospray Mass Spectrometry (ESI-MS / MALDI)
              </h4>
              <p className="leading-relaxed text-slate-600">
                Confirms molecular identity by detecting the exact monoisotopic and ionized mass [M+H]+ in Daltons (Da). Verifies that the synthesis sequence is complete and free of truncated or deleted amino acid side-products.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                3. Endotoxin &amp; Bioburden Testing (LAL Assay)
              </h4>
              <p className="leading-relaxed text-slate-600">
                Limulus Amebocyte Lysate (LAL) testing guarantees that bacterial endotoxin levels are below <strong>&lt; 0.05 EU/mg</strong>, preventing pyrogenic or non-specific cytokine activation in downstream cellular cultures.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">Independent Testing Standard</span>
              <p className="text-xs text-slate-300">
                Every batch manufactured for Precision Health Research is quarantined until verified by ISO-17025 accredited third-party analytical laboratories.
              </p>
            </div>
            <button
              onClick={() => setActiveView('coa')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Explore Certificate Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 7: LABORATORY SAFETY & RUO COMPLIANCE */}
        {/* ========================================================================= */}
        <section id="section-safety" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Module 07</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Laboratory Safety Protocols &amp; Research Use Only (RUO) Compliance
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Personal Protective Equipment (PPE)</h4>
              <ul className="space-y-2 list-disc pl-4 text-slate-600">
                <li>Wear nitrile laboratory gloves at all times to prevent skin contact and enzymatic contamination from epidermal RNases/proteases.</li>
                <li>Wear ANSI-certified safety glasses and a laboratory coat when handling liquid solvents or pressure-equalizing needles.</li>
                <li>Perform reconstitution inside a laminar flow clean bench or certified Class II biosafety cabinet whenever possible.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Sharps &amp; Chemical Disposal</h4>
              <ul className="space-y-2 list-disc pl-4 text-slate-600">
                <li>Dispose of all needles, syringes, and punctured vials immediately into an approved puncture-resistant biohazard sharps container.</li>
                <li>Never recap needles with two hands; utilize the one-handed scoop technique if recapping is unavoidably required.</li>
                <li>Treat expired reconstituted solutions as chemical laboratory waste according to institutional biosafety guidelines.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1.5">
            <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Strict Regulatory &amp; Research Compliance Notice
            </span>
            <p>
              All materials, peptides, and biochemical standards documented in this guide are manufactured and sold exclusively for <strong>in-vitro laboratory research and analytical testing purposes</strong>. None of the products are intended for human clinical use, diagnostic procedures, therapeutic application, food additive, or veterinary drug administration.
            </p>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* BOTTOM CTA BAR */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#1b3552] to-[#335e90] text-white rounded-2xl p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold font-display">Ready to Begin Your Laboratory Experiments?</h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Browse our complete catalog of ultra-pure lyophilized peptide sequences with same-day UK dispatch and verified batch certificates of analysis.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => setActiveView('catalog')}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              Explore Research Catalog
            </button>
            <button
              onClick={() => setActiveView('calculator')}
              className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Calculator</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
