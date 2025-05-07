import { useState } from 'react';
import { useNavigation, useNotification, useUpdate } from '@refinedev/core';
import { useAccount } from 'wagmi';

import { WXTM__factory } from '@tari-project/wxtm-bridge-contracts';

import { useSafe } from './use-safe';
import { SAFE_ADDRESS, WXTM_TOKEN_ADDRESS } from '../config';
import { convertWxtmTokenTo18Decimals } from '../helpers/convert-wxtm-token-to-18-decimals';

export const useProposeMintTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { initApi, initSafe } = useSafe();
  const { push } = useNavigation();
  const { open } = useNotification();
  const { address } = useAccount();
  const { mutate } = useUpdate();

  const proposeMintTransaction = async ({
    toAddress,
    wxtmTokenAmountAfterFee,
    wrapTokenTransactionId,
  }: {
    toAddress: string;
    wxtmTokenAmountAfterFee: string;
    wrapTokenTransactionId: number;
  }) => {
    setLoading(true);
    try {
      const safe = await initSafe();
      const api = initApi();
      const nextNonce = await api.getNextNonce(SAFE_ADDRESS);

      const wxtmTokenAmount18Decimals = convertWxtmTokenTo18Decimals({
        wxtmTokenAmount: wxtmTokenAmountAfterFee,
      });

      const data = WXTM__factory.createInterface().encodeFunctionData('mint', [
        toAddress,
        wxtmTokenAmount18Decimals,
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

      mutate({
        resource: 'wrap-token-transactions',
        id: wrapTokenTransactionId,
        values: {
          safeTxHash,
          safeNonce: safeTransaction.data.nonce,
        },
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
