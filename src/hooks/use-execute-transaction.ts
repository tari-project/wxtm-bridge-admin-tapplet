import { useState } from 'react';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useNotification } from '@refinedev/core';

import { wagmiConfig } from '../config/wagmi-config';
import { SafeTransaction } from '../providers/safe-transactions-data-provider';
import { useSafe } from './use-safe';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useExecuteTransaction = (safeAddress?: string) => {
  const [loading, setLoading] = useState(false);
  const { initSafe } = useSafe(safeAddress);
  const { open } = useNotification();

  const executeTransaction = async (transaction: SafeTransaction) => {
    setLoading(true);

    try {
      const safe = await initSafe();

      const tx = await safe.executeTransaction(transaction);

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx.hash as `0x${string}`,
      });

      if (receipt.status === 'reverted') {
        throw new Error('Transaction failed');
      }

      await delay(5000);
      setLoading(false);

      open?.({
        type: 'success',
        description: 'Success',
        message: 'Transaction executed successfully',
      });
    } catch (e) {
      setLoading(false);
      open?.({
        type: 'error',
        description: 'Error',
        message: 'Failed to execute transaction',
      });

      console.log('Error in useExecuteTransaction', e);
    }
  };

  return { executeTransaction, loading };
};
