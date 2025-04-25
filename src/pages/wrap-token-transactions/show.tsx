import { useCallback, useMemo } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import { utils } from 'ethers';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';
import { useProposeMintTransaction } from '../../hooks/use-propose-mint-transaction';

export const WrapTokenTransactionsShow = () => {
  const { query } = useShow<WrapTokenTransactionEntity>({});
  const { proposeMintTransaction, loading } = useProposeMintTransaction();

  const { data, isLoading, refetch } = query;
  const transaction = data?.data;

  const canConfirmTokensReceived = useMemo(() => {
    return transaction?.status === WrapTokenTransactionEntity.status.TOKENS_SENT;
  }, [transaction]);

  const handleProposeMintTransaction = useCallback(() => {
    if (transaction) {
      proposeMintTransaction({ toAddress: transaction.to, tokenAmount: transaction.tokenAmount });
    }
  }, [transaction, proposeMintTransaction]);

  return (
    <Show
      isLoading={isLoading}
      title="Wrap Token Transaction"
      headerButtons={() => (
        <>
          <Button
            variant="contained"
            color="error"
            disabled={!canConfirmTokensReceived || true}
            onClick={() => refetch()}
          >
            Confirm Tokens Received
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleProposeMintTransaction}
            loading={loading}
            disabled={true}
          >
            Propose Transaction
          </Button>
        </>
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
