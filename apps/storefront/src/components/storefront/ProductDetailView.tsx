import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/catalog';
import { ProductImage } from '../common/ProductImage';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Calculator, 
  ShieldCheck, 
  Truck, 
  Check, 
  Copy,
  FlaskConical,
  Dna,
  ThermometerSnowflake,
  Package,
  Layers,
  AlertCircle,
  Award
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { slug } = useParams();
  const { 
    selectedProduct, 
    setActiveView, 
    addToCart, 
    formatPrice, 
    openCalculatorWithProduct,
    addToast,
    openProductDetail,
  } = useStore();

  const product =
    selectedProduct ||
    PRODUCTS.find((p) => p.slug === slug || p.id === slug) ||
    null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedSeq, setCopiedSeq] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedVariantId(product.variants[0]?.id || '');
    setQuantity(1);
    setCopiedSeq(false);
    setIsAdded(false);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-500">No compound selected.</p>
        <button
          onClick={() => setActiveView('catalog')}
          className="mt-4 px-4 py-2 bg-[#335e90] text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const unitPrice = product.basePrice + (currentVariant?.priceModifier || 0);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, currentVariant?.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const copySequence = () => {
    if (product.sequence) {
      navigator.clipboard.writeText(product.sequence);
      setCopiedSeq(true);
      addToast('Copied', 'Amino acid sequence copied to clipboard', 'info');
      setTimeout(() => setCopiedSeq(false), 2000);
    }
  };

  // Related products from the same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => setActiveView('catalog')}
          className="hover:text-[#335e90] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </button>
        <span>/</span>
        <span className="text-slate-700 font-medium">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Grid: Gallery & Order Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Product Visual Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl border border-slate-200/90 p-8 flex items-center justify-center overflow-hidden shadow-xs">
            {/* Purity Banner Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-sky-300 text-xs font-black uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                HPLC PURITY: {product.purity}
              </span>
            </div>

            <ProductImage
              key={product.id}
              src={product.thumbnailUrl}
              productId={product.id}
              alt={product.name}
              purity={product.purity}
              priority={true}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] hover:scale-105 transition-transform duration-500"
              containerClassName="w-full h-full"
            />
          </div>

          {/* Trust Highlights Under Image */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-center text-xs">
            <div className="flex flex-col items-center p-2">
              <ThermometerSnowflake className="w-4 h-4 text-[#335e90] mb-1" />
              <span className="font-bold text-slate-800 text-[11px]">Cold-Chain Packed</span>
              <span className="text-[10px] text-slate-500">Thermal Shield</span>
            </div>
            <div className="flex flex-col items-center p-2 border-x border-slate-200">
              <Award className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-bold text-slate-800 text-[11px]">HPLC Analytical</span>
              <span className="text-[10px] text-slate-500">Purity &ge;99%</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <Truck className="w-4 h-4 text-indigo-600 mb-1" />
              <span className="font-bold text-slate-800 text-[11px]">UK Lab Dispatch</span>
              <span className="text-[10px] text-slate-500">Same-Day Mon-Fri</span>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#335e90] uppercase tracking-wider mb-1.5">
              <span>{product.category}</span>
              {product.casNumber && (
                <>
                  <span>&bull;</span>
                  <span className="font-mono-code text-slate-500">CAS: {product.casNumber}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variant / Strength Selector */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Select Strength / Quantity Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariantId === v.id;
                const vPrice = product.basePrice + v.priceModifier;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#335e90] bg-sky-50/50 ring-2 ring-[#335e90]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{v.value}</div>
                      <div className="text-[10px] text-slate-500 font-mono-code mt-0.5">{v.sku}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#335e90]">
                        {formatPrice(vPrice)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Add to Cart action bar */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-display">
                    {formatPrice(totalPrice)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-slate-500">
                      ({formatPrice(unitPrice)} each)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <Check className="w-3.5 h-3.5" />
                  Ready to Dispatch
                </span>
                <span className="text-[10px] text-slate-400">Lot: PHR-2026-08</span>
              </div>
            </div>

            {/* Crypto 5% Instant Discount Highlight Banner */}
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50/80 border border-emerald-200/90 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-950">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs">
                  ₿
                </span>
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <span>Pay with Crypto &amp; Save 5%</span>
                    <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                      5% OFF
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-700">
                    Instant 5% discount applied for Bitcoin (BTC) payments
                  </p>
                </div>
              </div>
              <div className="text-right pl-2 border-l border-emerald-200/80 shrink-0">
                <span className="text-[10px] text-slate-500 block">Crypto Price:</span>
                <span className="text-xs font-black text-emerald-700 font-mono-code">
                  {formatPrice(totalPrice * 0.95)}
                </span>
              </div>
            </div>

            {/* Quantity and CTA */}
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                id="pdp-add-to-cart"
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-[#335e90] hover:bg-[#264a73] text-white shadow-[#335e90]/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Laboratory Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Tool Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => openCalculatorWithProduct(product)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5 text-sky-600" />
                <span>Reconstitution Calc</span>
              </button>

              <button
                onClick={() => setActiveView('compare')}
                className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compare Matrix</span>
              </button>
            </div>
          </div>

          {/* Research Compliance Disclaimer */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>In-Vitro Research Notice:</strong> For laboratory experimentation, chemical synthesis assays, and receptor binding research only. Not for clinical, therapeutic, or veterinary administration.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#335e90]" />
          <span>Biochemical &amp; Analytical Specifications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              CAS Registry Number
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono-code mt-1 block">
              {product.casNumber || 'Confidential / Custom'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Molecular Weight
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono-code mt-1 block">
              {product.molecularWeight || 'N/A'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Verified HPLC Purity
            </span>
            <span className="text-sm font-bold text-emerald-600 font-mono-code mt-1 block">
              {product.purity}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Recommended Storage
            </span>
            <span className="text-xs font-semibold text-slate-800 mt-1 block">
              -20&deg;C Lyophilized (Desiccated)
            </span>
          </div>
        </div>

        {/* Amino Acid Sequence block */}
        {product.sequence && (
          <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5" />
                <span>Primary Amino Acid Sequence</span>
              </span>
              <button
                onClick={copySequence}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copiedSeq ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSeq ? 'Copied' : 'Copy Sequence'}</span>
              </button>
            </div>
            <p className="font-mono-code text-xs text-slate-300 break-all leading-relaxed">
              {product.sequence}
            </p>
          </div>
        )}
      </div>

      {/* Related Compounds */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
              Related Research Compounds
            </h3>
            <button
              onClick={() => setActiveView('catalog')}
              className="text-xs font-bold text-[#335e90] hover:underline"
            >
              View Full Catalog &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => openProductDetail(p)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#335e90]/40 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
              >
                <ProductImage
                  src={p.thumbnailUrl}
                  productId={p.id}
                  alt={p.name}
                  purity={p.purity}
                  className="w-14 h-14 object-contain rounded-xl bg-slate-50 p-1 group-hover:scale-105 transition-transform"
                  containerClassName="w-14 h-14 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#335e90]">
                    {p.name}
                  </h4>
                  <span className="text-xs font-extrabold text-[#335e90] block mt-1">
                    {formatPrice(p.basePrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
