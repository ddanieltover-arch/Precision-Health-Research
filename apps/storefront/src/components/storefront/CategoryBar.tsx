import React, { useEffect, useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../../data/catalog';
import { useStore } from '../../context/StoreContext';
import { ChevronDown, Layers } from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveView } = useStore();
  const [headerOffset, setHeaderOffset] = useState(116);

  useEffect(() => {
    const updateOffset = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderOffset(Math.ceil(header.getBoundingClientRect().height));
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  const options = CATEGORIES.map((cat) => {
    const count =
      cat.slug === 'all'
        ? PRODUCTS.length
        : PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;

    return {
      ...cat,
      count,
      label: cat.slug === 'all' ? cat.name : `${cat.name} (${count})`,
    };
  });

  const selected = options.find((o) => o.slug === selectedCategory) || options[0];

  return (
    <div
      className="sticky z-30 w-full bg-slate-100/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-sm"
      style={{ top: headerOffset }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 max-w-md">
          <label
            htmlFor="classification-select"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-[#335e90]" />
            Classifications
          </label>

          <div className="relative flex-1 min-w-0">
            <select
              id="classification-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setActiveView('catalog');
                // Always show the filtered catalog from the top
                requestAnimationFrame(() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                });
              }}
              aria-label="Filter compounds by classification"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-300 focus:border-[#335e90] focus:ring-2 focus:ring-[#335e90]/25"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.slug}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
          </div>

          <span className="sr-only">
            Currently showing {selected.label}
          </span>
        </div>
      </div>
    </div>
  );
};
