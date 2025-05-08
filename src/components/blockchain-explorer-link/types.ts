import { ReactNode } from 'react';

export interface BlockchainExplorerUrlParams {
  chainId?: number;
  address?: string;
  txHash?: string | null;
  blockNumber?: number | string;
}

export interface BlockchainExplorerLinkProps {
  address?: string;
  txHash?: string | null;
  blockNumber?: number | string;
  children: ReactNode;
}
