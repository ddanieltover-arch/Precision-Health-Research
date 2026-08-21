import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-52 md:bottom-40 right-4 md:right-6 z-30 p-3 bg-white/95 backdrop-blur-md hover:bg-[#335e90] text-slate-700 hover:text-white rounded-full shadow-lg border border-slate-200/80 hover:border-[#335e90] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center group"
    >
      <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
      <span className="sr-only">Back to top</span>
    </button>
  );
};
