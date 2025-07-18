import { useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatusProps } from './types';

export const WrapTokenTransactionStatus = ({
  status,
  size = 'small',
}: WrapTokenTransactionStatusProps) => {
  const { label, color } = useMemo(() => {
    switch (status) {
      case WrapTokenTransactionEntity.status.TOKENS_SENT:
        return {
          label: 'Tokens sent',
          color: 'default',
        };
      case WrapTokenTransactionEntity.status.TOKENS_RECEIVED:
        return {
          label: 'Tokens received',
          color: 'info',
        };
      case WrapTokenTransactionEntity.status.CREATING_SAFE_TRANSACTION:
        return {
          label: 'Creating Safe Tx',
          color: 'warning',
        };
      case WrapTokenTransactionEntity.status.CREATING_SAFE_TRANSACTION_UNPROCESSABLE:
        return {
          label: 'Creating Safe Tx Error',
          color: 'error',
        };
      case WrapTokenTransactionEntity.status.SAFE_TRANSACTION_CREATED:
        return {
          label: 'Safe Tx Created',
          color: 'secondary',
        };
      case WrapTokenTransactionEntity.status.SAFE_TRANSACTION_UNPROCESSABLE:
        return {
          label: 'Safe Tx Error',
          color: 'error',
        };
      case WrapTokenTransactionEntity.status.EXECUTING_SAFE_TRANSACTION:
        return {
          label: 'Executing Safe Tx',
          color: 'warning',
        };
      case WrapTokenTransactionEntity.status.SAFE_TRANSACTION_EXECUTED:
        return {
          label: 'Safe Tx Executed',
          color: 'success',
        };
      case WrapTokenTransactionEntity.status.TOKENS_RECEIVED_WITH_MISMATCH:
        return {
          label: 'Amount Mismatch',
          color: 'warning',
        };
      default:
        return {
          label: status || 'Unknown',
          color: 'default',
        };
    }
  }, [status]);

  return <Chip label={label} color={color as ChipProps['color']} size={size} sx={{ width: 150 }} />;
};
