import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CatalogService } from '../service';
import type { CreateCatalogPayload, UpdateCatalogPayload } from '../service';

export function useCatalogsQuery() {
  return useQuery({
    queryKey: ['catalogs'],
    queryFn: CatalogService.getAll,
    staleTime: 1000 * 60 * 5
  });
}

export function useCatalogByIDQuery(id: string) {
  return useQuery({
    queryKey: ['catalog', id],
    queryFn: ({ queryKey }) => CatalogService.getOneById(queryKey[1] as string),
    enabled: !!id
  });
}

export function useCatalogCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createCatalog'],
    mutationFn: (payload: CreateCatalogPayload) => CatalogService.add(payload),
    meta: { successMessage: 'Catálogo criado com sucesso' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
    }
  });
}

export function useCatalogUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateCatalog'],
    mutationFn: (payload: UpdateCatalogPayload) =>
      CatalogService.update(payload),
    meta: { successMessage: 'Catálogo atualizado com sucesso' },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });

      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ['catalog', data.id] });
      }
    }
  });
}

export function useCatalogRemoveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['removeCatalog'],
    mutationFn: (id: string) => CatalogService.remove(id),
    meta: { successMessage: 'Catálogo removido com sucesso' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
    }
  });
}

export function useCatalogCheckSlugAvailabilityMutation() {
  return useMutation({
    mutationKey: ['checkSlugAvailability'],
    mutationFn: (slug: string) => CatalogService.checkSlugAvailability(slug)
  });
}
