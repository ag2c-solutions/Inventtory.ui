import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CatalogService } from './index';
import type { CatalogDTO } from '../types';

const { mockSupabase, mockSelect, mockOverrideTypes, mockEq } = vi.hoisted(
  () => {
    const mockSelect = vi.fn();
    const mockOrder = vi.fn();
    const mockEq = vi.fn();
    const mockSingle = vi.fn();
    const mockOverrideTypes = vi.fn();
    const mockInsert = vi.fn();
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    const queryBuilder = {
      select: mockSelect,
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
      overrideTypes: mockOverrideTypes,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete
    };

    mockSelect.mockReturnValue(queryBuilder);
    mockOrder.mockReturnValue(queryBuilder);
    mockEq.mockReturnValue(queryBuilder);
    mockSingle.mockReturnValue(queryBuilder);
    mockInsert.mockReturnValue(queryBuilder);
    mockUpdate.mockReturnValue(queryBuilder);
    mockDelete.mockReturnValue(queryBuilder);

    return {
      mockSupabase: {
        from: vi.fn(() => queryBuilder)
      },
      mockSelect,
      mockOrder,
      mockEq,
      mockSingle,
      mockOverrideTypes,
      mockInsert,
      mockUpdate,
      mockDelete
    };
  }
);

vi.mock('@/app/config/supabase', () => ({
  supabase: mockSupabase
}));

const mockCatalogDTO: CatalogDTO = {
  id: 'cat-1',
  organization_id: 'org-1',
  name: 'Catálogo Teste',
  slug: 'teste',
  whatsapp_number: '551199999999',
  description: 'Desc',
  is_active: true,
  theme_config: {} as any,
  created_at: '2023-01-01',
  updated_at: '2023-01-01'
};

