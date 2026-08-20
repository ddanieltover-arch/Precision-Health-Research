import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { 
  ShoppingBag, 
  Calculator, 
  Eye, 
  ShieldCheck, 
  Check,
  FlaskConical
} from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { 
    addToCart, 
    formatPrice, 
    openProductDetail, 
    openCalculatorWithProduct,
    setActiveView 
  } = useStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const currentPrice = product.basePrice + (currentVariant?.priceModifier || 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, currentVariant?.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      onClick={() => openProductDetail(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-900/8 hover:border-[#335e90]/40 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-300 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          {product.purity}
        </span>

        {product.badges && product.badges.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#335e90] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
            {product.badges[0]}
          </span>
        )}
      </div>

      {/* Image container */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 flex items-center justify-center overflow-hidden">
        <ProductImage
          src={product.thumbnailUrl}
          productId={product.id}
          alt={product.name}
          purity={product.purity}
          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-108 transition-transform duration-500"
          containerClassName="w-full h-full"
        />

        {/* Hover quick action overlay buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product);
            }}
            title="Inspect compound specifications"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 hover:text-[#335e90] hover:bg-white shadow-md border border-slate-200 transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>

          {product.reconstitutionVolMl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openCalculatorWithProduct(product);
              }}
              title="Calculate reconstitution and dose"
              className="px-2.5 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 hover:text-sky-600 hover:bg-white shadow-md border border-slate-200 transition-all flex items-center gap-1 text-[11px] font-bold"
            >
              <Calculator className="w-3.5 h-3.5 text-sky-600" />
              <span>Dose Calc</span>
            </button>
          )}
        </div>
      </div>

      {/* Content details */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        
        {/* Category tag & CAS */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
          <span className="text-[#335e90] font-semibold">{product.category}</span>
          {product.casNumber && (
            <span className="font-mono-code text-[10px] text-slate-400">
              CAS {product.casNumber.split('/')[0].trim()}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#335e90] transition-colors line-clamp-2 leading-snug font-display">
          {product.name}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.shortDesc}
        </p>

        {/* Strength / Variant Pills */}
        {product.variants.length > 1 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.variants.slice(0, 3).map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'bg-[#335e90] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {variant.value.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {formatPrice(currentPrice)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.comparePrice + (currentVariant?.priceModifier || 0))}
                </span>
              )}
            </div>

            {/* 5% Crypto Price & Discount Badge */}
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-700 font-semibold">
              <span className="text-slate-500 font-normal">Crypto:</span>
              <span className="font-mono-code font-bold text-emerald-700">{formatPrice(currentPrice * 0.95)}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1 rounded">
                -5%
              </span>
            </div>

            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              In Stock (UK Lab)
            </span>
          </div>

          <button
            id={`add-to-cart-btn-${product.slug}`}
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#335e90] hover:bg-[#264a73] text-white shadow-sm shadow-[#335e90]/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
