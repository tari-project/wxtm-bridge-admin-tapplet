import { ReactNode } from 'react';

export interface BlockchainExplorerUrlParams {
  chainId?: number;
  address?: string;
  txHash?: string;
  blockNumber?: number | string;
}

export interface BlockchainExplorerLinkProps {
  address?: string;
  txHash?: string;
  blockNumber?: number | string;
  children: ReactNode;
}
