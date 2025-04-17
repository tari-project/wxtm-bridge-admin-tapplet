import { useSafe } from '../hooks/use-safe';
import { useAccount } from 'wagmi';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { utils } from 'ethers';
import { useForm } from '@refinedev/react-hook-form';
import { useModal } from '@refinedev/core';

import { SAFE_ADDRESS } from '../config';
import { CreateTransactionProps } from '@safe-global/protocol-kit';

import { WXTM__factory } from '@tari-project/wxtm-bridge-contracts';

const wXTM = '0xcBe79AB990E0Ab45Cb9148db7d434477E49b7374';

//TODO this file is for testing purposes only, for proposing a transaction to the safe
const useCreateTransaction = () => {
  const { initApi, initSafe } = useSafe();
  const { address } = useAccount();

  const createTransaction = async (transactionData: CreateTransactionProps['transactions'][0]) => {
    try {
      const api = initApi();
      const safe = await initSafe();
      const nextNonce = await api.getNextNonce(SAFE_ADDRESS);

      const options = {
        nonce: Number(nextNonce),
      };

      const safeTransaction = await safe.createTransaction({
        transactions: [transactionData],
        options,
      });

      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      const senderSignature = await safe.signHash(safeTxHash);

      await api.proposeTransaction({
        safeAddress: SAFE_ADDRESS,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: address || '',
        senderSignature: senderSignature.data,
      });
    } catch (e) {
      console.log('Error in useCreateTransaction', e);
    }
  };

  return { createTransaction };
};

export const SafeInteractions = () => {
  const { createTransaction } = useCreateTransaction();
  const { visible, show, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      address: '',
      amount: '',
    },
    refineCoreProps: {
      resource: 'mint',
    },
  });

  const handleOpen = () => {
    reset({
      address: '',
      amount: '',
    });
    show();
  };

  const onSubmit = async (data: { address: string; amount: string }) => {
    try {
      const tokenAmount = utils.parseUnits(data.amount, 18);
      const txData = WXTM__factory.createInterface().encodeFunctionData('mint', [
        data.address,
        tokenAmount,
      ]);

      await createTransaction({
        to: wXTM,
        data: txData,
        value: '0',
      });

      close();
    } catch (error) {
      console.error('Error in mint function:', error);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained" sx={{ mb: 3 }}>
        Mint wXTM Tokens
      </Button>

      <Dialog open={visible} onClose={close}>
        <DialogTitle>Mint wXTM Tokens</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Recipient Address"
              margin="normal"
              variant="outlined"
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register('address', {
                required: 'Address is required',
                validate: (value) =>
                  utils.isAddress(value) || 'Please enter a valid Ethereum address',
              })}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              margin="normal"
              variant="outlined"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                validate: (value) => Number(value) > 0 || 'Please enter a positive number',
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained">
            Mint Tokens
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
