import { describe, it, expect } from 'vitest';
import { catalogMapper } from './mapper';
import type {
  CatalogDTO,
  CatalogThemeConfigDTO,
  PublicCatalogResponseDTO
} from '../types';
import type { CatalogThemeConfig } from '../types';

describe('CatalogMapper', () => {
  const mockThemeDTO: CatalogThemeConfigDTO = {
    colors: { primary: '#FF0000', background: '#000000', text: '#FFFFFF' },
    branding: { show_cover: false, logo_url: 'logo.png' },
    layout: { mode: 'list', products_per_page: 50 },
    behavior: { display_price: false, whatsapp_message: 'Zap' }
  };

  const mockCatalogDTO: CatalogDTO = {
    id: '123',
    organization_id: 'org-1',
    name: 'Catálogo Teste',
    slug: 'catalogo-teste',
    whatsapp_number: '551199999999',
    description: 'Desc',
    is_active: true,
    theme_config: mockThemeDTO,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  };

  describe('toDomain', () => {
    it('deve mapear corretamente um DTO completo para Domain', () => {
      const result = catalogMapper.toDomain(mockCatalogDTO);

      expect(result.id).toBe('123');
      expect(result.whatsappNumber).toBe('551199999999');
      expect(result.themeConfig.colors.primary).toBe('#FF0000');
      expect(result.themeConfig.branding.showCover).toBe(false);
      expect(result.publicUrl).toContain('/c/catalogo-teste');
    });

    it('deve aplicar Defaults se o theme_config vier vazio ou parcial', () => {
      const dtoIncompleto = {
        ...mockCatalogDTO,
        theme_config: {} as any
      };

      const result = catalogMapper.toDomain(dtoIncompleto);

      expect(result.themeConfig.colors.primary).toBe('#000000');
      expect(result.themeConfig.layout.mode).toBe('grid');
      expect(result.themeConfig.branding.showCover).toBe(true);
    });
  });

  describe('toPersistence', () => {
    it('deve converter Domain Payload (camelCase) para DTO (snake_case)', () => {
      const payloadDomain = {
        name: 'Novo',
        slug: 'novo',
        whatsappNumber: '123',
        isActive: true,
        themeConfig: {
          colors: { primary: '#ABC', background: '#FFF', text: '#000' },
          branding: { showCover: true },
          layout: { mode: 'grid', productsPerPage: 10 },
          behavior: { displayPrice: true, whatsappMessage: 'Oi' }
        } as CatalogThemeConfig
      };

      const result = catalogMapper.toPersistence(payloadDomain);

      expect(result.whatsapp_number).toBe('123');
      expect(result.is_active).toBe(true);
      expect(result.theme_config?.branding.show_cover).toBe(true);
      expect(result.theme_config?.layout.products_per_page).toBe(10);
    });

    it('deve lidar com themeConfig undefined', () => {
      const payloadSemTema = {
        name: 'Sem Tema',
        slug: 'sem-tema',
        whatsappNumber: '123'
      };

      const result = catalogMapper.toPersistence(payloadSemTema);

      expect(result.whatsapp_number).toBe('123');
      expect(result.theme_config).toBeUndefined();
    });
  });

  describe('toPublicStorefront', () => {
    it('deve mapear corretamente a resposta da RPC pública', () => {
      const mockPublicDTO: PublicCatalogResponseDTO = {
        catalog: {
          name: 'Loja Pública',
          description: 'Desc',
          whatsapp_number: '551199999999',
          theme_config: { colors: { primary: '#FFF' } } as any
        },
        items: [
          {
            item_id: 'item-1',
            catalog_slug: 'loja-publica',
            product_name: 'Produto 1',
            product_description: 'Desc Prod',
            variant_id: null,
            variant_attributes: null,
            price: 100,
            original_price: 120,
            is_featured: true,
            images: ['img1.jpg'],
            in_stock: true
          }
        ]
      };

      const result = catalogMapper.toPublicStorefront(mockPublicDTO);

      expect(result.info.name).toBe('Loja Pública');
      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe('Produto 1');
      expect(result.products[0].images).toEqual(['img1.jpg']);
    });

    it('deve lançar erro se os dados do catálogo forem inválidos', () => {
      // @ts-expect-error - Testando caso nulo forçado
      expect(() => catalogMapper.toPublicStorefront(null)).toThrow(
        'Dados do catálogo inválidos.'
      );
      // @ts-expect-error - Testando objeto parcial sem catalog
      expect(() => catalogMapper.toPublicStorefront({ items: [] })).toThrow(
        'Dados do catálogo inválidos.'
      );
    });
  });
});
