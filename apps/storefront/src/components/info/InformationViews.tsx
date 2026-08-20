import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { persistInquiryLocally, sendNotification } from '../../lib/notifyClient';
import { 
  FlaskConical, 
  ShieldCheck, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  HelpCircle, 
  CheckCircle2, 
  Send,
  ThermometerSnowflake,
  Lock,
  ChevronDown
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-2xl bg-white p-0.5 mx-auto border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
          <img 
            src="/precision-logo.jpg" 
            alt="Precision Health Research Logo" 
            referrerPolicy="no-referrer"
            className="w-[175%] h-[175%] max-w-none object-contain"
          />
        </div>
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider block">
          Laboratory Standards &amp; Synthesis
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          About Precision Health Research
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Pioneering high-throughput solid-phase peptide synthesis and strict analytical validation for the global scientific research community.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs leading-relaxed text-sm text-slate-600">
        <h3 className="text-lg font-bold text-slate-900 font-display">
          Our Analytical Research Mission
        </h3>
        <p>
          Founded by pharmaceutical biochemists and analytical chemists, <strong>Precision Health Research</strong> was established to eliminate quality variance in pre-clinical research compounds. We supply authenticated peptides, reference standards, and laboratory tools to academic universities, private biotechnology facilities, and independent life science investigators.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
              &ge;99.0% Baseline Purity
            </h4>
            <p className="text-xs text-slate-500">
              Validated using dual-column reverse-phase high performance liquid chromatography.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
              Mass Spec Verification
            </h4>
            <p className="text-xs text-slate-500">
              ESI-MS molecular weight confirmation ensuring exact amino acid sequence fidelity.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
              Domestic UK Hub
            </h4>
            <p className="text-xs text-slate-500">
              All inventory is stored in climate-monitored freezers and dispatched from our United Kingdom hub.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-display pt-4">
          Strict Quality Assurance Workflow
        </h3>
        <p>
          Each synthesis lot is quarantined upon production and subjected to third-party verification through independent analytical laboratories. Batch chromatograms, total area purity percentages, and peptide content assays are thoroughly verified before batch release.
        </p>
      </div>
    </div>
  );
};

