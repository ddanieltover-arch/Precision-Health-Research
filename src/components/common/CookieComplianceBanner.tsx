import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CONSENT_PENDING_CLASS = 'cookie-consent-pending';

export const CookieComplianceBanner: React.FC = () => {
  const [accepted, setAccepted] = useState(true); // default hidden until checked
  const { setActiveView } = useStore();

  useEffect(() => {
    const isConsent = localStorage.getItem('phr_cookie_compliance');
    if (!isConsent) {
      setAccepted(false);
    }
  }, []);

  // Keep Smartsupp (z-index: max) under the banner while consent is pending
  useEffect(() => {
    const root = document.documentElement;
    if (accepted) {
      root.classList.remove(CONSENT_PENDING_CLASS);
    } else {
      root.classList.add(CONSENT_PENDING_CLASS);
    }
    return () => root.classList.remove(CONSENT_PENDING_CLASS);
  }, [accepted]);

  const handleAccept = () => {
    localStorage.setItem('phr_cookie_compliance', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div
      id="cookie-compliance-banner"
      role="dialog"
      aria-label="Cookie compliance notice"
      className="fixed bottom-0 inset-x-0 z-[2147483647] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-slate-300 leading-relaxed">
            <strong>Laboratory Data Notice:</strong> Precision Health Research uses essential functional cookies and secure session tokens to facilitate cart management, currency conversion, and analytical COA lookup requests in compliance with scientific data governance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={() => setActiveView('about')}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Learn More
          </button>
          <button
            id="cookie-consent-accept-btn"
            onClick={handleAccept}
            className="px-4 py-2 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl font-bold uppercase tracking-wider text-[11px] shadow-sm transition-colors"
          >
            Acknowledge &amp; Accept
          </button>
        </div>
      </div>
    </div>
  );
};
