import nestjsxCrudDataProvider from '@refinedev/nestjsx-crud';
import { utils } from 'ethers';
import { AxiosInstance } from 'axios';
import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';
import { DataProvider, CrudFilter, LogicalFilter, CrudOperators } from '@refinedev/core';

type ExtendedCrudOperators = CrudOperators | 'cont';

interface ExtendedLogicalFilter extends Omit<LogicalFilter, 'operator'> {
  operator: ExtendedCrudOperators;
}

enum ExtendedStatus {
  TOKENS_BURNED = 'tokens_burned',
  TOKENS_MINTED = 'tokens_minted',
}

const statusLabelToValue: Record<string, string> = {
  created: WrapTokenTransactionEntity.status.CREATED,
  'Tokens sent': WrapTokenTransactionEntity.status.TOKENS_SENT,
  'Tokens Sent': WrapTokenTransactionEntity.status.TOKENS_SENT,
  'Tokens received': WrapTokenTransactionEntity.status.TOKENS_RECEIVED,
  'Tokens Received': WrapTokenTransactionEntity.status.TOKENS_RECEIVED,
  'Amount Mismatch': WrapTokenTransactionEntity.status.TOKENS_RECEIVED_WITH_MISMATCH,
  'Tokens received with mismatch': WrapTokenTransactionEntity.status.TOKENS_RECEIVED_WITH_MISMATCH,
  'Creating Safe Tx': WrapTokenTransactionEntity.status.CREATING_SAFE_TRANSACTION,
  'Creating safe transaction': WrapTokenTransactionEntity.status.CREATING_SAFE_TRANSACTION,
  'Safe Tx Created': WrapTokenTransactionEntity.status.SAFE_TRANSACTION_CREATED,
  'Safe transaction created': WrapTokenTransactionEntity.status.SAFE_TRANSACTION_CREATED,
  'Executing Safe Tx': WrapTokenTransactionEntity.status.EXECUTING_SAFE_TRANSACTION,
  'Executing safe transaction': WrapTokenTransactionEntity.status.EXECUTING_SAFE_TRANSACTION,
  'Safe Tx Executed': WrapTokenTransactionEntity.status.SAFE_TRANSACTION_EXECUTED,
  'Safe transaction executed': WrapTokenTransactionEntity.status.SAFE_TRANSACTION_EXECUTED,
  timeout: WrapTokenTransactionEntity.status.TIMEOUT,

  'Tokens Burned': ExtendedStatus.TOKENS_BURNED,
  'Tokens Minted': ExtendedStatus.TOKENS_MINTED,
};

const DECIMALS = 6;
const BIG_INT_FIELDS = ['tokenAmount', 'amountAfterFee', 'feeAmount'];

export const customNestjsxCrudDataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance
): DataProvider => {
  const originalProvider = nestjsxCrudDataProvider(apiUrl, httpClient);

  return {
    ...originalProvider,
    getList: async (params) => {
      if (params.filters && params.filters.length > 0) {
        const modifiedFilters: (CrudFilter | ExtendedLogicalFilter)[] = [];

        params.filters.forEach((filter: CrudFilter) => {
          if ('field' in filter) {
            const { field, value, operator } = filter;

            if (field === 'status' || field.toLowerCase().includes('status')) {
              const valueStr = value?.toString() || '';
              const mappedStatus =
                statusLabelToValue[valueStr] ||
                statusLabelToValue[valueStr.toLowerCase()] ||
                Object.keys(statusLabelToValue).find((key) =>
                  key.toLowerCase().includes(valueStr.toLowerCase())
                );

              if (mappedStatus) {
                const finalOperator: ExtendedCrudOperators =
                  operator === 'contains' ? 'cont' : operator;
                modifiedFilters.push({
                  field,
                  operator: finalOperator,
                  value: mappedStatus,
                } as ExtendedLogicalFilter);
                return;
              }
            }

            if (BIG_INT_FIELDS.includes(field)) {
              if (operator === 'contains') {
                const range = createBigIntRange(value.toString());
                if (range) {
                  modifiedFilters.push(
                    { field, operator: 'gte', value: range.lower },
                    { field, operator: 'lte', value: range.upper }
                  );
                  return;
                }
              } else {
                const bigIntValue = parseValueToBigInt(value.toString());
                if (bigIntValue) {
                  modifiedFilters.push({
                    field,
                    operator,
                    value: bigIntValue,
                  });
                  return;
                }
              }
            }

            const finalOperator: ExtendedCrudOperators =
              operator === 'contains' ? 'cont' : operator;
            modifiedFilters.push({
              field,
              operator: finalOperator,
              value,
            } as ExtendedLogicalFilter);
          } else {
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

const parseValueToBigInt = (value: string | number): string | null => {
  try {
    const valueStr = value.toString().trim();
    if (!valueStr || valueStr === '') return null;

    const bigIntValue = utils.parseUnits(valueStr, DECIMALS);
    return bigIntValue.toString();
  } catch (error) {
    console.warn(`Failed to parse value to BigInt: ${value}`, error);
    return null;
  }
};

const createBigIntRange = (value: string | number): { lower: string; upper: string } | null => {
  try {
    const valueStr = value.toString().trim();
    if (!valueStr || valueStr === '') return null;

    const parts = valueStr.split('.');
    const inputPrecision = parts.length > 1 ? Math.min(parts[1].length, DECIMALS) : 0;

    let upperValueStr: string;
    if (inputPrecision === 0) {
      const nextInt = parseInt(valueStr) + 1;
      upperValueStr = nextInt.toString();
    } else {
      const increment = Math.pow(10, -inputPrecision);
      const upperValue = parseFloat(valueStr) + increment;
      upperValueStr = upperValue.toFixed(inputPrecision);
    }

    const lowerBound = utils.parseUnits(valueStr, DECIMALS);
    const upperBound = utils.parseUnits(upperValueStr, DECIMALS).sub(1);

    return {
      lower: lowerBound.toString(),
      upper: upperBound.toString(),
    };
  } catch (error) {
    console.warn(`Failed to create BigInt range for value: ${value}`, error);
    return null;
  }
};
