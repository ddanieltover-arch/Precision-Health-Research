import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Calculator, 
  FlaskConical, 
  Droplet, 
  Target, 
  Info, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const PeptideCalculator: React.FC = () => {
  const { calcPrefill, addToast } = useStore();

  const [peptideMg, setPeptideMg] = useState<number>(calcPrefill?.peptideMg || 5);
  const [waterMl, setWaterMl] = useState<number>(calcPrefill?.waterMl || 2.0);
  const [doseMcg, setDoseMcg] = useState<number>(calcPrefill?.doseMcg || 250);
  const [syringeType, setSyringeType] = useState<'u100-30' | 'u100-50' | 'u100-100' | 'u40'>('u100-100');

  // Update if prefill changes
  useEffect(() => {
    if (calcPrefill) {
      setPeptideMg(calcPrefill.peptideMg);
      setWaterMl(calcPrefill.waterMl);
      setDoseMcg(calcPrefill.doseMcg);
    }
  }, [calcPrefill]);

  // Mathematical calculations
  // Total peptide in mcg = peptideMg * 1000
  const totalPeptideMcg = peptideMg * 1000;
  // Concentration in mcg/ml = totalPeptideMcg / waterMl
  const concentrationMcgPerMl = waterMl > 0 ? totalPeptideMcg / waterMl : 0;
  // Concentration in mg/ml = peptideMg / waterMl
  const concentrationMgPerMl = waterMl > 0 ? peptideMg / waterMl : 0;
  
  // Volume to draw in ml = doseMcg / concentrationMcgPerMl
  const doseMl = concentrationMcgPerMl > 0 ? doseMcg / concentrationMcgPerMl : 0;

  // Syringe calculations
  // U-100 means 100 units = 1.0 ml -> 1 unit = 0.01 ml
  // U-40 means 40 units = 1.0 ml -> 1 unit = 0.025 ml
  const isU40 = syringeType === 'u40';
  const unitsPerMl = isU40 ? 40 : 100;
  const syringeUnits = doseMl * unitsPerMl;

  const syringeCapacityUnits = 
    syringeType === 'u100-30' ? 30 :
    syringeType === 'u100-50' ? 50 :
    syringeType === 'u100-100' ? 100 : 40;

  // Doses per vial
  const totalDoses = doseMcg > 0 ? Math.floor(totalPeptideMcg / doseMcg) : 0;

  // Visual fill percentage (capped at 100%)
  const fillPercentage = Math.min(100, Math.max(0, (syringeUnits / syringeCapacityUnits) * 100));

  const resetDefaults = () => {
    setPeptideMg(5);
    setWaterMl(2.0);
    setDoseMcg(250);
    setSyringeType('u100-100');
    addToast('Calculator Reset', 'Restored default 5mg / 2ml / 250mcg benchmark parameters', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f1d2f] via-[#1b3552] to-[#335e90] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Laboratory Dosing Tool</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
            Peptide Reconstitution &amp; Dosage Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Calculate accurate volumetric concentrations, reconstitution ratios, and syringe unit tick marks for any lyophilized peptide vial.
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Reset to defaults"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Main Grid: Controls vs Visual Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Parameter Sliders and Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Peptide Quantity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#335e90] text-white text-[11px] font-black flex items-center justify-center">1</span>
                <span>Vial Peptide Quantity (mg)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.1"
                  max="1000"
                  step="0.5"
                  value={peptideMg}
                  onChange={(e) => setPeptideMg(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2.5 py-1 text-right text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg outline-none focus:border-[#335e90]"
                />
                <span className="text-xs font-bold text-slate-500">mg</span>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[2, 5, 10, 15, 20, 30, 50, 60].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setPeptideMg(mg)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    peptideMg === mg
                      ? 'bg-[#335e90] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mg} mg
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Bacteriostatic Water Added */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#335e90] text-white text-[11px] font-black flex items-center justify-center">2</span>
                <span>Bacteriostatic Water Added (mL)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={waterMl}
                  onChange={(e) => setWaterMl(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2.5 py-1 text-right text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg outline-none focus:border-[#335e90]"
                />
                <span className="text-xs font-bold text-slate-500">mL</span>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1.0, 2.0, 2.5, 3.0, 5.0, 10.0].map((ml) => (
                <button
                  key={ml}
                  onClick={() => setWaterMl(ml)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    waterMl === ml
                      ? 'bg-[#335e90] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {ml} mL
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Desired Research Dose */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#335e90] text-white text-[11px] font-black flex items-center justify-center">3</span>
                <span>Desired Research Dose</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="10"
                  max="50000"
                  step="50"
                  value={doseMcg}
                  onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2.5 py-1 text-right text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg outline-none focus:border-[#335e90]"
                />
                <span className="text-xs font-bold text-slate-500">mcg</span>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[100, 250, 500, 1000, 2500, 5000].map((mcg) => (
                <button
                  key={mcg}
                  onClick={() => setDoseMcg(mcg)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    doseMcg === mcg
                      ? 'bg-[#335e90] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mcg >= 1000 ? `${mcg / 1000} mg` : `${mcg} mcg`}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Syringe Barrel Type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#335e90] text-white text-[11px] font-black flex items-center justify-center">4</span>
              <span>Select Laboratory Syringe Type</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'u100-30', label: 'U-100 (0.3 mL)', sub: '30 Units Max' },
                { id: 'u100-50', label: 'U-100 (0.5 mL)', sub: '50 Units Max' },
                { id: 'u100-100', label: 'U-100 (1.0 mL)', sub: '100 Units Max' },
                { id: 'u40', label: 'U-40 (1.0 mL)', sub: '40 Units Max' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSyringeType(s.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    syringeType === s.id
                      ? 'border-[#335e90] bg-sky-50/60 ring-2 ring-[#335e90]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{s.label}</div>
                  <div className="text-[10px] text-slate-500">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Visual Syringe & Calculation Results */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Calculation Result Card */}
          <div className="bg-gradient-to-b from-[#1b3552] to-[#0f1d2f] text-white rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Measurement Result
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Formula Verified
              </span>
            </div>

            {/* Primary Draw Metric */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pull Plunger To Tick Mark:
              </span>
              <div className="text-4xl sm:text-5xl font-black text-sky-400 font-display">
                {syringeUnits.toFixed(1)} <span className="text-2xl font-bold text-slate-200">Units</span>
              </div>
              <p className="text-xs text-slate-400">
                Volumetric Draw: <span className="font-bold text-white">{doseMl.toFixed(3)} mL</span> ({doseMcg} mcg)
              </p>
            </div>

            {/* Interactive Visual Syringe */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>0 Units</span>
                <span className="text-sky-300 font-bold">{syringeUnits.toFixed(1)} Units Drawn</span>
                <span>{syringeCapacityUnits} Units</span>
              </div>

              {/* Syringe Barrel Graphic */}
              <div className="relative h-10 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 p-1 flex items-center">
                {/* Tick lines */}
                <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-30">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="w-[1px] h-full bg-white"></div>
                  ))}
                </div>

                {/* Liquid Fill */}
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg transition-all duration-300 relative shadow-sm"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40"></div>
                </div>
              </div>

              {syringeUnits > syringeCapacityUnits && (
                <p className="text-[11px] text-rose-400 font-semibold text-center mt-1">
                  &Delta; Warning: Dose exceeds single-draw syringe capacity ({syringeCapacityUnits} Units).
                </p>
              )}
            </div>

            {/* Sub-Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/80 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Concentration</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {concentrationMgPerMl.toFixed(2)} mg/mL
                </span>
                <span className="text-[10px] text-slate-400">({concentrationMcgPerMl.toFixed(0)} mcg/mL)</span>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Doses Per Vial</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {totalDoses} doses
                </span>
                <span className="text-[10px] text-slate-400">at {doseMcg} mcg/dose</span>
              </div>
            </div>

          </div>

          {/* Laboratory Protocol Guide Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#335e90]" />
              <span>Standard Laboratory Protocol</span>
            </h4>
            <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-4 leading-relaxed">
              <li>Clean the rubber septum with a sterile 70% isopropanol swab and allow to air dry.</li>
              <li>Inject {waterMl} mL of Bacteriostatic Water slowly along the inner glass wall to prevent shearing the peptide chain.</li>
              <li>Swirl gently in circular motion until completely dissolved. <strong>Do not agitate or shake vigorously.</strong></li>
              <li>Store reconstituted solution at 2&deg;C to 8&deg;C (protect from direct light).</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
};
