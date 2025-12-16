import { Button } from '@/app/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/app/components/ui/tooltip';
import { CircleX, SquareCheck, TriangleAlert } from 'lucide-react';
import { getProductStockStatus } from '../../../utils';
import type { IProductVariant } from '../../../types/models';

type TProductTableColumnStock = {
  totalStock: number;
  minimumStock?: number;
  variants?: IProductVariant[];
};

export function ProductTableColumnStock({
  totalStock,
  minimumStock,
  variants = []
}: TProductTableColumnStock) {
  if (!variants || variants.length === 0) {
    const status = getProductStockStatus(totalStock, minimumStock);
    const config = getStatusConfig(status);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-transparent"
          >
            {config.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{config.label}</p>
            <p className="text-xs text-muted-foreground">
              Estoque Atual: {totalStock}
            </p>
            {minimumStock !== undefined && (
              <p className="text-xs text-muted-foreground">
                Estoque Mínimo: {minimumStock}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  const summary = variants.reduce(
    (acc, variant) => {
      const status = getProductStockStatus(
        variant.stock || 0,
        variant.minimumStock
      );
      acc[status] += 1;
      return acc;
    },
    { critical: 0, warning: 0, healthy: 0 }
  );

  let mainStatus: 'critical' | 'warning' | 'healthy' = 'healthy';
  if (summary.critical > 0) mainStatus = 'critical';
  else if (summary.warning > 0) mainStatus = 'warning';

  const mainConfig = getStatusConfig(mainStatus);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-transparent">
          {mainConfig.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="min-w-[200px]">
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center gap-2 border-b pb-2">
            {mainConfig.iconSmall}
            <span className="font-semibold">Resumo da Grade</span>
          </div>

          <div className="space-y-1.5">
            {summary.critical > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-600 font-medium">Crítico</span>
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-bold">
                  {summary.critical} variações
                </span>
              </div>
            )}

            {summary.warning > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-orange-600 font-medium">Atenção</span>
                <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md font-bold">
                  {summary.warning} variações
                </span>
              </div>
            )}

            {summary.healthy > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-green-600 font-medium">Saudável</span>
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md font-bold">
                  {summary.healthy} variações
                </span>
              </div>
            )}
          </div>

          <div className="border-t pt-2 mt-1">
            <p className="text-[10px] text-muted-foreground text-center">
              Total Físico: {totalStock} un.
            </p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function getStatusConfig(status: 'critical' | 'warning' | 'healthy') {
  switch (status) {
    case 'critical':
      return {
        icon: <CircleX className="text-red-600 h-6 w-6" />,
        iconSmall: <CircleX className="text-red-600 h-4 w-4" />,
        label: 'Crítico'
      };
    case 'warning':
      return {
        icon: <TriangleAlert className="text-orange-500 h-6 w-6" />,
        iconSmall: <TriangleAlert className="text-orange-500 h-4 w-4" />,
        label: 'Atenção'
      };
    default:
      return {
        icon: <SquareCheck className="text-green-600 h-6 w-6" />,
        iconSmall: <SquareCheck className="text-green-600 h-4 w-4" />,
        label: 'Saudável'
      };
  }
}
