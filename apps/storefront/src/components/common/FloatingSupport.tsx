import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { openSmartsuppChat } from './SmartsuppChat';
import { persistInquiryLocally, sendNotification } from '../../lib/notifyClient';

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { addToast } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      const result = await sendNotification({
        type: 'quick_inquiry',
        name: name.trim() || undefined,
        email: email.trim(),
        message: inquiryText.trim(),
      });
      if (!result.ok) {
        addToast('Send Failed', result.error || 'Could not deliver inquiry emails.', 'warning');
        return;
      }
      const ref = result.ticketId || `PHR-Q-${Date.now().toString().slice(-4)}`;
      persistInquiryLocally({
        name: name.trim() || 'Quick inquiry',
        email: email.trim(),
        subject: 'Quick compound inquiry',
        message: inquiryText.trim(),
        ticketId: ref,
      });
      setTicketId(ref);
      setSubmitted(true);
      setInquiryText('');
      addToast('Inquiry Received', 'Confirmation emailed to you and our laboratory desk.', 'success');
    } catch (err) {
      addToast('Send Failed', err instanceof Error ? err.message : 'Network error', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartLiveChat = () => {
    openSmartsuppChat();
    setIsOpen(false);
    addToast('Live Chat Connected', 'Smartsupp laboratory support channel opened.', 'info');
  };

  // Lowest in the floating stack: Back to top → Smartsupp → Lab Support
  return (
    <div id="floating-support-container" className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="floating-support-btn"
          onClick={() => setIsOpen(true)}
          className="p-3.5 bg-[#335e90] hover:bg-[#264a73] text-white rounded-full shadow-2xl shadow-[#335e90]/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group"
          title="Laboratory Specialist Support"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">
            Lab Support
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Popover Support Panel */}
      {isOpen && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-80 sm:w-96 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0f1d2f] to-[#1b3552] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white p-0 flex items-center justify-center overflow-hidden shrink-0 shadow-xs border border-white/20">
                {!logoError ? (
                  <img 
                    src="/precision-logo.jpg" 
                    alt="Precision Health Research" 
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="w-[175%] h-[175%] max-w-none object-contain"
                  />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#335e90]" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-extrabold font-display">
                  Precision Health Research
                </h4>
                <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Chemist Online Mon-Fri
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 text-xs">
            
            {/* Live Chat Primary CTA */}
            <button
              onClick={handleStartLiveChat}
              type="button"
              id="start-smartsupp-chat-btn"
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[#335e90] to-[#22446a] hover:from-[#264a73] hover:to-[#17304e] text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Headphones className="w-4 h-4 text-sky-300" />
              <span>Start Smartsupp Live Chat</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[9px] uppercase tracking-wider font-extrabold ml-1">
                Instant
              </span>
            </button>

            {/* Quick Direct Actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/447723206940"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href="mailto:info@ph-research.store"
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#335e90]" />
                <span>Email Lab</span>
              </a>
            </div>

            {/* Quick message form */}
            {submitted ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-emerald-900">Message Dispatched</h5>
                <p className="text-[11px] text-emerald-800">
                  Ticket <strong>{ticketId}</strong> emailed to you and our scientific staff.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setTicketId('');
                  }}
                  className="text-[11px] font-bold text-emerald-900 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <label className="font-bold text-slate-700 block text-[11px]">
                  Direct Compound Inquiry
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for reply *"
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90]"
                />
                <textarea
                  rows={3}
                  required
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="Ask about batch purity, COAs, reconstitution protocols, or custom synthesis..."
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#335e90] resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#335e90] hover:bg-[#264a73] disabled:opacity-60 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>{submitting ? 'Sending…' : 'Dispatch Message'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
              Direct Chemist Support &bull; London Lab Dispatch, UK
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
