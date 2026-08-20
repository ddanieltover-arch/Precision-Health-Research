import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Microscope, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

export const PeptideResearchLibrarySection: React.FC = () => {
  const { setActiveView } = useStore();

  const libraryCards = [
    {
      id: 'bpc-157-repair',
      title: 'BPC-157 & REPAIR SIGNALLING',
      desc: 'Extracellular matrix, angiogenesis, and focal-adhesion themes common in preclinical peptide work.',
      category: 'Tissue Regeneration',
    },
    {
      id: 'tb-500-thymosin',
      title: 'TB-500 / THYMOSIN BETA-4 CLASS',
      desc: 'Actin dynamics, migration assays, and cytoskeletal readouts — how the literature frames fragments.',
      category: 'Actin Modulation',
    },
    {
      id: 'glp-1-pharmacology',
      title: 'GLP-1 RECEPTOR PHARMACOLOGY',
      desc: 'Metabolic incretin pathways, gastric motility, and energy-balance models in controlled studies.',
      category: 'Incretin Biology',
    },
    {
      id: 'ghk-cu-copper',
      title: 'GHK-CU & COPPER PEPTIDES',
      desc: 'Copper-binding motifs, extracellular matrix biology, and regeneration-adjacent in-vitro angles.',
      category: 'Matrix & Dermal',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="text-[11px] font-extrabold text-[#335e90] uppercase tracking-[0.2em]">
            EDUCATIONAL RESOURCES
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f1d2f] tracking-tight font-display uppercase">
            PEPTIDE RESEARCH LIBRARY
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Summaries, mechanisms, and literature-oriented notes for qualified researchers — not medical advice. Explore full compound specifications and our{' '}
            <button
              onClick={() => setActiveView('catalog')}
              className="font-bold text-slate-900 underline hover:text-[#335e90] transition-colors"
            >
              catalogue
            </button>
            .
          </p>
        </div>

        {/* Explore Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveView('guide')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#335e90] hover:bg-[#264a73] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 group"
          >
            <BookOpen className="w-4 h-4 text-sky-300" />
            <span>PEPTIDE GUIDE</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setActiveView('research')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#0f1d2f] text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:border-slate-400 group"
          >
            <Microscope className="w-4 h-4 text-[#335e90]" />
            <span>RESEARCH MONOGRAPHS</span>
          </button>
        </div>
      </div>

      {/* 4 Cards Grid matching uploaded design */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {libraryCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setActiveView('research')}
            className="group cursor-pointer bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-[#335e90]/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Microscope Icon */}
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#335e90] flex items-center justify-center group-hover:bg-[#335e90] group-hover:text-white transition-colors">
                <Microscope className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug uppercase group-hover:text-[#335e90] transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {card.desc}
              </p>
            </div>

            {/* Read Briefs Link */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-[#0f1d2f] group-hover:text-[#335e90] transition-colors">
                <span>READ BRIEFS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
