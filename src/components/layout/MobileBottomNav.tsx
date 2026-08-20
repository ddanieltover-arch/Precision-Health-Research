import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { 
  Home, 
  FlaskConical, 
  BookOpen, 
  Calculator, 
  ShoppingBag,
} from 'lucide-react';
import { viewFromPath } from '../../lib/routes';

export const MobileBottomNav: React.FC = () => {
  const { cartItemCount, setIsCartOpen } = useStore();
  const { pathname } = useLocation();
  const activeView = viewFromPath(pathname);

  const navItems = [
    {
      id: 'mobile-nav-home',
      label: 'Home',
      icon: Home,
      to: '/',
      isActive: activeView === 'home',
    },
    {
      id: 'mobile-nav-catalog',
      label: 'Catalog',
      icon: FlaskConical,
      to: '/catalog',
      isActive: activeView === 'catalog' || activeView === 'product-detail',
    },
    {
      id: 'mobile-nav-guide',
      label: 'Guide',
      icon: BookOpen,
      to: '/guide',
      badge: 'New',
      isActive: activeView === 'guide' || activeView === 'peptide-guide',
    },
    {
      id: 'mobile-nav-calculator',
      label: 'Calculator',
      icon: Calculator,
      to: '/calculator',
      isActive: activeView === 'calculator',
    },
    {
      id: 'mobile-nav-cart',
      label: 'Cart',
      icon: ShoppingBag,
      count: cartItemCount,
      isActive: false,
      onClick: () => setIsCartOpen(true),
    },
  ];

  return (
    <div 
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,29,47,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <nav aria-label="Mobile Bottom Navigation" className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          const className = `relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group ${
            active 
              ? 'text-[#335e90]' 
              : 'text-slate-500 hover:text-slate-800'
          }`;

          const content = (
            <>
              {active && (
                <span className="absolute -top-1.5 w-7 h-1 bg-[#335e90] rounded-full shadow-xs" />
              )}

              <div className="relative p-1">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8] group-hover:scale-105'
                  }`} 
                />

                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[17px] h-[17px] px-1 bg-[#335e90] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50 duration-200">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}

                {item.badge && !active && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-500 text-white text-[8px] font-extrabold uppercase rounded-full tracking-tighter shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span 
                className={`text-[10px] tracking-tight leading-tight transition-all ${
                  active 
                    ? 'font-extrabold text-[#335e90]' 
                    : 'font-medium text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </>
          );

          if (item.onClick) {
            return (
              <button
                key={item.id}
                id={item.id}
                onClick={item.onClick}
                className={className}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              id={item.id}
              to={item.to!}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
