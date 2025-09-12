import { useMemo } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { utils } from 'ethers';
import ReactJsonView from '@microlink/react-json-view';
import { useApiUrl, useCustomMutation, useInvalidate } from '@refinedev/core';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

import { TokensUnwrappedStatus } from '../tokens-unwrapped-status';
import { TokensUnwrappedTransactionDataTabProps } from './types';
import { BlockchainExplorerLink } from '../blockchain-explorer-link';

export const TokensUnwrappedTransactionDataTab = ({
  transaction,
  saveButtonProps,
}: TokensUnwrappedTransactionDataTabProps) => {
  const apiUrl = useApiUrl();
  const invalidate = useInvalidate();
  const { mutate, isLoading } = useCustomMutation();

  const isAwaitingApproval = useMemo(() => {
    return transaction.status === TokensUnwrappedEntity.status.CONFIRMED_AWAITING_APPROVAL;
  }, [transaction.status]);

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

  const handleSubmit = () => {
    mutate(
      {
        url: `${apiUrl}/tokens-unwrapped/approve/${transaction.id}`,
        method: 'patch',
        values: {},
      },
      {
        onSuccess: () => {
          invalidate({
            resource: 'tokens-unwrapped',
            invalidates: ['all'],
          });
        },
      }
    );
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <TokensUnwrappedStatus
          status={transaction.status}
          size="medium"
          sx={{ width: 'auto', minWidth: 150 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          loading={isLoading}
          sx={{ minWidth: 250 }}
          disabled={!isAwaitingApproval}
        >
          Approve Transaction
        </Button>
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
          label=" Ethereum  Block Hash"
          value={transaction.blockHash}
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Ethereum Block Number"
          value={transaction.blockNumber}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Tari Payment Reference"
          value={transaction?.tariPaymentReference || ''}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Tari Block Height"
          value={transaction?.tariBlockHeight || ''}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Tari Timestamp"
          value={transaction?.tariTxTimestamp || ''}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Tari Temporary Transaction ID"
          value={transaction?.temporaryTransactionId || ''}
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
