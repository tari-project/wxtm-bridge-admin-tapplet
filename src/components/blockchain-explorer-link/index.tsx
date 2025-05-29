import Link from '@mui/material/Link';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useTheme } from '@mui/material/styles';

import { BlockchainExplorerLinkProps, BlockchainExplorerUrlParams } from './types';
import { BLOCKCHAIN_EXPLORERS } from './const';

export const BlockchainExplorerLink = ({
  address,
  txHash,
  blockNumber,
  children,
}: BlockchainExplorerLinkProps) => {
  const { chainId } = useAccount();
  const theme = useTheme();

  const generateUrl = useCallback(
    ({ chainId, address, txHash, blockNumber }: BlockchainExplorerUrlParams) => {
      const baseUrl = BLOCKCHAIN_EXPLORERS[chainId as number]?.replace(/\/?$/, '/');
      if (!baseUrl) return '';

      if (txHash) return `${baseUrl}tx/${txHash}/`;
      if (address) return `${baseUrl}address/${address}/`;
      if (blockNumber) return `${baseUrl}block/${blockNumber}/`;
    },
    []
  );

  return (
    <Link
      target="_blank"
      rel="noopener"
      href={generateUrl({ chainId, address, txHash, blockNumber })}
      sx={{ color: theme.palette.text.primary }}
    >
      {children}
    </Link>
  );
};
