import React, { useState, useEffect } from 'react';
import { FlaskConical } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  productId?: string;
  className?: string;
  containerClassName?: string;
  purity?: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  purity,
  priority = false,
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error'
  );

  useEffect(() => {
    setImageState(src ? 'loading' : 'error');
  }, [src]);

  const getAbbreviation = (name: string) => {
    const clean = name.replace(/\(.*?\)/g, '').trim();
    const parts = clean.split(/[\s-]+/);
    if (parts[0] && parts[0].length <= 5) return parts[0].toUpperCase();
    return clean.slice(0, 4).toUpperCase();
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${containerClassName}`}>
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-slate-100/80 animate-pulse flex items-center justify-center rounded-xl z-0">
          <FlaskConical className="w-8 h-8 text-slate-300 animate-pulse" />
        </div>
      )}

      {src && imageState !== 'error' ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('error')}
          className={`${className} transition-opacity duration-300 ${
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border border-slate-200/80">
          <div className="relative w-20 h-28 flex flex-col items-center justify-center">
            <div className="w-8 h-3.5 bg-gradient-to-r from-sky-600 to-[#335e90] rounded-t-md shadow-xs border border-sky-400" />
            <div className="w-9 h-1.5 bg-slate-300 border-x border-slate-400" />
            <div className="w-16 h-20 bg-gradient-to-b from-white/90 via-sky-50/60 to-sky-100/70 border-2 border-slate-300 rounded-b-xl shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-sky-500/20 to-transparent border-t border-sky-300/40" />
              <span className="relative z-10 font-mono text-[11px] font-black text-slate-800 tracking-wider">
                {getAbbreviation(alt)}
              </span>
              {purity && (
                <span className="relative z-10 text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 mt-1">
                  {purity}
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-[140px]">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
};
