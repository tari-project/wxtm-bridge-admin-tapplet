import { ReactNode } from 'react';

export interface BlockchainExplorerLinkProps {
  address?: string;
  txHash?: string | null;
  blockNumber?: number | string;
  children: ReactNode;
}
