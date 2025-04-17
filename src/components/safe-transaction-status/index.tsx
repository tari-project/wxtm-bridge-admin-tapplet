import { useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';

import { SafeTransactionStatusProps } from './types';

export const SafeTransactionStatus = ({ transaction }: SafeTransactionStatusProps) => {
  const { label, color } = useMemo(() => {
    const allSignaturesCollected =
      transaction?.confirmationsRequired === transaction?.confirmations?.length;

    if (allSignaturesCollected && !transaction?.isExecuted) {
      return {
        label: 'Ready',
        color: 'warning',
      };
    }

    if (allSignaturesCollected && transaction?.isExecuted) {
      return {
        label: 'Success',
        color: 'success',
      };
    }

    return {
      label: 'Pending',
      color: 'default',
    };
  }, [transaction]);

  return <Chip label={label} color={color as ChipProps['color']} size="small" sx={{ width: 70 }} />;
};
