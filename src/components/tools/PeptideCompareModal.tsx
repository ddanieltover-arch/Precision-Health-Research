import React, { useState } from 'react';
import { PRODUCTS } from '../../data/catalog';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { 
  X, 
  Layers, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Calculator, 
  FileCheck2, 
  Check,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';

export const PeptideCompareModal: React.FC = () => {
  const { 
    formatPrice, 
    addToCart, 
    openCalculatorWithProduct,
    setSelectedProduct,
    setActiveView 
  } = useStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([
    'bpc-157',
    'tb-500',
    'tirzepatide',
  ]);

  const selectedProducts: Product[] = selectedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const availableProducts = PRODUCTS.filter((p) => !selectedIds.includes(p.id));

  const addProductToCompare = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeProductFromCompare = (id: string) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f1d2f] via-[#1b3552] to-[#335e90] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Biochemical Comparison Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
          Compare Research Compounds
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Compare analytical parameters, CAS numbers, molecular weights, verified purity, and reconstitution profiles side-by-side.
        </p>

        {/* Add compound selector */}
        {selectedIds.length < 4 && (
          <div className="pt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-300 font-semibold">Add to matrix:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addProductToCompare(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 outline-none focus:border-sky-400"
            >
              <option value="" disabled>Choose compound to compare...</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      {selectedProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <FlaskConical className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No compounds in comparison</h3>
          <p className="text-xs text-slate-500">Select compounds above to compare their properties.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs">
            
            {/* Header Row with Images & Names */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 text-left font-bold text-slate-500 uppercase tracking-wider w-44">
                  Compound
                </th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="p-4 text-left font-normal min-w-[200px]">
                    <div className="space-y-2 relative">
                      {selectedProducts.length > 1 && (
                        <button
                          onClick={() => removeProductFromCompare(p.id)}
                          className="absolute -top-1 -right-1 text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <ProductImage
                        src={p.thumbnailUrl}
                        productId={p.id}
                        alt={p.name}
                        purity={p.purity}
                        className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-slate-200"
                        containerClassName="w-16 h-16"
                      />
                      <h4 className="font-extrabold text-slate-900 text-xs line-clamp-2 font-display">
                        {p.name}
                      </h4>
                      <span className="text-sm font-black text-[#335e90] block">
                        {formatPrice(p.basePrice)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Properties */}
            <tbody className="divide-y divide-slate-100">
              
              {/* Category */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Category</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-slate-800">
                    {p.category}
                  </td>
                ))}
              </tr>

              {/* Verified Purity */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/30">HPLC Purity</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono-code font-bold text-emerald-600">
                    {p.purity}
                  </td>
                ))}
              </tr>

              {/* CAS Registry */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/30">CAS Number</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono-code text-slate-700">
                    {p.casNumber || 'Custom Synthetic'}
                  </td>
                ))}
              </tr>

              {/* Molecular Weight */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Molecular Weight</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono-code text-slate-700">
                    {p.molecularWeight || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Recommended Reconstitution */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Standard Volume</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    {p.reconstitutionVolMl ? `${p.reconstitutionVolMl} mL Bacteriostatic Water` : 'Solvent Variable'}
                  </td>
                ))}
              </tr>

              {/* Recommended Storage */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Storage Protocol</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-600 text-[11px] leading-relaxed">
                    {p.storage}
                  </td>
                ))}
              </tr>

              {/* Actions Row */}
              <tr className="bg-slate-50/50">
                <td className="p-4 font-bold text-slate-500">Actions</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 space-y-2">
                    <button
                      onClick={() => addToCart(p, p.variants[0]?.id, 1)}
                      className="w-full py-2 px-3 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => openCalculatorWithProduct(p)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-sky-50 text-slate-700 hover:text-[#335e90] border border-slate-200 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Calculator className="w-3 h-3 text-[#335e90]" />
                      <span>Calc Dosing</span>
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
