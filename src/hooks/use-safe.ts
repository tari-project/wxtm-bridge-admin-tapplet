import SafeApiKit from '@safe-global/api-kit';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import { useAccount } from 'wagmi';

export const useSafe = (safeAddress?: string) => {
  const { chainId, address, connector } = useAccount();

  const initSafe = async () => {
    if (!connector || !chainId || !safeAddress) {
      throw new Error('No connector or chainID were found');
    }

    if (!safeAddress) {
      throw new Error('No safe address provided');
    }

    const provider = (await connector.getProvider()) as Eip1193Provider;

    const safe = await Safe.init({
      provider,
      signer: address,
      safeAddress,
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
