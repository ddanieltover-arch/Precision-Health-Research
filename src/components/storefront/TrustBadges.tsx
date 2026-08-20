import React from 'react';
import { ShieldCheck, Truck, Microchip, FileCheck, Award, Zap } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#335e90] flex items-center justify-center shrink-0 border border-sky-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                &ge;99% Analytical Purity
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Every lot verified via reverse-phase HPLC &amp; Mass Spectrometry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Academic Standard
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Pure lyophilized reference compounds manufactured for scientific assays.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cold-Chain Packaging
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Insulated thermal packing ensures biological peptide stability during transit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Same-Day UK Dispatch
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Shipped directly from our UK hub via Royal Mail Tracked 24.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
