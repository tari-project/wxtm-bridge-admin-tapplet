import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Select, Stack, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { useNavigation } from '@refinedev/core';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';
import { useProposeMintTransaction } from '../../hooks/use-propose-mint-transaction';

export const WrapTokenTransactionsEdit = () => {
  const [isTokenAmountEditable, setIsTokenAmountEditable] = useState(false);
  const { proposeMintTransaction, loading } = useProposeMintTransaction();
  const { push } = useNavigation();

  const {
    saveButtonProps,
    refineCore: { formLoading, query },
    control,
    formState: { errors },
  } = useForm<WrapTokenTransactionEntity>({
    refineCoreProps: { redirect: false },
  });

  const transaction = query?.data?.data;

  const canUpdate = useMemo(() => {
    return (
      transaction?.status !== WrapTokenTransactionEntity.status.TOKENS_RECEIVED &&
      transaction?.status !== WrapTokenTransactionEntity.status.SAFE_TRANSACTION_CREATED
    );
  }, [transaction]);

  const disabledSaveButtonProps = useMemo(
    () => ({
      ...saveButtonProps,
      disabled: !canUpdate,
    }),
    [saveButtonProps, canUpdate]
  );

  const canNavigateToSafeTransaction = useMemo(() => {
    return !!transaction?.safeTxHash;
  }, [transaction]);

  const canProposeSafeTransaction = useMemo(() => {
    return transaction?.status === WrapTokenTransactionEntity.status.TOKENS_RECEIVED;
  }, [transaction]);

  const handleProposeMintTransaction = useCallback(() => {
    if (transaction) {
      proposeMintTransaction({
        toAddress: transaction.to,
        wxtmTokenAmount: transaction.tokenAmount,
        wrapTokenTransactionId: transaction.id,
      });
    }
  }, [transaction, proposeMintTransaction]);

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
        <>
          <Button
            variant="contained"
            color="success"
            onClick={navigateToSafeTransaction}
            disabled={!canNavigateToSafeTransaction}
          >
            Show Safe Transaction
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleProposeMintTransaction}
            loading={loading}
            disabled={!canProposeSafeTransaction}
          >
            Propose Safe Transaction
          </Button>
        </>
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

          <Box>
            <Controller
              name="tokenAmount"
              control={control}
              defaultValue={transaction?.tokenAmount}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Token Amount"
                  margin="normal"
                  required
                  disabled={!canUpdate || !isTokenAmountEditable}
                  error={!!errors.tokenAmount}
                  helperText={errors.tokenAmount?.message as string}
                  fullWidth
                />
              )}
            />
            <Button
              variant="outlined"
              size="small"
              color="info"
              onClick={() => setIsTokenAmountEditable(!isTokenAmountEditable)}
              sx={{ mt: 1 }}
              disabled={!canUpdate}
            >
              Allow Edit
            </Button>
          </Box>
          <Controller
            name="status"
            control={control}
            defaultValue={transaction?.status}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                label="Status"
                disabled={!canUpdate}
                error={!!errors.status}
              >
                <MenuItem value={WrapTokenTransactionEntity.status.TOKENS_SENT}>
                  Tokens Sent
                </MenuItem>
                <MenuItem value={WrapTokenTransactionEntity.status.TOKENS_RECEIVED}>
                  Tokens Received
                </MenuItem>
              </Select>
            )}
          />
        </Stack>
      )}
    </Edit>
  );
};
