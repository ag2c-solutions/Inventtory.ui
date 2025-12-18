import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogService } from '../service';
import {
  useCatalogsQuery,
  useCatalogByIDQuery,
  useCatalogCreateMutation,
  useCatalogUpdateMutation,
  useCatalogRemoveMutation,
  useCatalogCheckSlugAvailabilityMutation
} from './use-query';
import type { Catalog } from '../types';
import type { CreateCatalogPayload, UpdateCatalogPayload } from '../service';

vi.mock('../service', () => ({
  CatalogService: {
    getAll: vi.fn(),
    getOneById: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    checkSlugAvailability: vi.fn()
  }
}));

describe('Catalogs Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useCatalogsQuery', () => {
    it('should fetch catalogs using CatalogService.getAll', async () => {
      const mockCatalogs = [{ id: '1', name: 'Catalog A' }] as Catalog[];
      vi.mocked(CatalogService.getAll).mockResolvedValue(mockCatalogs);

      const { result } = renderHook(() => useCatalogsQuery(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(CatalogService.getAll).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockCatalogs);
    });
  });

  describe('useCatalogByIDQuery', () => {
    it('should fetch a single catalog using CatalogService.getOneById', async () => {
      const catalogId = '123';
      const mockCatalog = { id: catalogId, name: 'Catalog B' } as Catalog;
      vi.mocked(CatalogService.getOneById).mockResolvedValue(mockCatalog);

      const { result } = renderHook(() => useCatalogByIDQuery(catalogId), {
        wrapper
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(CatalogService.getOneById).toHaveBeenCalledWith(catalogId);
      expect(result.current.data).toEqual(mockCatalog);
    });
  });

  describe('useCatalogCreateMutation', () => {
    it('should create catalog and invalidate "catalogs" query', async () => {
      const payload: CreateCatalogPayload = {
        name: 'New Catalog',
        slug: 'new-catalog',
        whatsappNumber: '1234567890',
        themeConfig: {
          colors: {
            primary: '#000000',
            background: '#ffffff'
          },
          branding: {
            showCover: true
          },
          layout: {
            mode: 'grid',
            productsPerPage: 12
          },
          behavior: {
            displayPrice: true,
            whatsappMessage: 'Hello'
          }
        }
      };

      vi.mocked(CatalogService.add).mockResolvedValue({
        id: 'new',
        ...payload
      } as unknown as Catalog);

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCatalogCreateMutation(), {
        wrapper
      });

      await result.current.mutateAsync(payload);

      expect(CatalogService.add).toHaveBeenCalledWith(payload);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['catalogs'] });
    });
  });

  describe('useCatalogUpdateMutation', () => {
    it('should update catalog and invalidate both "catalogs" and specific "catalog" queries', async () => {
      const payload: UpdateCatalogPayload = {
        id: '123',
        name: 'Updated Catalog'
      };

      vi.mocked(CatalogService.update).mockResolvedValue({
        ...payload,
        slug: 'updated-catalog'
      } as unknown as Catalog);

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCatalogUpdateMutation(), {
        wrapper
      });

      await result.current.mutateAsync(payload);

      expect(CatalogService.update).toHaveBeenCalledWith(payload);

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['catalogs'] });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['catalog', '123']
      });
    });
  });

  describe('useCatalogRemoveMutation', () => {
    it('should remove catalog and invalidate "catalogs" query', async () => {
      const catalogId = '123';
      vi.mocked(CatalogService.remove).mockResolvedValue(undefined);

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCatalogRemoveMutation(), {
        wrapper
      });

      await result.current.mutateAsync(catalogId);

      expect(CatalogService.remove).toHaveBeenCalledWith(catalogId);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['catalogs'] });
    });
  });

  describe('useCatalogCheckSlugAvailabilityMutation', () => {
    it('should check slug availability', async () => {
      const slug = 'test-slug';
      vi.mocked(CatalogService.checkSlugAvailability).mockResolvedValue(true);

      const { result } = renderHook(
        () => useCatalogCheckSlugAvailabilityMutation(),
        {
          wrapper
        }
      );

      const data = await result.current.mutateAsync(slug);

      expect(CatalogService.checkSlugAvailability).toHaveBeenCalledWith(slug);
      expect(data).toBe(true);
    });
  });
});
