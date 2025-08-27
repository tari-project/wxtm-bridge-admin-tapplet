import { useMemo } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { utils } from 'ethers';
import ReactJsonView from '@microlink/react-json-view';

import { TokensUnwrappedStatus } from '../tokens-unwrapped-status';
import { TokensUnwrappedTransactionDataTabProps } from './types';
import { BlockchainExplorerLink } from '../blockchain-explorer-link';

export const TokensUnwrappedTransactionDataTab = ({
  transaction,
  saveButtonProps,
}: TokensUnwrappedTransactionDataTabProps) => {
  const hasError = useMemo(() => {
    return !!transaction?.error?.length;
  }, [transaction]);

  const overidedSaveButtonProps = useMemo(
    () => ({
      ...saveButtonProps,
      children: 'Reset Processor to the last working state',
    }),
    [saveButtonProps]
  );

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
          label="Signature"
          value={transaction.signature}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Contract Address"
          value={transaction.contractAddress}
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
          label="Block Hash"
          value={transaction.blockHash}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Block Number"
          value={transaction.blockNumber}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Tokens Burned"
          value={`${utils.formatUnits(transaction.amount, 18).toString()} wXTM`}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Fee %"
          value={transaction.feePercentageBps / 100}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Fee Amount"
          value={`${utils.formatUnits(transaction.feeAmount, 18).toString()} XTM`}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Tokens To Send"
          value={`${utils.formatUnits(transaction.amountAfterFee, 18).toString()} XTM`}
          slotProps={{ input: { readOnly: true } }}
        />

        {hasError && (
          <>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                padding: 3,
              }}
            >
              <ReactJsonView
                src={transaction.error}
                enableClipboard={false}
                displayObjectSize={false}
                name={'errors_received'}
              />
            </Paper>
            <Stack>
              <Typography variant="h6" mb={1}>
                This will clear all existing errors and reset the processor to the previous working
                state, allowing it to retry transaction processing.
              </Typography>
              <Button variant="contained" {...overidedSaveButtonProps} />
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
};
