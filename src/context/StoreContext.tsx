import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product, CartItem, CurrencyCode, Currency, ActiveView } from '../types';
import { PRODUCTS } from '../data/catalog';
import { pathForView, viewFromPath, productSlugFromPath } from '../lib/routes';

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  GBP: { code: 'GBP', symbol: '£', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 1.17 },
  USD: { code: 'USD', symbol: '$', rate: 1.28 },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.74 },
};

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  currency: Currency;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatPrice: (amountInUsd: number) => string;

  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductDetail: (product: Product) => void;
  
  selectedCategory: string;
  setSelectedCategory: (catSlug: string) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  calcPrefill: { peptideMg: number; waterMl: number; doseMcg: number } | null;
  openCalculatorWithProduct: (product: Product) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  ageVerified: boolean;
  setAgeVerified: (verified: boolean) => void;

  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeView = viewFromPath(location.pathname);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('phr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>('GBP');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [calcPrefill, setCalcPrefill] = useState<{ peptideMg: number; waterMl: number; doseMcg: number } | null>(null);

  const selectedProductRef = useRef(selectedProduct);
  selectedProductRef.current = selectedProduct;

  const [ageVerified, setAgeVerifiedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('phr_age_verified') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('phr_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Keep product detail in sync when landing on /product/:slug (refresh, share link, back/forward)
  useEffect(() => {
    const slug = productSlugFromPath(location.pathname);
    if (!slug) return;
    const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug) ?? null;
    setSelectedProduct(product);
  }, [location.pathname]);

  const setAgeVerified = (verified: boolean) => {
    setAgeVerifiedState(verified);
    try {
      localStorage.setItem('phr_age_verified', verified ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const currency = CURRENCIES[currencyCode];

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    addToast('Currency Updated', `Switched display currency to ${code} (${CURRENCIES[code].symbol})`, 'info');
  };

  const formatPrice = (amountInUsd: number) => {
    const converted = amountInUsd * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const setActiveView = useCallback((view: ActiveView) => {
    const product = selectedProductRef.current;
    const slug = product?.slug || product?.id || null;
    navigate(pathForView(view, slug));
  }, [navigate]);

  const addToCart = (product: Product, variantId?: string, quantity: number = 1) => {
    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    const unitPrice = product.basePrice + (variant?.priceModifier || 0);
    const variantName = variant?.value || '';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === (variant?.id || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variant?.id,
            name: product.name,
            slug: product.slug,
            variantName,
            price: unitPrice,
            quantity,
            image: product.thumbnailUrl,
            purity: product.purity,
          },
        ];
      }
    });

    addToast('Added to Cart', `${quantity}× ${product.name} ${variantName ? `(${variantName})` : ''}`, 'success');
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && (item.variantId === variantId || !variantId)))
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && (!variantId || item.variantId === variantId)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openProductDetail = useCallback((product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.slug || product.id}`);
  }, [navigate]);

  const openCalculatorWithProduct = (product: Product) => {
    let mg = 5;
    if (product.name.includes('10mg')) mg = 10;
    else if (product.name.includes('15mg')) mg = 15;
    else if (product.name.includes('30mg')) mg = 30;
    else if (product.name.includes('50mg')) mg = 50;
    else if (product.name.includes('60mg')) mg = 60;
    else if (product.name.includes('500mg')) mg = 500;
    
    setCalcPrefill({
      peptideMg: mg,
      waterMl: product.reconstitutionVolMl || 2.0,
      doseMcg: mg >= 10 ? 500 : 250,
    });
    navigate('/calculator');
    addToast('Calculator Loaded', `Pre-configured parameters for ${product.name}`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrencyCode,
        formatPrice,
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        calcPrefill,
        openCalculatorWithProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        ageVerified,
        setAgeVerified,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
