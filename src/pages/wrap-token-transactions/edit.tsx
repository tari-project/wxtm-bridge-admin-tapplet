import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { useNavigation } from '@refinedev/core';
import { utils } from 'ethers';

import {
  WrapTokenTransactionEntity,
  UpdateWrapTokenTransactionDTO,
} from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';
import { useProposeMintTransaction } from '../../hooks/use-propose-mint-transaction';

export const WrapTokenTransactionsEdit = () => {
  const [isTokenAmountEditable, setIsTokenAmountEditable] = useState(false);
  const { proposeMintTransaction, loading } = useProposeMintTransaction();
  const { push } = useNavigation();

  const {
    saveButtonProps,
    refineCore: { formLoading, query, onFinish },
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<WrapTokenTransactionEntity>({
    refineCoreProps: { redirect: false },
  });

  const transaction = query?.data?.data;

  useEffect(() => {
    if (transaction?.tokenAmount) {
      setValue('tokenAmount', utils.formatUnits(transaction?.tokenAmount, 6));
    }
  }, [transaction?.tokenAmount, setValue]);

  const onSubmit = useCallback(
    (data: Pick<UpdateWrapTokenTransactionDTO, 'status' | 'tokenAmount'>) => {
      if (data.tokenAmount) {
        data.tokenAmount = utils.parseUnits(data.tokenAmount, 6).toString();
      }

      onFinish(data);
    },
    [onFinish]
  );

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
      onClick: handleSubmit(onSubmit),
    }),
    [saveButtonProps, canUpdate, handleSubmit, onSubmit]
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
        wxtmTokenAmountAfterFee: transaction.amountAfterFee,
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
              rules={{
                validate: (value) => {
                  const decimalPlaces = value.split('.')[1]?.length || 0;
                  return decimalPlaces <= 6 || 'Only 6 decimal places';
                },
                required: 'Token amount is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tokens Received"
                  margin="normal"
                  type="number"
                  disabled={!canUpdate || !isTokenAmountEditable}
                  error={!!errors.tokenAmount}
                  helperText={errors.tokenAmount?.message as string}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="outlined"
                            size="medium"
                            color="info"
                            onClick={() => setIsTokenAmountEditable(!isTokenAmountEditable)}
                            disabled={!canUpdate}
                          >
                            Edit
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Box>

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

          <Controller
            name="status"
            control={control}
            defaultValue={transaction?.status}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  {...field}
                  labelId="status-select-label"
                  id="status-select"
                  label="Status"
                  disabled={!canUpdate}
                >
                  <MenuItem value={WrapTokenTransactionEntity.status.TOKENS_RECEIVED}>
                    Tokens Received
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Stack>
      )}
    </Edit>
  );
};
