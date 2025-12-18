import type { CatalogThemeConfigDTO, CatalogThemeConfig } from '../types';

const DEFAULT_THEME: CatalogThemeConfig = {
  colors: { primary: '#000000', background: '#ffffff', text: '#1f2937' },
  branding: { showCover: true },
  layout: { mode: 'grid', productsPerPage: 20 },
  behavior: {
    displayPrice: true,
    whatsappMessage: 'Olá! Vi estes itens no catálogo:'
  }
};

const resolveColors = (dto?: CatalogThemeConfigDTO['colors']) => ({
  primary: dto?.primary ?? DEFAULT_THEME.colors.primary,
  background: dto?.background ?? DEFAULT_THEME.colors.background,
  text: dto?.text ?? DEFAULT_THEME.colors.text,
  secondary: dto?.secondary
});

const resolveBranding = (dto?: CatalogThemeConfigDTO['branding']) => ({
  showCover: dto?.show_cover ?? DEFAULT_THEME.branding.showCover,
  logoUrl: dto?.logo_url,
  coverImageUrl: dto?.cover_image_url
});

const resolveLayout = (dto?: CatalogThemeConfigDTO['layout']) => ({
  mode: dto?.mode ?? DEFAULT_THEME.layout.mode,
  productsPerPage:
    dto?.products_per_page ?? DEFAULT_THEME.layout.productsPerPage,
  cardStyle: dto?.card_style
});

const resolveBehavior = (dto?: CatalogThemeConfigDTO['behavior']) => ({
  displayPrice: dto?.display_price ?? DEFAULT_THEME.behavior.displayPrice,
  whatsappMessage:
    dto?.whatsapp_message ?? DEFAULT_THEME.behavior.whatsappMessage,
  showOutOfStock: dto?.show_out_of_stock
});

export function parseThemeConfig(
  dto: CatalogThemeConfigDTO | null | undefined
): CatalogThemeConfig {
  return {
    colors: resolveColors(dto?.colors ? dto.colors : undefined),
    branding: resolveBranding(dto?.branding ? dto.branding : undefined),
    layout: resolveLayout(dto?.layout ? dto.layout : undefined),
    behavior: resolveBehavior(dto?.behavior ? dto.behavior : undefined),
    socialLinks: dto?.social_links ? dto.social_links : undefined
  };
}

export function formatThemeForPersistence(
  domain: CatalogThemeConfig
): CatalogThemeConfigDTO {
  const colors = domain?.colors || DEFAULT_THEME.colors;
  const branding = domain?.branding || DEFAULT_THEME.branding;
  const layout = domain?.layout || DEFAULT_THEME.layout;
  const behavior = domain?.behavior || DEFAULT_THEME.behavior;

  return {
    colors: {
      primary: colors.primary ?? DEFAULT_THEME.colors.primary,
      background: colors.background ?? DEFAULT_THEME.colors.background,
      text: colors.text ?? DEFAULT_THEME.colors.text,
      secondary: colors.secondary
    },
    branding: {
      show_cover: branding.showCover ?? DEFAULT_THEME.branding.showCover,
      logo_url: branding.logoUrl,
      cover_image_url: branding.coverImageUrl
    },
    layout: {
      mode: layout.mode ?? DEFAULT_THEME.layout.mode,
      products_per_page:
        layout.productsPerPage ?? DEFAULT_THEME.layout.productsPerPage,
      card_style: layout.cardStyle
    },
    behavior: {
      display_price:
        behavior.displayPrice ?? DEFAULT_THEME.behavior.displayPrice,
      whatsapp_message:
        behavior.whatsappMessage ?? DEFAULT_THEME.behavior.whatsappMessage,
      show_out_of_stock: behavior.showOutOfStock
    },
    social_links: domain?.socialLinks
  };
}
