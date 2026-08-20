import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { TrustBadges } from './components/storefront/TrustBadges';
import { CategoryBar } from './components/storefront/CategoryBar';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailView } from './components/storefront/ProductDetailView';
import { PeptideCalculator } from './components/calculator/PeptideCalculator';
import { ResearchMonographs } from './components/research/ResearchMonographs';
import { PeptideGuideView } from './components/guide/PeptideGuideView';
import { PeptideResearchLibrarySection } from './components/home/PeptideResearchLibrarySection';
import { HomeCuratedSections } from './components/home/HomeCuratedSections';
import { SourcingSimplifiedSection } from './components/home/SourcingSimplifiedSection';
import { ResearchStandardSection } from './components/home/ResearchStandardSection';
import { AboutView, FaqView, ShippingView, ContactView, TermsView, PrivacyView, RefundView, QualityView } from './components/info/InformationViews';
import { OrderTracker } from './components/tools/OrderTracker';
import { PeptideCompareModal } from './components/tools/PeptideCompareModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AgeVerificationModal } from './components/modals/AgeVerificationModal';
import { ToastContainer } from './components/common/ToastContainer';
import { RecentActivityToast } from './components/common/RecentActivityToast';
import { FloatingSupport } from './components/common/FloatingSupport';
import { BackToTop } from './components/common/BackToTop';
import { SmartsuppChat } from './components/common/SmartsuppChat';
import { CookieComplianceBanner } from './components/common/CookieComplianceBanner';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AdminApp } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminProductsPage } from './admin/pages/AdminProductsPage';
import { AdminProductEditPage } from './admin/pages/AdminProductEditPage';
import { AdminOrdersPage } from './admin/pages/AdminOrdersPage';
import { AdminOrderDetailPage } from './admin/pages/AdminOrderDetailPage';
import { AdminCustomersPage } from './admin/pages/AdminCustomersPage';
import { AdminCustomerDetailPage } from './admin/pages/AdminCustomerDetailPage';
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage';
import { AdminCoasPage } from './admin/pages/AdminCoasPage';
import { AdminInquiriesPage } from './admin/pages/AdminInquiriesPage';

const HomePage = () => (
  <>
    <HeroBanner />
    <TrustBadges />
    <PeptideResearchLibrarySection />
    <HomeCuratedSections />
    <SourcingSimplifiedSection />
    <ResearchStandardSection />
  </>
);

const CatalogPage = () => (
  <>
    <CategoryBar />
    <ProductGrid />
  </>
);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const { selectedProduct } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, selectedProduct?.id]);

  return null;
};

const StorefrontShell: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-50 pb-16 md:pb-0">
      <ScrollToTop />
      <div>
        <Header />
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <AgeVerificationModal />
      <ToastContainer />
      <RecentActivityToast />
      <BackToTop />
      <FloatingSupport />
      <SmartsuppChat />
      <CookieComplianceBanner />
      <MobileBottomNav />
    </main>
  );
};

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminApp />}>
          <Route path="login" element={<AdminLoginPage />} />
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/:id" element={<AdminProductEditPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="coas" element={<AdminCoasPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<StorefrontShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductDetailView />} />
        <Route path="/calculator" element={<PeptideCalculator />} />
        <Route path="/coa" element={<Navigate to="/" replace />} />
        <Route path="/research" element={<ResearchMonographs />} />
        <Route path="/guide" element={<PeptideGuideView />} />
        <Route path="/peptide-guide" element={<Navigate to="/guide" replace />} />
        <Route path="/compare" element={<PeptideCompareModal />} />
        <Route path="/track" element={<OrderTracker />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/faq" element={<FaqView />} />
        <Route path="/shipping" element={<ShippingView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/terms" element={<TermsView />} />
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/refunds" element={<RefundView />} />
        <Route path="/quality" element={<QualityView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
