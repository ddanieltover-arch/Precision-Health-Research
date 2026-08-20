import React, { useState } from 'react';
import { COA_DATABASE } from '../../data/coas';
import { CertificateOfAnalysis } from '../../types';
import { 
  FileCheck2, 
  Search, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  FlaskConical, 
  CheckCircle2, 
  Eye, 
  X,
  FileText
} from 'lucide-react';

export const CoaLookupHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoa, setSelectedCoa] = useState<CertificateOfAnalysis | null>(null);

  const filteredCoas = COA_DATABASE.filter(
    (coa) =>
      coa.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coa.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coa.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coa.casNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f1d2f] via-[#1b3552] to-[#335e90] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent Third-Party Verification</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
          Certificates of Analysis (COA) Database
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Every batch of research peptides synthesized by Precision Health Research is tested for purity, sequence fidelity, and concentration by accredited independent analytical laboratories (RP-HPLC &amp; LC-MS).
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by lot number (e.g. PHR-TB-2026) or compound name..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>
        </div>
      </div>

      {/* COA Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 font-display">
            Verified Batches ({filteredCoas.length})
          </h2>
          <span className="text-xs text-slate-500">
            Updated August 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoas.map((coa) => (
            <div
              key={coa.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg hover:border-[#335e90]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Top Status */}
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {coa.lotNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {coa.status}
                  </span>
                </div>

                {/* Compound Title */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    {coa.productName}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tested: {coa.testDate}
                  </p>
                </div>

                {/* Analytical Specs */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">HPLC Purity</span>
                    <span className="font-mono-code font-bold text-emerald-600">
                      {coa.purityScore.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Concentration</span>
                    <span className="font-mono-code font-semibold text-slate-800 text-[11px]">
                      {coa.testedConcentration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Testing Lab</span>
                    <span className="text-slate-700 text-[10px] truncate max-w-[140px]">
                      {coa.labName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCoa(coa)}
                  className="flex-1 py-2 px-3 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>

                {coa.documentUrl && (
                  <a
                    href={coa.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Download Official File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View for Inspecting COA */}
      {selectedCoa && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Analytical Verification Report
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                  {selectedCoa.productName}
                </h3>
                <p className="text-xs text-slate-500 font-mono-code">
                  Batch Lot: {selectedCoa.lotNumber} &bull; Lab: {selectedCoa.labName}
                </p>
              </div>

              <button
                onClick={() => setSelectedCoa(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Results Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Assay Purity</span>
                <span className="text-lg font-black text-emerald-600 font-mono-code block mt-0.5">
                  {selectedCoa.purityScore.toFixed(2)}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Method</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">
                  {selectedCoa.testMethod}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Test Date</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">
                  {selectedCoa.testDate}
                </span>
              </div>
            </div>

            {/* COA Preview Image / Document */}
            {selectedCoa.previewUrl && (
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 p-2 text-center">
                <img
                  src={selectedCoa.previewUrl}
                  alt={`COA for ${selectedCoa.productName}`}
                  referrerPolicy="no-referrer"
                  className="max-h-96 mx-auto object-contain rounded-xl shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/coas/phr-tb-500-10mg-coa.png';
                  }}
                />
              </div>
            )}

            {/* Compliance Guarantee Notice */}
            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              This Certificate of Analysis certifies that the sample submitted from Batch {selectedCoa.lotNumber} meets or exceeds all chemical purity, solubility, and identification criteria for academic and laboratory research protocols.
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCoa(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Viewer
              </button>

              {selectedCoa.documentUrl && (
                <a
                  href={selectedCoa.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#335e90] hover:bg-[#264a73] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full PDF Report</span>
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
