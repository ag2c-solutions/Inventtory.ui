import { describe, it, expect, vi } from 'vitest';
import { handleCatalogError } from './error-handler';

describe('handleCatalogError', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  it('should rethrow duplicate error (23505) with a friendly message', () => {
    const error = {
      code: '23505',
      message: 'duplicate key value violates unique constraint "slug"',
      details: 'Key (slug)=(teste) already exists.'
    };

    expect(() => handleCatalogError(error, 'test')).toThrow(
      'Este link personalizado já está em uso'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should rethrow generic duplicate error (23505) if not slug', () => {
    const error = {
      code: '23505',
      message: 'duplicate key value violates other constraint',
      details: ''
    };
    expect(() => handleCatalogError(error, 'test')).toThrow(
      'Já existe um catálogo com estes dados.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should handle permission error (42501)', () => {
    const error = {
      code: '42501',
      message: 'permission denied',
      details: ''
    };

    expect(() => handleCatalogError(error, 'test')).toThrow(
      'Você não tem permissão para realizar alterações nos catálogos.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should handle network error', () => {
    const error = {
      code: 'XXXXX',
      message: 'Network request failed',
      details: ''
    };

    expect(() => handleCatalogError(error, 'test')).toThrow(
      'Erro de conexão. Verifique sua internet.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should rethrow generic error', () => {
    const error = new Error('Erro customizado');

    expect(() => handleCatalogError(error, 'test')).toThrow('Erro customizado');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should throw generic fallback error for unknown types', () => {
    const error = { foo: 'bar' };

    expect(() => handleCatalogError(error, 'test')).toThrow(
      'Ocorreu um erro inesperado ao processar o catálogo.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });
});
