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
          color: 'info',
        };
      case TokensUnwrappedEntity.status.CONFIRMED:
        return {
          label: 'Confirmed',
          color: 'primary',
        };
      case TokensUnwrappedEntity.status.CONFIRMED_AWAITING_APPROVAL:
        return {
          label: 'Confirmed Awaiting Approval',
          color: 'warning',
        };
      case TokensUnwrappedEntity.status.INIT_SEND_TOKENS:
        return {
          label: 'Init Sending Tokens',
          color: 'secondary',
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
      case TokensUnwrappedEntity.status.CREATED_UNPROCESSABLE:
        return {
          label: 'Unprocessable Created',
          color: 'error',
        };
      case TokensUnwrappedEntity.status.AWAITING_CONFIRMATION_UNPROCESSABLE:
        return {
          label: 'Unprocessable Awaiting Confirmation',
          color: 'error',
        };
      case TokensUnwrappedEntity.status.CONFIRMED_UNPROCESSABLE:
        return {
          label: 'Unprocessable Confirmed',
          color: 'error',
        };
      case TokensUnwrappedEntity.status.SENDING_TOKENS_UNPROCESSABLE:
        return {
          label: 'Unprocessable sending Tokens',
          color: 'error',
        };

      default:
        return {
          label: status,
          color: 'default',
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
