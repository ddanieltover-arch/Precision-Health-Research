import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    _smartsupp?: any;
    smartsupp?: any;
  }
}

export const SMARTSUPP_KEY =
  ((import.meta as any)?.env?.VITE_SMARTSUPP_KEY as string) ||
  'f8bb735785a3313368f5572a3a1b89fe9293d8b5';

export const openSmartsuppChat = () => {
  if (typeof window !== 'undefined' && window.smartsupp) {
    try {
      window.smartsupp('chat:open');
    } catch {
      // If smartsupp API isn't ready yet, fallback
    }
  }
};

export const SmartsuppChat: React.FC = () => {
  useEffect(() => {
    if (!SMARTSUPP_KEY) return;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_KEY;
    window._smartsupp.color = '#335e90';
    // Left side so it doesn't overlap Lab Support on the right
    window._smartsupp.orientation = 'left';
    // Hide default launcher bubble — custom button below has icon on the left
    window._smartsupp.hideBanner = true;

    try {
      if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
        window._smartsupp.offsetY = 75;
      } else {
        window._smartsupp.offsetY = 20;
      }
    } catch {
      window._smartsupp.offsetY = 20;
    }

    const existingScript = document.getElementById('smartsupp-loader-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'smartsupp-loader-script';
      script.type = 'text/javascript';
      script.charset = 'utf-8';
      script.async = true;
      script.src = 'https://www.smartsuppchat.com/loader.js?';

      window.smartsupp =
        window.smartsupp ||
        function () {
          (window.smartsupp._ = window.smartsupp._ || []).push(arguments);
        };
      window.smartsupp._ = window.smartsupp._ || [];

      document.head.appendChild(script);
    }
  }, []);

  return (
    <button
      type="button"
      id="custom-smartsupp-chat-btn"
      onClick={openSmartsuppChat}
      aria-label="Open live chat"
      className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#335e90] hover:bg-[#264a73] text-white pl-2.5 pr-4 py-2 shadow-2xl shadow-[#335e90]/35 transition-all hover:scale-105 active:scale-95"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15 shrink-0">
        <MessageCircle className="w-[18px] h-[18px]" fill="currentColor" strokeWidth={1.5} />
        <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#335e90]" />
      </span>
      <span className="text-sm font-bold tracking-tight">Chat</span>
    </button>
  );
};
