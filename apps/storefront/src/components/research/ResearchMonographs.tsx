import React, { useState } from 'react';
import { RESEARCH_MONOGRAPHS } from '../../data/research';
import { useStore } from '../../context/StoreContext';
import { 
  BookOpen, 
  Dna, 
  FlaskConical, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2,
  FileText,
  Calculator
} from 'lucide-react';

export const ResearchMonographs: React.FC = () => {
  const { setActiveView } = useStore();
  const [selectedPaper, setSelectedPaper] = useState(RESEARCH_MONOGRAPHS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f1d2f] via-[#1b3552] to-[#335e90] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific Literature &amp; Research Monographs</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
          Peptide Mechanisms &amp; Cellular Pathways
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive biochemical documentation, receptor affinities, published scientific citations, and molecular characteristics for laboratory investigation.
        </p>
      </div>

      {/* Two Column Layout: Papers List & Active Monograph Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Monograph Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Available Monographs ({RESEARCH_MONOGRAPHS.length})
          </h3>

          <div className="space-y-2">
            {RESEARCH_MONOGRAPHS.map((m) => {
              const isSelected = selectedPaper.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedPaper(m)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-sky-50/80 border-[#335e90] ring-2 ring-[#335e90]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#335e90] uppercase tracking-wider block mb-1">
                    {m.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {m.title}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Quick Calculator Card */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 mt-6">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              <span>Laboratory Dose Utility</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need to calculate microgram volumetric measurements for cell culture experiments?
            </p>
            <button
              onClick={() => setActiveView('calculator')}
              className="w-full py-2 bg-[#335e90] hover:bg-[#264a73] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Open Reconstitution Calculator
            </button>
          </div>
        </div>

        {/* Right: Active Monograph Detail */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div>
            <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
              {selectedPaper.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display mt-1">
              {selectedPaper.title}
            </h2>
          </div>

          {/* Abstract */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Scientific Abstract
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedPaper.abstract}
            </p>
          </div>

          {/* Key In-Vitro Findings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Key Biological Mechanisms &amp; Assay Observations</span>
            </h4>
            <ul className="space-y-2">
              {selectedPaper.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <span className="w-4 h-4 rounded-full bg-[#335e90]/10 text-[#335e90] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Molecular Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">CAS Number</span>
              <span className="text-xs font-mono-code font-bold text-slate-900 mt-0.5 block">{selectedPaper.molecularDetails.cas}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Formula</span>
              <span className="text-xs font-mono-code font-bold text-slate-900 mt-0.5 block">{selectedPaper.molecularDetails.formula}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Molecular Wt</span>
              <span className="text-xs font-mono-code font-bold text-slate-900 mt-0.5 block">{selectedPaper.molecularDetails.weight}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">HPLC Purity</span>
              <span className="text-xs font-mono-code font-bold text-emerald-600 mt-0.5 block">{selectedPaper.molecularDetails.purity}</span>
            </div>
          </div>

          {/* Reconstitution Notes */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-1">
            <h4 className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
              Reconstitution Guidelines
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedPaper.reconstitutionNotes}
            </p>
          </div>

          {/* Published References */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Academic Literature References
            </h4>
            <ul className="space-y-1.5">
              {selectedPaper.references.map((ref, idx) => (
                <li key={idx} className="text-[11px] text-slate-500 italic pl-3 border-l-2 border-slate-200">
                  {ref}
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
