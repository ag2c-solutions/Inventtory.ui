import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { ProductFormFieldCategory } from './field-category';
import { useProductForm } from '../../hook';
import { ProductFormFieldImages } from './field-product-images';

export function ProductBasicInfo() {
  const { form, mode, handleNameChange, handleVariantSwitch } =
    useProductForm();

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 pb-6">
      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name={'name'}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Camisa Social Slim Fit"
                    disabled={mode === 'Create' ? false : true}
                    {...field}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name={'sku'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: CS-01"
                  className="uppercase"
                  disabled={mode === 'Create' ? false : true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name={'minimumStock'}
          render={({ field }) => (
            <FormItem>
              <FormLabel title="Estoque Mínimo">Est. Mínimo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="0"
                  {...field}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value === '' ? null : +value);
                  }}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <ProductFormFieldCategory />
      </div>

      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name={'description'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-y min-h-[100px]"
                  placeholder="Descreva as características principais..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name={'hasVariants'}
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Variações</FormLabel>
                <div className="space-y-0.5 flex justify-between rounded-lg border p-4">
                  <FormDescription className="text-xs sm:text-sm">
                    O produto possui grade? (Cor, Tamanho...)
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleVariantSwitch}
                      disabled={
                        mode === 'Edit' &&
                        !form.getFieldState('hasVariants').isDirty &&
                        field.value === true
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            );
          }}
        />
      </div>

      <div className="col-span-12">
        <ProductFormFieldImages />
      </div>
    </div>
  );
}
