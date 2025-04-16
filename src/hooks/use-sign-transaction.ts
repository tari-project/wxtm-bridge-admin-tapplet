import { useState } from 'react';
import { useAccount } from 'wagmi';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';

import { SafeTransaction } from '../providers/safe-transactions-data-provider';
import { SAFE_ADDRESS } from '../config';

export const useSignTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { chainId, address, connector } = useAccount();

  const signTransaction = async ({ safeTxHash }: SafeTransaction) => {
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

      const signatureOwner = await protocolKit.signHash(safeTxHash);

      const apiKit = new SafeApiKit({
        chainId: BigInt(chainId),
      });

      await apiKit.confirmTransaction(safeTxHash, signatureOwner.data);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return { signTransaction, loading };
};
