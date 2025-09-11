import { useEffect } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useApiUrl, useCustom } from '@refinedev/core';
import { utils } from 'ethers';

import { PaymentWalletBalanceResponseDTO } from '@tari-project/wxtm-bridge-backend-api';

export const PaymentWalletBalance = () => {
  const apiUrl = useApiUrl();

  const { data, isLoading, isError, error, refetch } = useCustom<PaymentWalletBalanceResponseDTO>({
    url: `${apiUrl}/payment-wallet-balance`,
    method: 'get',
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 1000 * 10);

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Loading wallet balance...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" color="error" sx={{ textAlign: 'center', py: 2 }}>
            Error: {error?.message || 'Failed to fetch wallet balance'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No wallet balance data available
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card elevation={2}>
      <CardContent>
        <Stack
          flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
          justifyContent="space-around"
          alignItems="center"
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Wallet Balance
            </Typography>
            <Typography variant="body1">
              {utils.formatUnits(data.data.walletBalance, 6)} XTM
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Pending Transactions
            </Typography>
            <Typography variant="body1">
              {utils.formatUnits(data.data.pendingTransactionsAmount, 6)} XTM
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Available Balance
            </Typography>
            <Typography variant="body1">
              {utils.formatUnits(data.data.availableWalletBalance, 6)} XTM
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
