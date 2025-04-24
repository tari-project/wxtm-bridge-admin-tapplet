import { useMemo } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import { utils } from 'ethers';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';

export const WrapTokenTransactionsShow = () => {
  const { query } = useShow<WrapTokenTransactionEntity>({});

  const { data, isLoading } = query;
  const transaction = data?.data;

  const canConfirmTokensReceived = useMemo(() => {
    return transaction?.status === WrapTokenTransactionEntity.status.TOKENS_SENT;
  }, [transaction]);

  return (
    <Show
      isLoading={isLoading}
      title="Wrap Token Transaction"
      headerButtons={() => (
        <Button variant="contained" color="error" disabled={!canConfirmTokensReceived}>
          Confirm Tokens Received
        </Button>
      )}
    >
      {transaction && (
        <Stack gap={6} mt={2}>
          <WrapTokenTransactionStatus status={transaction.status} size="medium" />
          <TextField
            label="Payment ID"
            value={transaction.paymentId}
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="From Address"
            value={transaction.from}
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="To Address"
            value={transaction.to}
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Amount"
            value={utils.formatUnits(transaction.tokenAmount, 6)}
            slotProps={{ input: { readOnly: true } }}
          />
        </Stack>
      )}
    </Show>
  );
};
