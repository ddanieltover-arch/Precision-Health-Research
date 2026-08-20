export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier relative to USD
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  comparePrice?: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  purity: string; // e.g. "≥99.4%"
  casNumber?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  sequence?: string;
  storage: string;
  thumbnailUrl: string;
  variants: ProductVariant[];
  badges?: string[];
  reconstitutionVolMl?: number;
  coaUrl?: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
  purity: string;
}

export interface CertificateOfAnalysis {
  id: string;
  productName: string;
  slug: string;
  lotNumber: string;
  purityScore: number; // e.g. 99.6
  testDate: string;
  testMethod: string;
  labName: string;
  status: 'Passed' | 'Verified';
  testedConcentration: string;
  documentUrl?: string;
  previewUrl?: string;
  sequence?: string;
  casNumber?: string;
}

export interface ResearchMonograph {
  id: string;
  title: string;
  slug: string;
  category: string;
  abstract: string;
  keyFindings: string[];
  molecularDetails: {
    cas: string;
    formula: string;
    weight: string;
    purity: string;
  };
  reconstitutionNotes: string;
  references: string[];
}

export type ActiveView = 
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'calculator'
  | 'coa'
  | 'research'
  | 'guide'
  | 'peptide-guide'
  | 'about'
  | 'faq'
  | 'shipping'
  | 'contact'
  | 'track'
  | 'compare'
  | 'terms'
  | 'privacy'
  | 'refunds'
  | 'quality';
