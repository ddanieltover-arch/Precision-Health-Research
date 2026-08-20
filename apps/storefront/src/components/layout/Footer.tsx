import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { 
  FlaskConical, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Lock,
  Truck,
  CreditCard
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { addToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes('@')) {
      addToast('Invalid Email', 'Please enter a valid academic/research email address.', 'warning');
      return;
    }
    addToast('Subscribed', 'You will receive batch synthesis updates and new compound alerts.', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-800">
      {/* Upper Lab Highlights & Security */}
      <div className="border-b border-slate-800/80 bg-[#090d16] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Third-Party HPLC Tested
              </h4>
              <p className="text-xs text-slate-400">
                Purity verified &gt;99% on every lot via independent laboratory assays.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cold-Chain UK Dispatch
              </h4>
              <p className="text-xs text-slate-400">
                Royal Mail Tracked 24 thermal packaging within 24h.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Encrypted Checkout
              </h4>
              <p className="text-xs text-slate-400">
                UK Bank Transfer (Faster Payments) &amp; Crypto (-5% discount).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Synthesis Guarantee
              </h4>
              <p className="text-xs text-slate-400">
                Free batch replacement if purity tests fall below spec.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-md border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src="/precision-logo.jpg" 
                  alt="Precision Health Research Logo" 
                  referrerPolicy="no-referrer"
                  className="w-[175%] h-[175%] max-w-none object-contain"
                />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight font-display">
                  Precision Health Research
                </span>
                <p className="text-[11px] text-slate-400">
                  Analytical Compound &amp; Peptide Synthesis
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Precision Health Research supplies analytical-grade lyophilized peptides, biochemical standards, and laboratory supplies exclusively to qualified academic, scientific, and industrial research institutions.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
                Subscribe for New Batch Release Alerts
              </span>
              <form onSubmit={handleNewsletter} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter researcher email..."
                  className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#335e90]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Research Catalog
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  All Research Peptides
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  Metabolic &amp; GLP-1 Analogs
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  Synergistic Blends
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  Bacteriostatic Water &amp; Solvents
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  Cold-Chain Portable Coolers
                </Link>
              </li>
            </ul>
          </div>

          {/* Laboratory Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Scientific Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/guide" className="hover:text-white transition-colors text-emerald-400 font-semibold">
                  Complete Peptide Guide &amp; Protocols
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white transition-colors text-sky-400 font-semibold">
                  Peptide Reconstitution Calculator
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors text-amber-400 font-semibold">
                  Biochemical Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors text-sky-300 font-semibold">
                  Track Laboratory Shipment
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-white transition-colors">
                  Scientific Research Monographs
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Reconstitution &amp; Storage Protocols
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Quality Assurance Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Facility */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Laboratory Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>UK Laboratory &amp; Research Distribution Hub, United Kingdom</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:info@ph-research.store" className="hover:text-white transition-colors">
                  info@ph-research.store
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+17184047594" className="hover:text-white transition-colors">
                  +1 (718) 404-7594
                </a>
              </li>
              <li className="pt-1">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 font-mono-code">
                  www.ph-research.store
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Regulatory Disclaimer Box */}
        <div className="mt-12 p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Research &amp; Laboratory Compliance Notice</span>
          </div>
          <p>
            All products supplied by <strong>Precision Health Research</strong> are intended strictly for <em>in-vitro</em> laboratory research, analytical testing, and scientific investigation by qualified research personnel. None of the products sold on this website are intended for human consumption, clinical diagnostic purposes, veterinary application, or therapeutic use. Buyers must be at least 21 years of age and affiliated with a legitimate laboratory or research program.
          </p>
        </div>

          {/* Copyright and Bottom Links */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Precision Health Research. All rights reserved. Registered UK Research Supplier.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link to="/terms" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
              <span>&bull;</span>
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link to="/refunds" className="hover:text-slate-300 transition-colors">
                Refund &amp; Replacements
              </Link>
              <span>&bull;</span>
              <Link to="/quality" className="hover:text-slate-300 transition-colors">
                Quality &amp; Testing
              </Link>
              <span>&bull;</span>
              <Link to="/shipping" className="hover:text-slate-300 transition-colors">
                Shipping Policy
              </Link>
              <span>&bull;</span>
              <Link to="/contact" className="hover:text-slate-300 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
      </div>
    </footer>
  );
};
