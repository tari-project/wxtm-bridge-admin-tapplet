import { useCallback, useMemo } from 'react';
import { Button, Paper, Stack, TextField } from '@mui/material';
import { useNavigation } from '@refinedev/core';
import { utils } from 'ethers';
import ReactJsonView from '@microlink/react-json-view';

import { WrapTokenTransactionStatus } from '../wrap-token-transaction-status';
import { WrapTokenTransactionDataTabProps } from './types';

export const WrapTokenTransactionDataTab = ({
  transaction,
  saveButtonProps,
}: WrapTokenTransactionDataTabProps) => {
  const { push } = useNavigation();

  const hasError = useMemo(() => {
    return !!transaction?.error;
  }, [transaction]);

  const overidedSaveButtonProps = useMemo(
    () => ({
      ...saveButtonProps,
      children: 'Reset Error Message',
    }),
    [saveButtonProps]
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
    <>
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <WrapTokenTransactionStatus status={transaction.status} size="medium" />
        <Button
          variant="contained"
          color="success"
          onClick={navigateToSafeTransaction}
          disabled={!canNavigateToSafeTransaction}
        >
          Show Safe Transaction
        </Button>
      </Stack>

      <Stack gap={6} component="form" autoComplete="off">
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

        {transaction.tokenAmountInWallet &&
          transaction.tokenAmountInWallet !== transaction.tokenAmount && (
            <TextField
              label="Tokens Received in Wallet"
              value={`${utils.formatUnits(transaction.tokenAmountInWallet, 6).toString()} wXTM`}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'warning.main',
                  },
                },
              }}
            />
          )}

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

            <Button variant="contained" sx={{ width: 300, mt: 3 }} {...overidedSaveButtonProps} />
          </Paper>
        )}
      </Stack>
    </>
  );
};
