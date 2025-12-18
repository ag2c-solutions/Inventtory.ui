import type { CreateCatalogPayload } from '.';
import type {
  Catalog,
  CatalogDTO,
  PublicCatalogResponseDTO,
  PublicStorefront
} from '../types';
import { formatThemeForPersistence, parseThemeConfig } from '../utils';

export const catalogMapper = {
  toDomain(dto: CatalogDTO): Catalog {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      whatsappNumber: dto.whatsapp_number,
      description: dto.description || '',
      isActive: dto.is_active,
      themeConfig: parseThemeConfig(dto.theme_config),
      createdAt: new Date(dto.created_at),
      publicUrl: `${window.location.origin}/c/${dto.slug}`
    };
  },

  toPersistence(
    payload: Partial<CreateCatalogPayload & { isActive?: boolean }>
  ): Partial<CatalogDTO> {
    return {
      name: payload.name,
      slug: payload.slug,
      whatsapp_number: payload.whatsappNumber,
      description: payload.description,
      is_active: payload.isActive,
      theme_config: payload.themeConfig
        ? formatThemeForPersistence(payload.themeConfig)
        : undefined
    };
  },

  toPublicStorefront(dto: PublicCatalogResponseDTO): PublicStorefront {
    if (!dto || !dto.catalog) {
      throw new Error('Dados do catálogo inválidos.');
    }

    return {
      info: {
        name: dto.catalog.name,
        description: dto.catalog.description || '',
        whatsappNumber: dto.catalog.whatsapp_number,
        theme: parseThemeConfig(dto.catalog.theme_config)
      },
      products: (dto.items || []).map((item) => ({
        id: item.item_id,
        name: item.product_name,
        description: item.product_description || '',
        price: item.price,
        originalPrice: item.original_price,
        isFeatured: item.is_featured,
        isInStock: item.in_stock,
        images: Array.isArray(item.images) ? item.images : [],
        variant: item.variant_id
          ? {
              id: item.variant_id,
              attributes: item.variant_attributes || {}
            }
          : undefined
      }))
    };
  }
};