describe('CatalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const consoleErrorSpy = vi.spyOn(console, 'error');

  afterEach(() => {
    consoleErrorSpy.mockReset();
  });

  describe('getAll', () => {
    it('should return a list of mapped catalogs', async () => {
      mockOverrideTypes.mockResolvedValue({
        data: [mockCatalogDTO],
        error: null
      });

      const result = await CatalogService.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith('catalogs');
      expect(mockSelect).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('cat-1');
      expect(result[0].whatsappNumber).toBe('551199999999');
    });

    it('should throw handled error on failure', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockOverrideTypes.mockResolvedValue({
        data: null,
        error: { message: 'Erro DB', code: 'PGRST000' }
      });

      await expect(CatalogService.getAll()).rejects.toThrow(
        'Ocorreu um erro inesperado ao processar o catálogo.'
      );
    });
  });

  describe('getOneById', () => {
    it('should return a mapped catalog by id', async () => {
      mockOverrideTypes.mockResolvedValue({
        data: mockCatalogDTO,
        error: null
      });

      const result = await CatalogService.getOneById('cat-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('catalogs');
      expect(mockEq).toHaveBeenCalledWith('id', 'cat-1');
      expect(result.id).toBe('cat-1');
    });

    it('should throw "Catalog not found" error for PGRST116 code', async () => {
      mockOverrideTypes.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Row not found' }
      });

      await expect(CatalogService.getOneById('id-inexistente')).rejects.toThrow(
        'Catálogo não encontrado.'
      );
    });

    it('should throw handled error for generic database errors', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockOverrideTypes.mockResolvedValue({
        data: null,
        error: { code: '500', message: 'Database crash' }
      });

      await expect(CatalogService.getOneById('cat-1')).rejects.toThrow(
        'Ocorreu um erro inesperado ao processar o catálogo.'
      );
    });
  });

  describe('add', () => {
    it('should insert and return created catalog', async () => {
      mockOverrideTypes.mockResolvedValue({
        data: mockCatalogDTO,
        error: null
      });

      const payload = {
        name: 'Novo',
        slug: 'novo',
        whatsappNumber: '123',
        themeConfig: {} as any
      };

      const result = await CatalogService.add(payload);
      const insertCall = vi.mocked(mockSupabase.from().insert).mock.calls[0][0];

      expect(insertCall).toMatchObject({
        whatsapp_number: '123',
        slug: 'novo',
        is_active: true
      });

      expect(result.id).toBe('cat-1');
    });

    it('should handle Duplicate Slug error (Code 23505)', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockOverrideTypes.mockResolvedValue({
        data: null,
        error: {
          code: '23505',
          message: 'duplicate key value violates unique constraint',
          details: 'Key (slug)=(teste) already exists.'
        }
      });

      const payload = {
        name: 'A',
        slug: 'teste',
        whatsappNumber: '1',
        themeConfig: {} as any
      };

      await expect(CatalogService.add(payload)).rejects.toThrow(
        'Este link personalizado já está em uso. Por favor, escolha outro.'
      );
    });

    it('should throw generic error on insertion failure', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockOverrideTypes.mockResolvedValue({
        data: null,
        error: { code: '500', message: 'Insert failed' }
      });

      const payload = {
        name: 'A',
        slug: 'teste',
        whatsappNumber: '1',
        themeConfig: {} as any
      };

      await expect(CatalogService.add(payload)).rejects.toThrow(
        'Ocorreu um erro inesperado ao processar o catálogo.'
      );
    });
  });

  describe('update', () => {
    it('should update only provided fields (Patch)', async () => {
      mockOverrideTypes.mockResolvedValue({
        data: { ...mockCatalogDTO, name: 'Editado' },
        error: null
      });

      const payload = { id: 'cat-1', name: 'Editado' };
      const result = await CatalogService.update(payload);
      const updateCall = vi.mocked(mockSupabase.from().update).mock.calls[0][0];

      expect(updateCall.name).toBe('Editado');
      expect(updateCall.whatsapp_number).toBeUndefined();
      expect(updateCall.theme_config).toBeUndefined();
      expect(updateCall.updated_at).toBeDefined();
      expect(result.name).toBe('Editado');
    });

    it('should update theme config if provided', async () => {
      mockOverrideTypes.mockResolvedValue({
        data: { ...mockCatalogDTO },
        error: null
      });

      const payload = {
        id: 'cat-1',
        themeConfig: {
          colors: { primary: '#FFF', background: '#000' },
          branding: { showCover: true },
          layout: { mode: 'list', productsPerPage: 10 },
          behavior: { displayPrice: true, whatsappMessage: 'Oi' }
        } as any
      };

      await CatalogService.update(payload);
      const updateCall = vi.mocked(mockSupabase.from().update).mock.calls[0][0];

      expect(updateCall.theme_config).toBeDefined();
      expect(updateCall.theme_config.colors.primary).toBe('#FFF');
    });

    it('should throw handled error on update failure', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockOverrideTypes.mockResolvedValue({
        data: null,
        error: { code: '500', message: 'Update failed' }
      });

      const payload = { id: 'cat-1', name: 'Fail' };
      await expect(CatalogService.update(payload)).rejects.toThrow(
        'Ocorreu um erro inesperado ao processar o catálogo.'
      );
    });
  });

  describe('remove', () => {
    it('should delete a catalog successfully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        })
      } as any);

      await expect(CatalogService.remove('cat-1')).resolves.not.toThrow();
    });

    it('should handle error when deleting', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: 'DB Error' } })
        })
      } as any);

      await expect(CatalogService.remove('cat-1')).rejects.toThrow(
        'Ocorreu um erro inesperado'
      );
    });
  });

  describe('checkSlugAvailability', () => {
    it('should return true if count is 0', async () => {
      const mockSelectCount = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ count: 0, error: null })
      });

      mockSupabase.from.mockReturnValue({ select: mockSelectCount } as any);

      const isAvailable = await CatalogService.checkSlugAvailability('livre');

      expect(isAvailable).toBe(true);
    });

    it('should return false if count > 0', async () => {
      const mockSelectCount = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ count: 1, error: null })
      });

      mockSupabase.from.mockReturnValue({ select: mockSelectCount } as any);

      const isAvailable = await CatalogService.checkSlugAvailability('ocupado');

      expect(isAvailable).toBe(false);
    });

    it('should return false if slug is invalid or too short', async () => {
      const resultEmpty = await CatalogService.checkSlugAvailability('');
      const resultShort = await CatalogService.checkSlugAvailability('ab');

      expect(resultEmpty).toBe(false);
      expect(resultShort).toBe(false);
    });

    it('should return false if database throws exception', async () => {
      consoleErrorSpy.mockImplementation(() => {});
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Crash Database');
      });

      const result = await CatalogService.checkSlugAvailability('slug-teste');

      expect(result).toBe(false);
    });

    it('should return false if database returns error object', async () => {
      const mockSelectCount = vi.fn().mockReturnValue({
        eq: vi
          .fn()
          .mockResolvedValue({ count: null, error: { message: 'DB Error' } })
      });
      mockSupabase.from.mockReturnValue({ select: mockSelectCount } as any);

      const result = await CatalogService.checkSlugAvailability('error-slug');
      expect(result).toBe(false);
    });
  });
});
