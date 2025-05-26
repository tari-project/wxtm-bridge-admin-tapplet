import { useCallback, useMemo } from 'react';
import { Button, Paper, Stack, TextField } from '@mui/material';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { useNavigation } from '@refinedev/core';
import { utils } from 'ethers';
import ReactJsonView from '@microlink/react-json-view';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';

export const WrapTokenTransactionsEdit = () => {
  const { push } = useNavigation();

  const {
    saveButtonProps,
    refineCore: { formLoading, query },
  } = useForm<WrapTokenTransactionEntity>({
    refineCoreProps: { redirect: false },
  });

  const transaction = query?.data?.data;

  const hasError = useMemo(() => {
    return !!transaction?.error;
  }, [transaction]);

  const disabledSaveButtonProps = useMemo(
    () => ({
      ...saveButtonProps,
      disabled: !hasError,
      children: 'Reset Error Message',
    }),
    [saveButtonProps, hasError]
  );

  const canNavigateToSafeTransaction = useMemo(() => {
    return !!transaction?.safeTxHash;
  }, [transaction]);

  const navigateToSafeTransaction = useCallback(() => {
    if (transaction) {
      push(`/safe-transactions/show/${transaction.safeTxHash}`);
    }
  }, [transaction, push]);

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={disabledSaveButtonProps}
      title="Back"
      headerButtons={
        <Button
          variant="contained"
          color="success"
          onClick={navigateToSafeTransaction}
          disabled={!canNavigateToSafeTransaction}
        >
          Show Safe Transaction
        </Button>
      }
    >
      {transaction && (
        <Stack gap={6} component="form" autoComplete="off">
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
            label="Safe Nonce"
            value={transaction.safeNonce || '-'}
            slotProps={{ input: { readOnly: true } }}
          />

          <TextField
            label="Safe Transaction Hash"
            value={transaction.safeTxHash || '-'}
            slotProps={{ input: { readOnly: true } }}
          />

          <TextField
            label="Tokens Received"
            value={`${utils.formatUnits(transaction.tokenAmount, 6).toString()} wXTM`}
            slotProps={{ input: { readOnly: true } }}
          />

          <TextField
            label="Fee %"
            value={transaction.feePercentageBps / 100}
            slotProps={{ input: { readOnly: true } }}
          />

          <TextField
            label="Fee Amount"
            value={`${utils.formatUnits(transaction.feeAmount, 6).toString()} wXTM`}
            slotProps={{ input: { readOnly: true } }}
          />

          <TextField
            label="Amount To Send"
            value={`${utils.formatUnits(transaction.amountAfterFee, 6).toString()} wXTM`}
            slotProps={{ input: { readOnly: true } }}
          />

          {hasError && (
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                padding: 3,
              }}
            >
              <ReactJsonView
                src={{ message: transaction.error }}
                enableClipboard={false}
                displayObjectSize={false}
                name={'error'}
              />
            </Paper>
          )}
        </Stack>
      )}
    </Edit>
  );
};
