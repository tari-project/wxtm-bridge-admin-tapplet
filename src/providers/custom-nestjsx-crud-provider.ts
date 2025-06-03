import nestjsxCrudDataProvider from '@refinedev/nestjsx-crud';
import { AxiosInstance } from 'axios';
import { DataProvider, CrudFilter, LogicalFilter, CrudOperators } from '@refinedev/core';

// Define the operator type that includes both Refine and nestjsx-crud operators
type ExtendedCrudOperators = CrudOperators | 'cont';

interface ExtendedLogicalFilter extends Omit<LogicalFilter, 'operator'> {
  operator: ExtendedCrudOperators;
}

export const customNestjsxCrudDataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance
): DataProvider => {
  const originalProvider = nestjsxCrudDataProvider(apiUrl, httpClient);

  const fieldScaleMap: Record<string, number> = {
    tokenAmount: 1_000_000,
    amountAfterFee: 1_000_000,
    feeAmount: 1_000_000,
  };

  const isScaledField = (field: string) => Object.keys(fieldScaleMap).includes(field);

  return {
    ...originalProvider,
    getList: async (params) => {
      if (params.filters && params.filters.length > 0) {
        const modifiedFilters: (CrudFilter | ExtendedLogicalFilter)[] = [];

        params.filters.forEach((filter: CrudFilter) => {
          // Type guard to check if it's a LogicalFilter
          if ('field' in filter) {
            const { field, value, operator } = filter;

            if (isScaledField(field)) {
              const multiplier = fieldScaleMap[field];

              if (operator === 'contains') {
                const parsed = parseFloat(value.toString());
                if (!isNaN(parsed)) {
                  const baseValue = parsed;
                  const valueStr = value.toString();
                  const precision = valueStr.includes('.') ? valueStr.split('.')[1].length : 0;

                  const increment = Math.pow(10, -precision);
                  const lowerBound = Math.floor(baseValue * multiplier);
                  const upperBound = Math.floor((baseValue + increment) * multiplier) - 1;

                  modifiedFilters.push(
                    { field, operator: 'gte', value: lowerBound },
                    { field, operator: 'lte', value: upperBound }
                  );
                  return;
                }
              } else {
                const parsed = parseFloat(value.toString());
                if (!isNaN(parsed)) {
                  const scaledValue = Math.round(parsed * multiplier);
                  modifiedFilters.push({
                    field,
                    operator,
                    value: scaledValue,
                  });
                  return;
                }
              }
            }

            // Convert 'contains' to 'cont' for nestjsx-crud after processing scaled fields
            const finalOperator: ExtendedCrudOperators =
              operator === 'contains' ? 'cont' : operator;
            modifiedFilters.push({
              field,
              operator: finalOperator,
              value,
            } as ExtendedLogicalFilter);
          } else {
            // If it's not a LogicalFilter (could be ConditionalFilter), just pass it through
            modifiedFilters.push(filter);
          }
        });

        const modifiedParams = {
          ...params,
          filters: modifiedFilters as CrudFilter[],
        };

        return originalProvider.getList(modifiedParams);
      }

      return originalProvider.getList(params);
    },
  };
};
