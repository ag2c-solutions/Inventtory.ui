import { isPostgrestError } from '@/lib/utils';
import { PostgrestError } from '@supabase/supabase-js';

export function handleCatalogError(
  error: PostgrestError | Error | unknown,
  action: string
): never {
  console.error(`Erro em Catalog Service [${action}]:`, error);

  if (isPostgrestError(error)) {
    if (error.code === '23505') {
      if (error.message?.includes('slug') || error.details?.includes('slug')) {
        throw new Error(
          'Este link personalizado já está em uso. Por favor, escolha outro.'
        );
      }
      throw new Error('Já existe um catálogo com estes dados.');
    }

    if (error.code === '42501') {
      throw new Error(
        'Você não tem permissão para realizar alterações nos catálogos.'
      );
    }

    if (error.message.toLowerCase().includes('network')) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error('Ocorreu um erro inesperado ao processar o catálogo.');
}
