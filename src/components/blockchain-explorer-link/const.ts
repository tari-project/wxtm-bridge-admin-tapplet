import { mainnet, sepolia } from 'viem/chains';

export const BLOCKCHAIN_EXPLORERS: Record<number, string> = {
  [mainnet.id]: mainnet.blockExplorers.default.url,
  [sepolia.id]: sepolia.blockExplorers.default.url,
};