export const FaqView: React.FC = () => {
  const faqs = [
    {
      q: 'How should lyophilized peptides be stored prior to reconstitution?',
      a: 'Lyophilized (freeze-dried) peptides should be stored in a freezer at -20°C in a sealed, desiccated container to preserve peptide chain integrity. Protect from direct exposure to ambient humidity and ultraviolet light.'
    },
    {
      q: 'What is the recommended reconstitution procedure?',
      a: 'Allow the peptide vial to reach room temperature before opening to avoid moisture condensation. Using a sterile syringe, inject Bacteriostatic Water (0.9% benzyl alcohol) slowly against the interior glass wall. Gently swirl in a circular motion until completely dissolved. Never shake vigorously, as shear forces can denature fragile peptide bonds.'
    },
    {
      q: 'How long are reconstituted peptide solutions stable?',
      a: 'Once reconstituted with Bacteriostatic Water, peptide solutions should be kept refrigerated between 2°C and 8°C. Most solutions maintain high bioactivity for 21 to 30 days under refrigerated conditions.'
    },
    {
      q: 'How do you guarantee compound purity and identity?',
      a: 'Every single batch is independently assigned a unique Lot Number (e.g. PHR-TB-2026-08) and verified by accredited analytical laboratories using reverse-phase HPLC and Mass Spectrometry to guarantee ≥99% analytical purity.'
    },
    {
      q: 'What are your domestic UK shipping timeframes?',
      a: 'Orders placed before 2:00 PM GMT Monday through Friday are packed and dispatched same-day from our UK distribution hub. UK options include Royal Mail 24 (£4.50, free over £500), Royal Mail Special (£7.50), DPD UK (£6.90), and DPD Saturday Delivery (£9.50).'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We currently accept UK Bank Transfer (Faster Payments) and Bitcoin (BTC) cryptocurrency. All Bitcoin payments receive an instant 5% discount at checkout.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Laboratory Guidance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Scientific guidelines on storage, reconstitution protocols, analytical testing, and fulfillment.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180 text-[#335e90]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ShippingView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Fulfillment &amp; Cold-Chain
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Discrete, thermal-shielded packaging dispatched directly from our United Kingdom laboratory hub.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-xs text-slate-600 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Truck className="w-4 h-4 text-[#335e90]" />
              <span>Royal Mail 24 — £4.50</span>
            </div>
            <p>
              1–2 working days. <strong>FREE on UK orders over £500</strong>. Dispatched in insulated thermal bubble mailers with full barcode tracking.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
              <span>Royal Mail Special — £7.50</span>
            </div>
            <p>
              1 working day. Faster Royal Mail service for time-sensitive research consignments.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>DPD UK — £6.90</span>
            </div>
            <p>
              1–2 working days via DPD UK with doorstep delivery and live tracking updates.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Truck className="w-4 h-4 text-violet-600" />
              <span>DPD UK (Saturday Delivery) — £9.50</span>
            </div>
            <p>
              Weekend delivery via DPD UK for Saturday drop-off when you need research materials outside the weekday schedule.
            </p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pt-2">
          Packaging &amp; Discretion
        </h3>
        <p>
          All items are shipped in sturdy, unmarked laboratory shipping boxes with neutral sender labeling. Vials are individually packed in shock-absorbing foam inserts to prevent vibration damage during transit.
        </p>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { addToast } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await sendNotification({
        type: 'contact',
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Analytical inquiry',
        message: formData.message.trim(),
      });
      if (!result.ok) {
        addToast('Send Failed', result.error || 'Could not deliver your inquiry emails.', 'warning');
        return;
      }
      const ref = result.ticketId || `PHR-${Date.now().toString().slice(-4)}`;
      persistInquiryLocally({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Analytical inquiry',
        message: formData.message.trim(),
        ticketId: ref,
      });
      setTicketId(ref);
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      addToast('Message Sent', 'Confirmation emailed to you and our laboratory desk.', 'success');
    } catch (err) {
      addToast('Send Failed', err instanceof Error ? err.message : 'Network error', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Researcher Assistance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Contact Laboratory Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Have questions regarding batch specifications, analytical data, custom synthesis, or order tracking?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contact details */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1b3552] to-[#0f1d2f] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold font-display">Precision Health Research</h3>
            <p className="text-xs text-slate-300 mt-1">Analytical Compound Facility</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Physical Laboratory Address</span>
                <span className="text-slate-300">UK Laboratory Hub &amp; Distribution Center, United Kingdom</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Email Inquiry</span>
                <a href="mailto:info@ph-research.store" className="text-sky-300 hover:underline">
                  info@ph-research.store
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Phone &amp; WhatsApp Support</span>
                <a href="https://wa.me/447723206940" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                  +44 7723 206940
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/80 text-[11px] text-slate-400">
            Support Hours: Monday - Friday 8:00 AM - 6:00 PM GMT. Weekend urgent batch inquiries handled via email.
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your research inquiry has been assigned ticket reference <strong>#{ticketId || 'PHR'}</strong>.
                Confirmation emails were sent to you and our laboratory support team.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setTicketId('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Send an Analytical Inquiry
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Researcher Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Smith"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="smith@lab.org"
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Analytical Inquiry / Bulk Custom Quote"
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide compound name, lot number, or question..."
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#335e90] hover:bg-[#264a73] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#335e90]/25 transition-all"
              >
                <span>{submitting ? 'Sending…' : 'Submit Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Legal &amp; Regulatory Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Terms of Service &amp; Research Agreement
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Last Updated: 2026. Please review these binding laboratory terms prior to placing an order.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Strict In-Vitro Research Use Only (RUO)</span>
          </div>
          <p>
            All compounds, peptides, analytical reagents, and solutions supplied by <strong>Precision Health Research</strong> (ph-research.store) are manufactured and sold exclusively for laboratory in-vitro testing, academic research, and chemical analysis.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">1. No-Consumption &amp; Non-Clinical Policy</h2>
          <p>
            Products offered on this platform are not drugs, foods, cosmetics, dietary supplements, or medical devices. They have not been tested or approved by the MHRA, FDA, EMA, or any international health authority for human or veterinary administration. 
          </p>
          <p className="font-semibold text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
            CRITICAL: Any indication or communication indicating an intention to ingest, inject, consume, or administer these chemicals to humans or animals will result in an immediate refusal of service, cancellation of pending orders, and permanent blacklist from our laboratory platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">2. Buyer Representation &amp; Handling Qualifications</h2>
          <p>
            By submitting an order on ph-research.store, you explicitly affirm and warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>You are at least 21 years of age and legally competent to purchase experimental biochemical materials.</li>
            <li>You possess the requisite scientific training, certified laboratory containment, and PPE equipment to handle lyophilized powders and chemical solutions safely.</li>
            <li>You will adhere to all local, national, and international chemical storage and hazardous waste disposal guidelines.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">3. Order Acceptance &amp; Right to Cancel</h2>
          <p>
            Precision Health Research reserves the unilateral right to refuse, limit, or cancel any transaction suspected of violating our research-use mandates or originating from unauthorized jurisdictions. In cases of compliance cancellation, funds will be refunded or withheld in accordance with banking safety protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">4. Limitation of Liability &amp; Indemnification</h2>
          <p>
            In no event shall Precision Health Research, its directors, officers, chemists, or affiliates be liable for any special, incidental, consequential, or punitive damages arising from the storage, handling, or misuse of any chemical compound. The purchaser agrees to indemnify and hold harmless Precision Health Research from any third-party claims.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Data Confidentiality &amp; Encryption
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          How Precision Health Research safeguards researcher records, orders, and batch documentation.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">1. Information We Collect</h2>
          <p>
            We collect only the essential information necessary to fulfill laboratory supply requests and maintain lot batch traceability:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>Institutional &amp; Contact Details:</strong> Researcher name, laboratory affiliation, email address, and telephone number.</li>
            <li><strong>Logistics Data:</strong> Shipping address, delivery instructions, and package tracking logs.</li>
            <li><strong>Order History:</strong> Specific catalog items, lot batch numbers, and transaction IDs for traceability.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">2. Zero Payment Credential Storage</h2>
          <p>
            Precision Health Research never collects, handles, or stores sensitive bank logins, card CVVs, or cryptocurrency private keys on our web servers. Payments via UK Faster Payments or Blockchain (BTC) are processed through external encrypted settlement routes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">3. Strict Non-Disclosure &amp; Zero Marketing Sale</h2>
          <p>
            We enforce a strict confidentiality guarantee: <strong>We do not sell, rent, lease, or monetize customer data to third-party advertisers or data brokers</strong>. Customer data is utilized strictly for order processing, logistics notifications, and critical safety notifications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">4. 256-Bit SSL Security &amp; Data Rights</h2>
          <p>
            All communications with ph-research.store are protected using modern TLS 1.3 encryption. You retain the right under GDPR and UK Data Protection laws to request an audit, update, or complete deletion of your customer record at any time by contacting <a href="mailto:info@ph-research.store" className="text-[#335e90] font-bold hover:underline">info@ph-research.store</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const RefundView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Fulfillment Assurance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Refund, Replacement &amp; Quality Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Clear, transparent policies for damaged vials, temperature control, and analytical claims.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">1. Cold-Chain &amp; Chemical Integrity Constraint</h2>
          <p>
            Due to the sensitive biochemical nature of lyophilized peptide sequences and required temperature stability protocols, <strong>we cannot accept physical returns of opened or delivered compound vials</strong>. Once a chemical product leaves our controlled facility, it cannot be restocked for other researchers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">2. Damaged in Transit &amp; Broken Vial Guarantee</h2>
          <p>
            If any vial or container arrives damaged, cracked, or compromised during transit:
          </p>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <span className="font-bold block">100% Free Reshipment Guarantee</span>
            <p>
              Please take clear photos of the damaged vial, packaging label, and lot number within <strong>48 hours of delivery</strong> and email them to <a href="mailto:info@ph-research.store" className="font-bold underline">info@ph-research.store</a>. We will dispatch an expedited replacement package immediately at zero cost.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">3. Purity &amp; Analytical Discrepancy Claims</h2>
          <p>
            Every synthesis batch is verified &ge;99.0% by independent HPLC and MS testing. If an accredited third-party laboratory test reveals a purity score below our published analytical specification:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Submit the third-party analytical report (including chromatogram, testing methodology, and lot number).</li>
            <li>Upon verification by our head biochemist, you will receive an immediate full refund or a fresh, certified batch replacement.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">4. Package Loss &amp; Royal Mail Tracking</h2>
          <p>
            If a package is confirmed lost by Royal Mail or stalled in transit for more than 5 business days, we provide a complimentary one-time reshipment via Royal Mail Tracked 24.
          </p>
        </section>
      </div>
    </div>
  );
};

export const QualityView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#335e90] uppercase tracking-wider">
          Analytical Excellence
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Quality Assurance &amp; Testing Protocols
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Setting the gold standard in peptide synthesis, purity quantification, and batch authentication.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#335e90]" />
              <span>Reverse-Phase HPLC</span>
            </div>
            <p className="text-xs text-slate-600">
              High Performance Liquid Chromatography with dual C18 columns isolates individual peptide peaks, quantifying purity to &ge;99.0% total peak area.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mass Spectrometry (MS)</span>
            </div>
            <p className="text-xs text-slate-600">
              Electrospray Ionization Mass Spectrometry (ESI-MS) confirms exact molecular weight (g/mol) and validates sequence structure without truncated variants.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">Independent Third-Party Verification</h2>
          <p>
            To guarantee absolute objectivity, all batch lots produced at Precision Health Research are independently tested by accredited external analytical labs including Janoshik Analytical and MZ Biolabs. Certificates of Analysis (COAs) include:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Full raw HPLC UV-absorbance chromatograms.</li>
            <li>Calculated purity score (%) and retention time.</li>
            <li>Theoretical vs. observed mass spectrum.</li>
            <li>Digital cryptographic QR code verification linking directly to third-party lab records.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
