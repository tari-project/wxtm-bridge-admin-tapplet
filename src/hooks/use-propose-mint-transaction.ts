import { useState } from 'react';
import { useNavigation, useNotification } from '@refinedev/core';
import { useAccount } from 'wagmi';

import { WXTM__factory } from '@tari-project/wxtm-bridge-contracts';

import { useSafe } from './use-safe';
import { SAFE_ADDRESS, WXTM_TOKEN_ADDRESS } from '../config';

export const useProposeMintTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { initApi, initSafe } = useSafe();
  const { push } = useNavigation();
  const { open } = useNotification();
  const { address } = useAccount();

  const proposeMintTransaction = async ({
    toAddress,
    tokenAmount,
  }: {
    toAddress: string;
    tokenAmount: string;
  }) => {
    setLoading(true);

    try {
      const safe = await initSafe();
      const api = initApi();
      const nextNonce = await api.getNextNonce(SAFE_ADDRESS);

      const data = WXTM__factory.createInterface().encodeFunctionData('mint', [
        toAddress,
        tokenAmount,
      ]);

      const safeTransaction = await safe.createTransaction({
        transactions: [
          {
            to: WXTM_TOKEN_ADDRESS,
            data,
            value: '0',
          },
        ],
        options: {
          nonce: Number(nextNonce),
        },
      });

      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      const senderSignature = await safe.signHash(safeTxHash);

      await api.proposeTransaction({
        safeAddress: SAFE_ADDRESS,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: address || '',
        senderSignature: senderSignature.data,
      });

      setLoading(false);

      open?.({
        type: 'success',
        description: 'Success',
        message: 'Transaction proposed',
      });

      push('/safe-transactions');
    } catch (e) {
      console.log(e);
      setLoading(false);

      open?.({
        type: 'error',
        description: 'Error',
        message: 'Failed to propose transaction',
      });
    }
  };

  return { proposeMintTransaction, loading };
};
