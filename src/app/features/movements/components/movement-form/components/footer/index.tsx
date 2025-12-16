import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useMovementForm } from '../../hooks';

export function MovementFormFooter() {
  const { form } = useMovementForm();
  const totalItems = form.getValues('totalQuantity');

  return (
    <div className="absolute bottom-0 left-0 rounded-xl right-0 border-t py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-background z-20">
      <div className="container mx-auto px-2 sm:px-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Resumo do Lote</span>
          <span className="text-sm md:text-lg font-bold">
            {totalItems || 0} Itens
          </span>
        </div>
        <Button
          size="lg"
          type="submit"
          disabled={totalItems === 0 || form.formState.isSubmitting}
          className="hidden! sm:flex!"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Finalizar Movimentação
        </Button>
        <Button
          size="sm"
          type="submit"
          disabled={totalItems === 0 || form.formState.isSubmitting}
          className="sm:hidden!"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Finalizar Movimentação
        </Button>
      </div>
    </div>
  );
}
