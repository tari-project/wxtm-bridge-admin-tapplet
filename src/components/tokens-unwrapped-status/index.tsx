import { useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

import { TokensUnwrappedStatusProps } from './types';

export const TokensUnwrappedStatus = ({ status, size = 'small' }: TokensUnwrappedStatusProps) => {
  const { label, color } = useMemo(() => {
    if (status === TokensUnwrappedEntity.status.TOKENS_MINTED) {
      return {
        label: 'Tokens Minted',
        color: 'success',
      };
    }

    return {
      label: 'Tokens Burned',
      color: 'error',
    };
  }, [status]);

  return <Chip label={label} color={color as ChipProps['color']} size={size} sx={{ width: 150 }} />;
};
