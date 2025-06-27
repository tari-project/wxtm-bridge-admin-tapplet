import { useState } from 'react';
import { useAccount } from 'wagmi';

import { WXTMController__factory } from '@tari-project/wxtm-bridge-contracts';

import { useSafe } from './use-safe';

export const useProposeMintTransaction = (safeAddress: string) => {
  const [loading, setLoading] = useState(false);
  const { initApi, initSafe } = useSafe(safeAddress);
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
      const nextNonce = await api.getNextNonce(safeAddress);

      const data = WXTMController__factory.createInterface().encodeFunctionData('mintLowAmount', [
        toAddress,
        tokenAmount,
      ]);

      const safeTransaction = await safe.createTransaction({
        transactions: [
          {
            to: '0x31999d652476b9e2ef4DEbA560CD39b9Af1AccA5',
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
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: address || '',
        senderSignature: senderSignature.data,
      });

      console.log('RRRRRRRRRRRRRRR');

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { proposeMintTransaction, loading };
};
