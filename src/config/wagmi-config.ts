import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected({
      target: 'metaMask',
      shimDisconnect: false,
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
