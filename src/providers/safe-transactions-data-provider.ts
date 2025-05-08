import {
  BaseKey,
  DataProvider,
  GetListParams,
  GetListResponse,
  GetOneResponse,
} from '@refinedev/core';
import SafeApiKit, { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';

import { SAFE_ADDRESS, NETWORK_ID } from '../config';

export type SafeTransaction = SafeMultisigTransactionListResponse['results'][0];

const apiKit = new SafeApiKit({ chainId: BigInt(NETWORK_ID) });

export const safeTransactionsDataProvider: DataProvider = {
  getList: async <TData = SafeTransaction>({
    pagination,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    const { current = 1, pageSize = 10 } = pagination || {};
    const offset = (current - 1) * pageSize;

    const { results, count } = await apiKit.getMultisigTransactions(SAFE_ADDRESS, {
      limit: pageSize,
      offset,
    });

    return {
      data: results as unknown as TData[],
      total: count,
    };
  },

  getOne: async <TData = SafeTransaction>({
    id,
  }: {
    id: BaseKey;
  }): Promise<GetOneResponse<TData>> => {
    const tx = await apiKit.getTransaction(id.toString());

    return { data: tx as unknown as TData };
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
