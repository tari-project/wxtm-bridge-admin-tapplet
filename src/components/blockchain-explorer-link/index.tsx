import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

import { BlockchainExplorerLinkProps } from './types';
import { BLOCKCHAIN_EXPLORERS } from './const';
import { NETWORK_ID } from '../../config';

export const BlockchainExplorerLink = ({
  address,
  txHash,
  blockNumber,
  children,
}: BlockchainExplorerLinkProps) => {
  const theme = useTheme();

  const generateUrl = useMemo(() => {
    const baseUrl = BLOCKCHAIN_EXPLORERS[NETWORK_ID]?.replace(/\/?$/, '/');
    if (!baseUrl) return '';

    if (txHash) return `${baseUrl}tx/${txHash}/`;
    if (address) return `${baseUrl}address/${address}/`;
    if (blockNumber) return `${baseUrl}block/${blockNumber}/`;
  }, [address, blockNumber, txHash]);

  return (
    <Link
      target="_blank"
      rel="noopener"
      href={generateUrl}
      sx={{ color: theme.palette.text.primary }}
    >
      {children}
    </Link>
  );
};
