import { useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatusProps } from './types';

export const WrapTokenTransactionStatus = ({
  status,
  size = 'small',
}: WrapTokenTransactionStatusProps) => {
  const { label, color } = useMemo(() => {
    if (status === WrapTokenTransactionEntity.status.TOKENS_RECEIVED) {
      return {
        label: 'Tokens received',
        color: 'success',
      };
    }

    if (status === WrapTokenTransactionEntity.status.TOKENS_SENT) {
      return {
        label: 'Tokens sent',
        color: 'warning',
      };
    }

    return {
      label: 'Waiting for tokens',
      color: 'default',
    };
  }, [status]);

  return <Chip label={label} color={color as ChipProps['color']} size={size} sx={{ width: 150 }} />;
};
