import nestjsxCrudDataProvider from '@refinedev/nestjsx-crud';
import { AxiosInstance } from 'axios';
import { DataProvider } from '@refinedev/core';

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
        const modifiedFilters: any[] = [];

        params.filters.forEach((filter: any) => {
          let { field, operator, value } = filter;

          // Convert 'contains' to 'cont' for nestjsx-crud
          if (operator === 'contains') {
            operator = 'cont';
          }

          if (isScaledField(field)) {
            const multiplier = fieldScaleMap[field];

            if (operator === 'cont') {
              const parsed = parseFloat(value);
              if (!isNaN(parsed)) {
                const baseValue = parsed;
                const precision = value.includes('.') ? value.split('.')[1].length : 0;

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
              const parsed = parseFloat(value);
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

          modifiedFilters.push({
            field,
            operator,
            value,
          });
        });

        const modifiedParams = {
          ...params,
          filters: modifiedFilters,
        };

        return originalProvider.getList(modifiedParams);
      }

      return originalProvider.getList(params);
    },
  };
};
