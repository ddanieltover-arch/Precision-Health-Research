import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../../data/catalog';
import { ProductCard } from './ProductCard';
import { useStore } from '../../context/StoreContext';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  Check, 
  Sparkles,
  FlaskConical,
  X
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'purity' | 'name'>('featured');
  const [minPurityOnly, setMinPurityOnly] = useState(false);

  const currentCategoryInfo = CATEGORIES.find((c) => c.slug === selectedCategory) || CATEGORIES[0];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // category match
      const categoryMatch = 
        selectedCategory === 'all' || product.categorySlug === selectedCategory;

      // search match
      const searchMatch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.casNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // purity filter
      const purityMatch = !minPurityOnly || product.purity.includes('99.5') || product.purity.includes('99.6') || product.purity.includes('99.7') || product.purity.includes('99.8');

      return categoryMatch && searchMatch && purityMatch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'purity') return b.purity.localeCompare(a.purity);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, minPurityOnly, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category header intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#335e90] uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Research Compound Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {currentCategoryInfo.name}
          </h2>
          {currentCategoryInfo.desc && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {currentCategoryInfo.desc}
            </p>
          )}
        </div>

        {/* Compound count */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> of {PRODUCTS.length} compounds
        </div>
      </div>

      {/* Filter and sorting toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-slate-100/60 p-3 rounded-2xl border border-slate-200/80">
        
        {/* Left: Quick active filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMinPurityOnly(!minPurityOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              minPurityOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {minPurityOnly && <Check className="w-3.5 h-3.5" />}
            <span>&ge;99.5% Purity Only</span>
          </button>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-100 text-sky-900 text-xs font-semibold">
              <span>Query: &ldquo;{searchQuery}&rdquo;</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-sky-950">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>

        {/* Right: Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-[#335e90]"
          >
            <option value="featured">Featured &amp; Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="purity">Highest HPLC Purity</option>
            <option value="name">Compound Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-12 p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto">
          <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching compounds found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or clearing active category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setMinPurityOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-[#335e90] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
