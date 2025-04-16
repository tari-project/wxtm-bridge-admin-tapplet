import axios from 'axios';
import {
  BaseKey,
  DataProvider,
  GetListParams,
  GetListResponse,
  GetOneResponse,
} from '@refinedev/core';
import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';
import { SAFE_API_BASE_URL, SAFE_ADDRESS } from '../config';

export type SafeTransaction = SafeMultisigTransactionListResponse['results'][0];

const transactionCache: Record<string, SafeTransaction> = {};

export const safeTransactionsDataProvider: DataProvider = {
  getList: async <TData = SafeTransaction>({
    pagination,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    const { current = 1, pageSize = 10 } = pagination || {};
    const offset = (current - 1) * pageSize;

    try {
      const response = await axios.get<SafeMultisigTransactionListResponse>(
        `${SAFE_API_BASE_URL}/safes/${SAFE_ADDRESS}/multisig-transactions/`,
        {
          params: {
            limit: pageSize,
            offset: offset,
          },
        }
      );

      const { results, count } = response.data;

      results.forEach((transaction) => {
        transactionCache[transaction.safeTxHash] = transaction;
      });

      return {
        data: results as unknown as TData[],
        total: count,
      };
    } catch (error) {
      console.error('Error fetching Safe transactions:', error);
      return {
        data: [],
        total: 0,
      };
    }
  },

  getOne: async <TData = SafeTransaction>({
    id,
  }: {
    id: BaseKey;
  }): Promise<GetOneResponse<TData>> => {
    const transaction = transactionCache[id];

    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found in cache`);
    }

    return {
      data: transaction as unknown as TData,
    };
  },

  create: async () => {
    throw new Error('create method is not implemented in safeTransactionsDataProvider');
  },
  update: async () => {
    throw new Error('update method is not implemented in safeTransactionsDataProvider');
  },
  deleteOne: async () => {
    throw new Error('deleteOne method is not implemented in safeTransactionsDataProvider');
  },
  getApiUrl: () => {
    throw new Error('getApiUrl method is not implemented in safeTransactionsDataProvider');
  },
};
