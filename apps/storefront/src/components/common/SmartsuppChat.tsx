import React, { useEffect } from 'react';

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

/** Loads Smartsupp for Lab Support panel — no floating chat launcher. */
export const SmartsuppChat: React.FC = () => {
  useEffect(() => {
    if (!SMARTSUPP_KEY) return;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_KEY;
    window._smartsupp.color = '#335e90';
    window._smartsupp.orientation = 'left';
    // No floating Chat button — open only via Lab Support
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

  return null;
};
