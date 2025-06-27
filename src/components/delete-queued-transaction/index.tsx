import { Button, Typography, TextField, Stack, Paper, Box } from '@mui/material';
import { useSignTypedData } from 'wagmi';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

const calculateTOTP = (): number => {
  const T0 = 0;
  const Tx = 3600;
  const unixTime = Math.floor(Date.now() / 1000);
  const totp = Math.floor((unixTime - T0) / Tx);
  return totp;
};

export const DeleteQueuedTransaction = () => {
  const { signTypedData, data, error } = useSignTypedData();
  const { control, handleSubmit, getValues } = useForm<{ safeTxHash: string }>({
    defaultValues: {
      safeTxHash: '',
    },
  });
  const [signature, setSignature] = useState<`0x${string}`>();
  const [apiError, setApiError] = useState();

  const safeTxHash = getValues('safeTxHash');

  const handleSign = ({
    chainId,
    safeAddress,
    safeTxHash,
    totp,
  }: {
    chainId: number;
    safeAddress: string;
    safeTxHash: `0x${string}`;
    totp: number;
  }) => {
    signTypedData({
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        DeleteRequest: [
          { name: 'safeTxHash', type: 'bytes32' },
          { name: 'totp', type: 'uint256' },
        ],
      },
      primaryType: 'DeleteRequest',
      domain: {
        name: 'Safe Transaction Service',
        version: '1.0',
        chainId: BigInt(chainId),
        verifyingContract: safeAddress,
      },
      message: {
        safeTxHash,
        totp: BigInt(totp),
      },
    });
  };

  const onSubmit = ({ safeTxHash }: { safeTxHash: string }) => {
    setSignature(undefined);

    handleSign({
      chainId: 11155111,
      safeAddress: '0x2E2E8F5B7B63684DD404B1c4236A4a172Cbb125d',
      safeTxHash: safeTxHash as `0x${string}`,
      totp: calculateTOTP(),
    });
  };

  useEffect(() => {
    if (data) {
      setSignature(data);
    }
  }, [data, setSignature]);

  useEffect(() => {
    if (safeTxHash && signature) {
      fetch(
        `https://safe-transaction-sepolia.safe.global/api/v2/multisig-transactions/${safeTxHash}/`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signature }),
        }
      ).catch((e) => {
        setApiError(e);
      });
    }
  }, [safeTxHash, signature, setApiError]);

  return (
    <Stack spacing={4}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="medium">
            Delete Queued Transaction
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Removes the queued but not executed multi-signature transaction associated with the
            given Safe transaction hash. Only the proposer or the delegate who proposed the
            transaction can delete it. If the transaction was proposed by a delegate, it must still
            be a valid delegate for the transaction proposer. An EOA is required to sign the
            following EIP-712 data:
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={1}>
              <Controller
                name="safeTxHash"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Safe Tx Hash"
                    variant="outlined"
                    fullWidth
                    placeholder="0x..."
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="error"
                sx={{ alignSelf: 'flex-start' }}
              >
                Delete Transaction
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="medium">
            Result
          </Typography>

          {signature && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Signature:
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {signature}
              </Typography>
            </Stack>
          )}

          {error && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="error">
                Error:
              </Typography>
              <Typography variant="body2" color="error" sx={{ wordBreak: 'break-all' }}>
                {JSON.stringify(error)}
              </Typography>
            </Stack>
          )}

          {apiError && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="error">
                API Error:
              </Typography>
              <Typography variant="body2" color="error" sx={{ wordBreak: 'break-all' }}>
                {JSON.stringify(apiError)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};
