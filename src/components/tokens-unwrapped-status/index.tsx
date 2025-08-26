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
      case TokensUnwrappedEntity.status.CONFIRMED_AWAITING_APPROVAL:
        return {
          label: 'Confirmed Awaiting Approval',
          color: 'warning',
        };
      case TokensUnwrappedEntity.status.SENDING_TOKENS:
        return {
          label: 'Sending Tokens',
          color: 'secondary',
        };
      case TokensUnwrappedEntity.status.TOKENS_SENT:
        return {
          label: 'Tokens Sent',
          color: 'success',
        };
      case TokensUnwrappedEntity.status.UNPROCESSABLE:
        return {
          label: 'Unprocessable',
          color: 'error',
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
