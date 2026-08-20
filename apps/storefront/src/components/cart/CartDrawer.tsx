import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import {
  FREE_SHIPPING_THRESHOLD_GBP,
  getUkShippingCost,
} from '../../lib/ukShipping';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Tag,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    formatPrice,
    setIsCheckoutOpen,
    setActiveView,
    addToast
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string>('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = FREE_SHIPPING_THRESHOLD_GBP;
  const estimatedShipping = getUkShippingCost('royal_mail_24', cartTotal);
  const progressToFreeShipping = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const discountAmount = cartTotal * (discountPercent / 100);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'PRECISION10' || clean === 'RESEARCH10' || clean === 'LAB10') {
      setDiscountPercent(10);
      setAppliedPromo(clean);
      addToast('Promo Applied', '10% Research Grant discount applied to order!', 'success');
      setPromoCode('');
    } else if (clean === 'PRECISION15') {
      setDiscountPercent(15);
      setAppliedPromo(clean);
      addToast('Promo Applied', '15% Institutional discount applied!', 'success');
      setPromoCode('');
    } else {
      addToast('Invalid Code', 'Try coupon code PRECISION10 for 10% off.', 'warning');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#335e90] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-display">
                  Laboratory Order Cart
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {cart.length} unique compound{cart.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="p-4 bg-sky-50/70 border-b border-sky-100">
            <div className="flex items-center justify-between text-xs font-semibold text-[#335e90] mb-1.5">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                {amountNeeded === 0
                  ? 'Free UK Tracked 24 Shipping Unlocked!'
                  : `Add ${formatPrice(amountNeeded)} for Free UK Tracked 24 Shipping`}
              </span>
              <span className="text-[11px]">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-sky-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#335e90] rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Your laboratory cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explore our HPLC-verified research peptides and lab supplies to begin your order.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('catalog');
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#335e90] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 group"
                >
                  {/* Image */}
                  <ProductImage
                    src={item.image}
                    productId={item.productId}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                    containerClassName="w-14 h-14 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate font-display">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[10px] font-bold text-[#335e90] bg-sky-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        {item.variantName}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white p-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon (e.g. PRECISION10)"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase font-mono-code bg-slate-100 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Code {appliedPromo} applied ({discountPercent}%)
                  </span>
                  <button
                    onClick={() => {
                      setAppliedPromo('');
                      setDiscountPercent(0);
                    }}
                    className="text-emerald-900 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-700">
                    {estimatedShipping === 0
                      ? 'FREE (Royal Mail 24)'
                      : formatPrice(estimatedShipping)}
                  </span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-800">
                  <span className="font-semibold">⚡ Crypto Payment:</span>
                  <span className="font-bold text-emerald-700">Save 5% at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Estimated Order Total</span>
                  <span className="text-[#335e90] font-display">
                    {formatPrice(finalTotal + estimatedShipping)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-btn"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-6 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#335e90]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted &bull; In-Vitro Research Compliance</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
