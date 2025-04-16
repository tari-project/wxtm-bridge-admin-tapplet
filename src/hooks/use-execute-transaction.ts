import { useState } from 'react';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useAccount } from 'wagmi';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';

import { SAFE_ADDRESS } from '../config';
import { wagmiConfig } from '../config/wagmi-config';
import { SafeTransaction } from '../providers/safe-transactions-data-provider';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useExecuteTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { chainId, address, connector } = useAccount();

  const executeTransaction = async (transaction: SafeTransaction) => {
    setLoading(true);

    try {
      if (!connector || !chainId) {
        throw new Error('No connector or chainID were found');
      }

      const provider = (await connector.getProvider()) as Eip1193Provider;

      const protocolKit = await Safe.init({
        provider,
        signer: address,
        safeAddress: SAFE_ADDRESS,
      });

      const tx = await protocolKit.executeTransaction(transaction);

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx.hash as `0x${string}`,
      });

      if (receipt.status === 'reverted') {
        throw new Error('Transaction failed');
      }

      await delay(5000);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('Error in useExecuteTransaction', e);
    }
  };

  return { executeTransaction, loading };
};
