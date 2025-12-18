export interface CatalogThemeConfig {
  colors: {
    primary: string;
    background: string;
    secondary?: string;
    text?: string;
  };
  branding: {
    showCover: boolean;
    logoUrl?: string;
    coverImageUrl?: string;
  };
  layout: {
    mode: 'grid' | 'list';
    productsPerPage: number;
    cardStyle?: 'minimal' | 'shadow' | 'border';
  };
  behavior: {
    displayPrice: boolean;
    whatsappMessage: string;
    showOutOfStock?: boolean;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface Catalog {
  id: string;
  name: string;
  slug: string;
  whatsappNumber: string;
  description: string;
  isActive: boolean;
  themeConfig: CatalogThemeConfig;
  createdAt: Date;
  publicUrl: string;
}

export interface CatalogItem {
  id: string;
  productId: string;
  variantId: string | null;
  price: number;
  originalPrice: number | null;
  isFeatured: boolean;
}

export interface PublicStorefront {
  info: {
    name: string;
    description: string;
    whatsappNumber: string;
    theme: CatalogThemeConfig;
  };
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number | null;
    images: string[];
    isFeatured: boolean;
    isInStock: boolean;
    variant?: {
      id: string;
      attributes: Record<string, string>;
    };
  }>;
}
