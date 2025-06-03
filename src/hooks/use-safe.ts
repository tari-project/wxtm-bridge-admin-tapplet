import SafeApiKit from '@safe-global/api-kit';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import { useAccount } from 'wagmi';

import { MINT_LOW_SAFE_ADDRESS } from '../config';

export const useSafe = () => {
  const { chainId, address, connector } = useAccount();

  const initSafe = async () => {
    if (!connector || !chainId) {
      throw new Error('No connector or chainID were found');
    }

    const provider = (await connector.getProvider()) as Eip1193Provider;

    const safe = await Safe.init({
      provider,
      signer: address,
      safeAddress: MINT_LOW_SAFE_ADDRESS,
    });

    return safe;
  };

  const initApi = () => {
    if (!chainId) {
      throw new Error('No chainID found');
    }

    return new SafeApiKit({
      chainId: BigInt(chainId),
    });
  };

  return { initSafe, initApi };
};
