import { useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionOriginProps } from './types';

export const WrapTokenTransactionOrigin = ({
  status,
  size = 'small',
}: WrapTokenTransactionOriginProps) => {
  const { label, color } = useMemo(() => {
    switch (status) {
      case WrapTokenTransactionEntity.origin.BRIDGE:
        return {
          label: 'Bridge',
          color: 'secondary',
        };
      case WrapTokenTransactionEntity.origin.MINING:
        return {
          label: 'Mining',
          color: 'info',
        };

      default:
        return {
          label: status || 'Unknown',
          color: 'default',
        };
    }
  }, [status]);

  return (
    <Chip
      label={label}
      color={color as ChipProps['color']}
      size={size}
      sx={{ width: 80, display: 'flex' }}
    />
  );
};
