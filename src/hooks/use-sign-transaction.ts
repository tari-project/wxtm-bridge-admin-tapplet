import { useState } from 'react';
import { useNotification } from '@refinedev/core';

import { SafeTransaction } from '../providers/safe-transactions-data-provider';
import { useSafe } from './use-safe';

export const useSignTransaction = (safeAddress?: string) => {
  const [loading, setLoading] = useState(false);
  const { initApi, initSafe } = useSafe(safeAddress);
  const { open } = useNotification();

  const signTransaction = async ({ safeTxHash }: SafeTransaction) => {
    setLoading(true);

    try {
      const safe = await initSafe();
      const api = initApi();

      const signatureOwner = await safe.signHash(safeTxHash);
      await api.confirmTransaction(safeTxHash, signatureOwner.data);

      setLoading(false);

      open?.({
        type: 'success',
        description: 'Success',
        message: 'Transaction signed successfully',
      });
    } catch (e) {
      setLoading(false);

      open?.({
        type: 'error',
        description: 'Error',
        message: 'Failed to sign transaction',
      });
    }
  };

  return { signTransaction, loading };
};
