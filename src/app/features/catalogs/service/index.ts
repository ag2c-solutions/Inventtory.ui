import { supabase } from '@/app/config/supabase';
import { handleCatalogError } from './error-handler';
import { catalogMapper } from './mapper';
import type { Catalog, CatalogThemeConfig } from '../types'; // Import centralizado
import type { CatalogDTO } from '../types'; // Import centralizado
import { stripUndefined } from '@/lib/utils';

// Campos exatos que queremos buscar (Evita overfetching *)
const selectQuery = `
  id,
  organization_id,
  name,
  slug,
  whatsapp_number,
  description,
  is_active,
  theme_config,
  created_at,
  updated_at
`;

export interface CreateCatalogPayload {
  name: string;
  slug: string;
  whatsappNumber: string;
  description?: string;
  themeConfig: CatalogThemeConfig;
}

export interface UpdateCatalogPayload
  extends Partial<Omit<CreateCatalogPayload, 'slug'>> {
  id: string;
  slug?: string;
  isActive?: boolean;
}

async function getAll(): Promise<Catalog[]> {
  try {
    const { data, error } = await supabase
      .from('catalogs')
      .select(selectQuery)
      .order('created_at', { ascending: false })
      .overrideTypes<CatalogDTO[], { merge: false }>();

    if (error) throw error;

    return data.map(catalogMapper.toDomain);
  } catch (error) {
    handleCatalogError(error, 'getAll');
  }
}

async function getOneById(id: string): Promise<Catalog> {
  try {
    const { data, error } = await supabase
      .from('catalogs')
      .select(selectQuery)
      .eq('id', id)
      .single()
      .overrideTypes<CatalogDTO, { merge: false }>();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Catálogo não encontrado.');
      }
      throw error;
    }

    return catalogMapper.toDomain(data);
  } catch (error) {
    handleCatalogError(error, 'getOneById');
  }
}

async function add(params: CreateCatalogPayload): Promise<Catalog> {
  try {
    const rawDbPayload = catalogMapper.toPersistence({
      ...params,
      isActive: true
    });

    const dbPayload = stripUndefined(rawDbPayload);

    const { data, error } = await supabase
      .from('catalogs')
      .insert(dbPayload)
      .select(selectQuery)
      .single()
      .overrideTypes<CatalogDTO, { merge: false }>();

    if (error) throw error;

    return catalogMapper.toDomain(data);
  } catch (error) {
    handleCatalogError(error, 'add');
  }
}

async function update(params: UpdateCatalogPayload): Promise<Catalog> {
  try {
    const { id, ...updates } = params;
    const rawDbUpdates = catalogMapper.toPersistence(updates);
    const dbUpdates = {
      ...stripUndefined(rawDbUpdates),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('catalogs')
      .update(dbUpdates)
      .eq('id', id)
      .select(selectQuery)
      .single()
      .overrideTypes<CatalogDTO, { merge: false }>();

    if (error) throw error;

    return catalogMapper.toDomain(data);
  } catch (error) {
    handleCatalogError(error, 'update');
  }
}
async function remove(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('catalogs').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleCatalogError(error, 'remove');
  }
}

async function checkSlugAvailability(slug: string): Promise<boolean> {
  if (!slug || slug.length < 3) return false;

  try {
    const { count, error } = await supabase
      .from('catalogs')
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug);

    if (error) return false;

    return count === 0;
  } catch (error) {
    console.error('Erro ao verificar slug:', error);

    return false;
  }
}

export const CatalogService = {
  getAll,
  getOneById,
  add,
  update,
  remove,
  checkSlugAvailability
};
