import { useMemo } from 'react';
import { Chip, ChipProps, Tooltip, Box, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { EthereumNodeEntity } from '@tari-project/wxtm-bridge-backend-api';

import { DateFormatedField } from '../date-formated-field';
import { HealthChipProps } from './types';

const STATUS_META: Record<
  EthereumNodeEntity.status,
  { label: string; color: ChipProps['color']; dot: string }
> = {
  [EthereumNodeEntity.status.UP]: { label: 'Up', color: 'success', dot: 'success.main' },
  [EthereumNodeEntity.status.DOWN]: { label: 'Down', color: 'error', dot: 'error.main' },
  [EthereumNodeEntity.status.UNKNOWN]: {
    label: 'Unknown',
    color: 'default',
    dot: 'text.disabled',
  },
};

/**
 * Read-only health semaphore driven by the monitor lambda's fields. The chip
 * colour reflects `status`; the tooltip surfaces when it was last probed and,
 * for a down node, how long it has been failing.
 */
export const HealthChip = ({ status, lastCheckedAt, downSince }: HealthChipProps) => {
  const meta = useMemo(
    () => STATUS_META[status] ?? STATUS_META[EthereumNodeEntity.status.UNKNOWN],
    [status]
  );

  const tooltip = (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="caption" component="div" sx={{ display: 'flex', gap: 0.5 }}>
        <span>Last checked:</span>
        {lastCheckedAt ? <DateFormatedField date={lastCheckedAt} /> : <span>never</span>}
      </Typography>
      {status === EthereumNodeEntity.status.DOWN && downSince && (
        <Typography variant="caption" component="div" sx={{ display: 'flex', gap: 0.5 }}>
          <span>Down since:</span>
          <DateFormatedField date={downSince} />
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip arrow title={tooltip}>
      <Chip
        size="small"
        variant="outlined"
        color={meta.color}
        icon={<FiberManualRecordIcon sx={{ fontSize: 12, color: meta.dot }} />}
        label={meta.label}
        sx={{ minWidth: 92, '& .MuiChip-icon': { ml: 1 } }}
      />
    </Tooltip>
  );
};
