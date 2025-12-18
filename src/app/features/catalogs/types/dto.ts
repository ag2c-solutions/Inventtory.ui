export interface CatalogThemeConfigDTO {
  colors: {
    primary: string;
    background: string;
    secondary?: string;
    text?: string;
  };
  branding: {
    show_cover: boolean;
    logo_url?: string;
    cover_image_url?: string;
  };
  layout: {
    mode: 'grid' | 'list';
    products_per_page: number;
    card_style?: 'minimal' | 'shadow' | 'border';
  };
  behavior: {
    display_price: boolean;
    whatsapp_message: string;
    show_out_of_stock?: boolean;
  };
  social_links?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface CatalogDTO {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  whatsapp_number: string;
  description: string | null;
  is_active: boolean;
  theme_config: CatalogThemeConfigDTO;
  created_at: string;
  updated_at: string;
}

export interface CatalogItemDTO {
  id: string;
  catalog_id: string;
  product_id: string;
  variant_id: string | null;
  price: number;
  original_price: number | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface PublicCatalogResponseDTO {
  catalog: {
    name: string;
    description: string | null;
    whatsapp_number: string;
    theme_config: CatalogThemeConfigDTO;
  };
  items: Array<{
    item_id: string;
    catalog_slug: string;
    product_name: string;
    product_description: string | null;
    variant_id: string | null;
    variant_attributes: Record<string, string> | null;
    price: number;
    original_price: number | null;
    is_featured: boolean;
    images: string[];
    in_stock: boolean;
  }>;
}
