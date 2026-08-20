import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, AlertTriangle, FlaskConical, CheckCircle2 } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { ageVerified, setAgeVerified, addToast } = useStore();

  if (ageVerified) return null;

  const handleAccept = () => {
    setAgeVerified(true);
    addToast('Verified', 'Welcome to Precision Health Research laboratory portal.', 'success');
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Official Logo Brand Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-white p-0.5 flex items-center justify-center mx-auto border border-slate-200 shadow-md overflow-hidden">
          <img 
            src="/precision-logo.jpg" 
            alt="Precision Health Research Logo" 
            referrerPolicy="no-referrer"
            className="w-[175%] h-[175%] max-w-none object-contain"
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#335e90] uppercase tracking-wider">
            Laboratory Access Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            Precision Health Research
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            This storefront contains analytical research compounds, synthetic peptide sequences, and laboratory reagents intended solely for qualified researchers and scientific institutions.
          </p>
        </div>

        {/* Compliance Box */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-left text-xs text-amber-900 space-y-1.5 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Strict In-Vitro Research Restriction</span>
          </div>
          <p className="text-[11px] text-amber-900/90">
            All chemicals are sold exclusively for in-vitro research, assay calibration, and chemical analysis. Products are <strong>NOT for human consumption</strong>, veterinary use, or therapeutic diagnostics. You must be 21+ to proceed.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDecline}
            className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            I am Under 21 / Decline
          </button>

          <button
            id="age-verify-accept-btn"
            onClick={handleAccept}
            className="py-3 px-4 rounded-xl bg-[#335e90] hover:bg-[#264a73] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#335e90]/30 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Agree &amp; Enter (21+)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
