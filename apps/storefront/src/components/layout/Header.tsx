import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { CurrencyCode } from '../../types';
import { PRODUCTS } from '../../data/catalog';
import { ProductImage } from '../common/ProductImage';
import { VIEW_PATHS } from '../../lib/routes';
import { 
  Search, 
  ShoppingBag, 
  FlaskConical, 
  Calculator, 
  BookOpen, 
  Menu, 
  X, 
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  Headphones
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cartItemCount, 
    setIsCartOpen, 
    currency, 
    setCurrencyCode, 
    activeView, 
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    openProductDetail,
    formatPrice
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const infoMenuRef = useRef<HTMLDivElement>(null);
  const infoSubmenuRef = useRef<HTMLDivElement>(null);
  const infoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const infoViews = ['guide', 'peptide-guide', 'calculator', 'research', 'compare'] as const;
  const isInfoActive = infoViews.includes(activeView as (typeof infoViews)[number]);

  const infoLinks = [
    {
      id: 'nav-link-guide',
      to: VIEW_PATHS.guide,
      label: 'Peptide Guide',
      icon: BookOpen,
      iconClass: 'text-emerald-500',
      activeViews: ['guide', 'peptide-guide'],
    },
    {
      id: 'nav-link-calculator',
      to: VIEW_PATHS.calculator,
      label: 'Calculator',
      icon: Calculator,
      iconClass: 'text-sky-500',
      activeViews: ['calculator'],
    },
    {
      id: 'nav-link-research',
      to: VIEW_PATHS.research,
      label: 'Research Hub',
      icon: FlaskConical,
      iconClass: 'text-indigo-500',
      activeViews: ['research'],
    },
    {
      id: 'nav-link-compare',
      to: VIEW_PATHS.compare,
      label: 'Compare',
      icon: Sparkles,
      iconClass: 'text-amber-500',
      activeViews: ['compare'],
    },
  ];

  const openInfoMenu = () => {
    if (infoCloseTimerRef.current) {
      clearTimeout(infoCloseTimerRef.current);
      infoCloseTimerRef.current = null;
    }
    setIsInfoMenuOpen(true);
  };

  const scheduleCloseInfoMenu = () => {
    if (infoCloseTimerRef.current) clearTimeout(infoCloseTimerRef.current);
    infoCloseTimerRef.current = setTimeout(() => setIsInfoMenuOpen(false), 160);
  };

  // Close search / info menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (
        infoMenuRef.current &&
        !infoMenuRef.current.contains(e.target as Node) &&
        (!infoSubmenuRef.current || !infoSubmenuRef.current.contains(e.target as Node))
      ) {
        setIsInfoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (infoCloseTimerRef.current) clearTimeout(infoCloseTimerRef.current);
    };
  }, []);

  const searchResults = searchQuery.trim().length > 0
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.casNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top laboratory announcement bar */}
      <div className="bg-[#1b3552] text-slate-200 text-xs py-2 px-4 border-b border-slate-700/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] tracking-wide">
              <ShieldCheck className="w-3 h-3" />
              BATCH VERIFIED ≥99% PURITY
            </span>
            <span className="hidden md:inline text-slate-300 text-xs">
              Same-day UK laboratory dispatch on orders before 2 PM GMT &bull; Free Tracked 24 on £100+
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <Link
              id="topbar-contact-support"
              to="/contact"
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-sky-300 hover:text-sky-200"
            >
              <Headphones className="w-3.5 h-3.5 text-sky-400" />
              <span>Contact Support</span>
            </Link>
            <span className="text-slate-600">|</span>
            <a href="mailto:info@ph-research.store" className="hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span className="hidden lg:inline">info@ph-research.store</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a href="https://wa.me/447723206940" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hidden sm:flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+44 7723 206940</span>
            </a>
            <span className="text-slate-600">|</span>
            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-select-button"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 hover:text-white font-medium px-1.5 py-0.5 rounded transition-colors"
              >
                <span>{currency.code} ({currency.symbol})</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                  {(['USD', 'EUR', 'GBP', 'CAD'] as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      id={`currency-opt-${code}`}
                      onClick={() => {
                        setCurrencyCode(code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currency.code === code ? 'text-sky-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-slate-400">{code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'GBP' ? '£' : 'CA$'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo / Brand Name */}
          <Link
            id="brand-home-link"
            to="/"
            className="flex items-center gap-3.5 text-left group shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/80 flex items-center justify-center group-hover:border-[#335e90]/50 group-hover:shadow-md transition-all overflow-hidden shrink-0">
              <img 
                src="/precision-logo.jpg" 
                alt="Precision Health Research Logo" 
                referrerPolicy="no-referrer"
                className="w-[175%] h-[175%] max-w-none object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 text-lg group-hover:text-[#335e90] transition-colors font-display">
                  Precision Health
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#335e90]/10 text-[#335e90] uppercase tracking-wider">
                  RESEARCH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Analytical Peptide & Compound Laboratory
              </p>
            </div>
          </Link>

          {/* Search bar with instant autocomplete */}
          <div ref={searchContainerRef} className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search peptides, CAS #, molecular sequences..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-[#335e90] focus:ring-2 focus:ring-[#335e90]/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold px-3">
                  <span>SEARCH RESULTS ({searchResults.length})</span>
                  <Link
                    to="/catalog"
                    onClick={() => setIsSearchFocused(false)}
                    className="text-[#335e90] hover:underline flex items-center gap-0.5"
                  >
                    <span>View all catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No compounds matching &ldquo;{searchQuery}&rdquo;. Try BPC-157, TB-500, or Semaglutide.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          openProductDetail(product);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full p-2.5 flex items-center gap-3 hover:bg-slate-50 text-left transition-colors"
                      >
                        <ProductImage
                          src={product.thumbnailUrl}
                          productId={product.id}
                          alt={product.name}
                          purity={product.purity}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                          containerClassName="w-10 h-10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-medium">
                              {product.category}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 rounded">
                              {product.purity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#335e90]">
                            {formatPrice(product.basePrice)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              id="nav-link-catalog"
              to="/catalog"
              className={({ isActive }) =>
                `px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#335e90] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#335e90] hover:bg-slate-100'
                }`
              }
            >
              Catalog
            </NavLink>

            <div
              ref={infoMenuRef}
              className="relative"
              onMouseEnter={openInfoMenu}
              onMouseLeave={scheduleCloseInfoMenu}
            >
              <button
                id="nav-link-info"
                type="button"
                aria-haspopup="true"
                aria-expanded={isInfoMenuOpen || isInfoActive}
                onClick={() => setIsInfoMenuOpen((open) => !open)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  isInfoActive || isInfoMenuOpen
                    ? 'bg-[#335e90] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#335e90] hover:bg-slate-100'
                }`}
              >
                <span>Info</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isInfoMenuOpen ? 'rotate-180' : ''
                  } ${isInfoActive || isInfoMenuOpen ? 'text-white/90' : 'text-slate-500'}`}
                />
              </button>
            </div>

            <NavLink
              id="nav-link-contact"
              to="/contact"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#335e90] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#335e90] hover:bg-slate-100'
                }`
              }
            >
              <Headphones className="w-3.5 h-3.5 text-sky-600" />
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* Action CTAs: Cart Drawer trigger + Mobile toggle */}
          <div className="flex items-center gap-2.5">
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-[#335e90] hover:bg-[#264a73] active:scale-95 text-white rounded-xl shadow-md shadow-[#335e90]/25 transition-all text-xs font-bold tracking-wider uppercase"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Info submenu bar — desktop */}
      {(isInfoMenuOpen || isInfoActive) && (
        <div
          ref={infoSubmenuRef}
          className="hidden md:block border-t border-slate-200/80 bg-slate-50/95 backdrop-blur-sm"
          onMouseEnter={openInfoMenu}
          onMouseLeave={scheduleCloseInfoMenu}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              role="menu"
              aria-label="Info"
              className="flex items-center justify-center gap-1 sm:gap-2 py-2.5"
            >
              {infoLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.activeViews.includes(activeView);
                return (
                  <Link
                    key={link.id}
                    id={link.id}
                    to={link.to}
                    role="menuitem"
                    onClick={() => setIsInfoMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-[#1b3552] shadow-sm border border-slate-200/90'
                        : 'text-slate-600 hover:text-[#1b3552] hover:bg-white/80 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${link.iconClass}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compounds..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 rounded-lg border border-slate-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/catalog"
              onClick={closeMobileMenu}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 font-bold text-xs text-slate-900"
            >
              Catalog & Store
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 font-bold text-xs text-slate-900"
            >
              About Lab
            </Link>
            <Link
              to="/faq"
              onClick={closeMobileMenu}
              className="col-span-2 p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 font-bold text-xs text-slate-900"
            >
              Lab FAQ
            </Link>
          </div>

          {/* Mobile Info submenu */}
          <div className="rounded-xl border border-slate-200/80 overflow-hidden">
            <button
              id="mobile-info-toggle"
              type="button"
              aria-expanded={isMobileInfoOpen || isInfoActive}
              onClick={() => setIsMobileInfoOpen((open) => !open)}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-left font-bold text-xs uppercase tracking-wider transition-colors ${
                isInfoActive
                  ? 'bg-[#335e90] text-white'
                  : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Info</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileInfoOpen || isInfoActive ? 'rotate-180' : ''
                }`}
              />
            </button>

            {(isMobileInfoOpen || isInfoActive) && (
              <div className="grid grid-cols-1 divide-y divide-slate-100 bg-white">
                {infoLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = link.activeViews.includes(activeView);
                  return (
                    <Link
                      key={link.id}
                      id={`mobile-${link.id}`}
                      to={link.to}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-2.5 px-3.5 py-3 text-left font-bold text-xs uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-[#335e90]/8 text-[#1b3552]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${link.iconClass}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            onClick={closeMobileMenu}
            className="w-full p-3 text-left bg-[#335e90]/10 hover:bg-[#335e90]/20 rounded-xl border border-[#335e90]/30 font-bold text-xs text-[#1b3552] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#335e90]" />
              <div>
                <div className="font-bold">Contact Laboratory Support</div>
                <div className="text-[10px] text-slate-600 font-normal">24/7 researcher inquiries &amp; batch assistance</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#335e90]" />
          </Link>
        </div>
      )}
    </header>
  );
};
