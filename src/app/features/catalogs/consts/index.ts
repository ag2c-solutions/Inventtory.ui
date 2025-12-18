import type { CatalogThemeConfig } from '../types';

export const DEFAULT_THEME: CatalogThemeConfig = {
  colors: { primary: '#000000', background: '#ffffff', text: '#1f2937' },
  branding: { showCover: true },
  layout: { mode: 'grid', productsPerPage: 20 },
  behavior: {
    displayPrice: true,
    whatsappMessage: 'Olá! Vi estes itens no catálogo:'
  }
};
