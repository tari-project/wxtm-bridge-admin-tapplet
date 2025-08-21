import { Box, Stack, TextField, Typography } from '@mui/material';
import { utils } from 'ethers';

import { TokensUnwrappedStatus } from '../tokens-unwrapped-status';
import { TokensUnwrappedTransactionDataTabProps } from './types';
import { BlockchainExplorerLink } from '../blockchain-explorer-link';

export const TokensUnwrappedTransactionDataTab = ({
  transaction,
}: TokensUnwrappedTransactionDataTabProps) => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <TokensUnwrappedStatus
          status={transaction.status}
          size="medium"
          sx={{ width: 'auto', minWidth: 150 }}
        />
      </Stack>

      <Stack gap={6} component="form" autoComplete="off">
        <TextField
          label="Nonce"
          value={transaction.nonce}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Subgraph ID"
          value={transaction.subgraphId || '-'}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="From Address"
          value={transaction.from}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="To Address"
          value={transaction.targetTariAddress}
          slotProps={{ input: { readOnly: true } }}
        />

        {transaction.transactionHash && (
          <Box pl={1}>
            <Typography variant="body1" fontWeight="medium" mb={1}>
              Etherscan Transaction Hash:
            </Typography>
            <BlockchainExplorerLink txHash={transaction.transactionHash}>
              {transaction.transactionHash}
            </BlockchainExplorerLink>
          </Box>
        )}

        <TextField
          label="Tokens Burned"
          value={`${utils.formatUnits(transaction.amount, 18).toString()} wXTM`}
          slotProps={{ input: { readOnly: true } }}
        />
      </Stack>
    </>
  );
};
