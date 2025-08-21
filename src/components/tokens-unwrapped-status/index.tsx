import { useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

import { TokensUnwrappedStatusProps } from './types';

export const TokensUnwrappedStatus = ({
  status,
  size = 'small',
  sx,
}: TokensUnwrappedStatusProps) => {
  const { label, color } = useMemo(() => {
    switch (status) {
      case TokensUnwrappedEntity.status.CREATED:
        return {
          label: 'Created',
          color: 'default',
        };
      case TokensUnwrappedEntity.status.AWAITING_CONFIRMATION:
        return {
          label: 'Awaiting Confirmation',
          color: 'warning',
        };
      case TokensUnwrappedEntity.status.CONFIRMED:
        return {
          label: 'Confirmed',
          color: 'secondary',
        };
      case TokensUnwrappedEntity.status.TOKENS_BURNED:
        return {
          label: 'Tokens Burned',
          color: 'error',
        };
      case TokensUnwrappedEntity.status.TOKENS_MINTED:
        return {
          label: 'Tokens Minted',
          color: 'success',
        };
    }
  }, [status]);

  return (
    <Chip
      label={label}
      color={color as ChipProps['color']}
      size={size}
      sx={{ width: '100%', display: 'flex', ...sx }}
    />
  );
};
