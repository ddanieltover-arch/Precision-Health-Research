import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { sendNotification } from '../../lib/notifyClient';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Truck, 
  Lock, 
  ArrowRight, 
  Copy, 
  Check, 
  QrCode, 
  AlertCircle,
  FlaskConical,
  CreditCard,
  Mail
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    clearCart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    formatPrice,
    addToast 
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [shippingSpeed, setShippingSpeed] = useState<'tracked24' | 'specialDelivery'>('tracked24');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'crypto'>('bank_transfer');
  const [researchCertified, setResearchCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    institution: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    postcode: '',
  });

  if (!isCheckoutOpen) return null;

  const FREE_SHIPPING_THRESHOLD_GBP = 100;
  const shippingCost = shippingSpeed === 'specialDelivery' ? 9.99 : (cartTotal >= FREE_SHIPPING_THRESHOLD_GBP ? 0 : 4.99);
  const cryptoDiscount = paymentMethod === 'crypto' ? cartTotal * 0.05 : 0;
  const grandTotal = Math.max(0, cartTotal - cryptoDiscount + shippingCost);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(label);
    addToast('Copied', `${label} copied to clipboard`, 'info');
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address || !formData.city || !formData.postcode) {
      addToast('Missing Fields', 'Please complete all required UK shipping fields.', 'warning');
      return;
    }
    setStep('payment');
  };

  const handleFinalOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchCertified) {
      addToast('Certification Required', 'You must agree to the in-vitro research agreement.', 'warning');
      return;
    }
    if (cart.length === 0) {
      addToast('Empty Cart', 'Add compounds before confirming an order.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const generatedId = `PHR-UK-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const shippingAddress = [
      fullName,
      formData.institution,
      formData.address,
      formData.city,
      formData.county,
      formData.postcode,
      'United Kingdom',
    ]
      .filter(Boolean)
      .join('\n');

    const items = cart.map((item) => ({
      name: item.name,
      variant: item.variantName || undefined,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
    }));

    try {
      const result = await sendNotification({
        type: 'order_confirmation',
        orderId: generatedId,
        email: formData.email.trim(),
        name: fullName,
        phone: formData.phone.trim() || undefined,
        institution: formData.institution.trim() || undefined,
        paymentMethod,
        shippingMethod: shippingSpeed === 'specialDelivery' ? 'Special Delivery' : 'Tracked 24',
        shippingAddress,
        items,
        subtotal: cartTotal,
        shippingCost,
        discount: cryptoDiscount,
        total: grandTotal,
        currency: 'GBP',
      });

      if (!result.ok) {
        addToast('Order Email Failed', result.error || 'Order was not emailed. Please contact support.', 'warning');
        setIsSubmitting(false);
        return;
      }

      setOrderId(result.orderId || generatedId);
      setConfirmedTotal(grandTotal);
      setStep('confirmation');
      clearCart();
      addToast('Order Placed', `Order ${result.orderId || generatedId} emailed to you and our lab desk.`, 'success');
    } catch (err) {
      addToast('Order Failed', err instanceof Error ? err.message : 'Network error', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0f1d2f] to-[#1b3552] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold font-display">
                UK Laboratory Checkout
              </h3>
              <span className="text-[11px] text-slate-300">
                UK Domestic Dispatch &bull; Faster Payments &amp; Crypto
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 'confirmation' && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-500">
            <span className={step === 'details' ? 'text-[#335e90] font-extrabold' : 'text-slate-400'}>
              1. UK Delivery Details
            </span>
            <span>&rarr;</span>
            <span className={step === 'payment' ? 'text-[#335e90] font-extrabold' : 'text-slate-400'}>
              2. Payment (Bank Transfer / Crypto)
            </span>
          </div>
        )}

        {/* STEP 1: Shipping Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  1. Laboratory &amp; UK Delivery Address
                </h4>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  🇬🇧 UK Mainland &amp; NI
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Dr. Alexander"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Smith"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Institution / Research Facility</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="E.g. Department of Biochemistry"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="researcher@lab.ac.uk"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">UK Street Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="24 BioPark Avenue, Science Quarter"
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Town / City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="London"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">County (Optional)</label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    placeholder="Greater London"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">UK Postcode *</label>
                  <input
                    type="text"
                    required
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="EC1A 1BB"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90] uppercase font-mono-code"
                  />
                </div>
              </div>
            </div>

            {/* UK Shipping Method Option */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Select UK Royal Mail Dispatch
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingSpeed('tracked24')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    shippingSpeed === 'tracked24'
                      ? 'border-[#335e90] bg-sky-50/60 ring-2 ring-[#335e90]/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Royal Mail Tracked 24</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">1-2 business days with cold thermal sleeve</div>
                  <div className="text-xs font-extrabold text-[#335e90] mt-1">
                    {cartTotal >= FREE_SHIPPING_THRESHOLD_GBP ? 'FREE' : formatPrice(4.99)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingSpeed('specialDelivery')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    shippingSpeed === 'specialDelivery'
                      ? 'border-[#335e90] bg-sky-50/60 ring-2 ring-[#335e90]/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Special Delivery by 1pm</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Guaranteed next morning + ice packs</div>
                  <div className="text-xs font-extrabold text-[#335e90] mt-1">
                    {formatPrice(9.99)}
                  </div>
                </button>
              </div>
            </div>

            {/* Order Total Preview & Continue */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total with UK Delivery:</span>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#335e90] hover:bg-[#264a73] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: Payment and In-Vitro Certification */}
        {step === 'payment' && (
          <form onSubmit={handleFinalOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Payment Method Selector (Bank Transfer & Crypto ONLY) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Payment Method
                </h4>
                <span className="text-[10px] text-slate-500">UK Bank Transfer &amp; Crypto Only</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-xl text-center border transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#335e90] bg-sky-50/70 ring-2 ring-[#335e90]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#335e90] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">UK Bank Transfer</div>
                  <div className="text-[10px] text-slate-500">Faster Payments (Zero Fees)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3.5 rounded-xl text-center border transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-emerald-900">Cryptocurrency (5% Off)</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Instant 5% Discount</div>
                </button>
              </div>
            </div>

            {/* UK Bank Transfer Details Box (No bank info shown before confirmation) */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-sky-200/80">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#335e90]" />
                    <span>UK Faster Payments / Online Banking</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                    Zero Transfer Fees
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-200/80 text-[11px] text-slate-700 space-y-1.5">
                  <p className="leading-relaxed">
                    Direct UK bank transfer via Faster Payments is supported. Bank transfer details and payment instructions will be provided in the order confirmation screen after clicking <strong>Confirm Order</strong>.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Orders are packaged immediately and dispatched upon receipt of funds.
                  </p>
                </div>
              </div>
            )}

            {/* Crypto Payment Info Box (No address shown before confirmation) */}
            {paymentMethod === 'crypto' && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3 text-xs text-emerald-900">
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">₿</span>
                    <span>Bitcoin (BTC) Payment</span>
                  </div>
                  <span className="text-emerald-700 font-black bg-white px-2 py-0.5 rounded border border-emerald-200">
                    5% Instant Discount Applied
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-1.5 text-[11px] text-slate-700">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1">
                    <span>⚡ Instant 5% Savings:</span>
                    <span className="text-emerald-700 font-bold">{formatPrice(cartTotal * 0.05)} deducted</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Our official Bitcoin (BTC) deposit address will be provided on the next confirmation screen immediately after clicking <strong>Confirm Order</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* In-Vitro Certification Checkbox */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={researchCertified}
                  onChange={(e) => setResearchCertified(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#335e90] focus:ring-[#335e90]"
                />
                <span className="text-xs text-amber-950 leading-relaxed">
                  <strong>UK Laboratory Research Certification:</strong> I certify that I am at least 21 years of age and that all compounds purchased from Precision Health Research are strictly for in-vitro laboratory experimentation, assays, and scientific study. They are NOT approved for human ingestion, medical treatment, or veterinary use.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                &larr; Back to Delivery
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !researchCertified}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                {isSubmitting ? (
                  <span>Submitting Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({formatPrice(grandTotal)})</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 'confirmation' && (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Laboratory Order Received
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                Thank You, {formData.firstName || 'Researcher'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your order is registered for cold-chain packing at our UK facility. Confirmation and batch analytical documentation have been sent to <strong>{formData.email}</strong>.
              </p>
            </div>

            {/* Order Details Receipt Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Order Reference</span>
                <span className="font-mono-code font-bold text-[#335e90]">{orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Selected</span>
                <span className="font-semibold text-slate-800">
                  {paymentMethod === 'bank_transfer' ? 'UK Bank Transfer (Faster Payments)' : 'Cryptocurrency (5% Discount Applied)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Dispatch Carrier</span>
                <span className="font-semibold text-slate-800">
                  {shippingSpeed === 'tracked24' ? 'Royal Mail Tracked 24' : 'Special Delivery by 1pm'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Dispatch Origin</span>
                <span className="font-semibold text-slate-800">UK Mainland Distribution Hub</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-700">Total Payable</span>
                <span className="text-base text-slate-900">{formatPrice(confirmedTotal || grandTotal)}</span>
              </div>
            </div>

            {paymentMethod === 'bank_transfer' && (
              <div className="p-5 bg-gradient-to-br from-sky-50 to-indigo-50/70 border border-sky-300 rounded-2xl text-left max-w-md mx-auto text-xs space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-sky-200/80">
                  <div className="font-bold text-[#335e90] flex items-center gap-1.5 text-xs sm:text-sm">
                    <Building2 className="w-4 h-4 text-[#335e90]" />
                    <span>Bank Transfer Payment Instructions</span>
                  </div>
                  <span className="text-[10px] text-sky-800 bg-sky-100 font-bold px-2 py-0.5 rounded border border-sky-200">
                    Action Required
                  </span>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Kindly contact our administration team via email to receive our active UK bank transfer account details for this order:
                </p>

                <div className="p-3 bg-white rounded-xl border border-sky-200 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#335e90]" />
                      <span>Admin Contact Email:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('info@ph-research.store', 'Admin Email')}
                      className="text-[#335e90] font-extrabold text-[11px] hover:text-[#264a73] flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-200"
                    >
                      {copiedBankField === 'Admin Email' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={`mailto:info@ph-research.store?subject=Bank%20Transfer%20Payment%20Details%20-%20${orderId}&body=Hello%20Precision%20Health%20Research,%0D%0A%0D%0AI%20have%20placed%20order%20${orderId}%20for%20the%20amount%20of%20${formatPrice(confirmedTotal || grandTotal)}.%0D%0A%0D%0APlease%20provide%20the%20UK%20bank%20transfer%20account%20details%20to%20complete%20payment.%0D%0A%0D%0AThank%20you.`}
                    className="block p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 font-mono-code text-[11px] font-bold text-[#335e90] break-all transition-colors"
                  >
                    info@ph-research.store
                  </a>
                </div>

                <div className="p-2.5 bg-sky-100/70 rounded-xl text-[11px] text-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Order Reference to quote:</span>
                    <span className="font-bold text-[#335e90] font-mono-code">{orderId}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Order Amount:</span>
                    <span className="font-bold text-slate-900">{formatPrice(confirmedTotal || grandTotal)}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 pt-1 border-t border-sky-200/60 leading-snug">
                    Please quote your Order Reference <strong>{orderId}</strong> in your email. Our team responds promptly with Sort Code and Account Number details. Once transfer is verified, your order will be dispatched via Royal Mail.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-300 rounded-2xl text-left max-w-md mx-auto space-y-3 text-xs shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">₿</span>
                    <span>Bitcoin (BTC) Payment Instructions</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                    5% Off Applied
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-700">Official BTC Deposit Address:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('1JYGGV4YoU3yoDRGYFT6hw7A6Gtg1FU9e3', 'Bitcoin Address')}
                      className="text-emerald-700 font-extrabold text-[11px] hover:text-emerald-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-xs"
                    >
                      {copiedBankField === 'Bitcoin Address' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200/90 font-mono-code text-[11px] font-bold text-slate-900 break-all select-all tracking-wide shadow-inner">
                    1JYGGV4YoU3yoDRGYFT6hw7A6Gtg1FU9e3
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-100/60 rounded-xl text-[11px] text-emerald-900 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Amount Payable:</span>
                    <span className="font-bold">{formatPrice(confirmedTotal || grandTotal)} worth of BTC</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-snug">
                    Please send the equivalent BTC payment to the address above using reference <strong>{orderId}</strong>. Once detected on the blockchain (1 confirmation), your order will be packed for cold-chain UK dispatch.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="px-6 py-3 bg-[#335e90] hover:bg-[#264a73] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              Return to Laboratory Storefront
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

