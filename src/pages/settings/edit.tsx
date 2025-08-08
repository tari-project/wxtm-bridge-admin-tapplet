import { useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  TextField,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';

import { ServiceStatus } from '../../providers/settings-data-provider';
import { SettingsEntity } from '@tari-project/wxtm-bridge-backend-api';

export const SettingsEdit = () => {
  const {
    saveButtonProps,
    control,
    refineCore: { formLoading, query },
  } = useForm<SettingsEntity>({
    warnWhenUnsavedChanges: false,
    refineCoreProps: {
      resource: 'settings',
      id: 1,
      dataProviderName: 'settingsDataProvider',
      action: 'edit',
      redirect: false,
    },
  });

  const status = useMemo(() => {
    return query?.data?.data.wrapTokensServiceStatus || ServiceStatus.OFFLINE;
  }, [query]);

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} title="Settings">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Wrap Token Service Status
          </Typography>
          <Chip
            icon={
              <FiberManualRecordIcon
                fontSize="medium"
                sx={{
                  color: status === ServiceStatus.ONLINE ? 'success.main' : 'error.main',
                }}
              />
            }
            label={status === ServiceStatus.ONLINE ? 'Online' : 'Offline'}
            size="small"
            color={status === ServiceStatus.ONLINE ? 'success' : 'error'}
            variant="outlined"
          />
        </Box>

        <Controller
          control={control}
          name="wrapTokensServiceStatus"
          defaultValue={status}
          render={({ field }) => (
            <FormControl fullWidth sx={{ maxWidth: 320, mb: 3 }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={field.value}
                label="Status"
                onChange={field.onChange}
                defaultValue={status}
              >
                <MenuItem value={ServiceStatus.ONLINE}>Online</MenuItem>
                <MenuItem value={ServiceStatus.OFFLINE}>Off</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Batch Configuration
        </Typography>

        <Controller
          control={control}
          name="maxBatchSize"
          defaultValue={50}
          rules={{
            required: 'Max batch size is required',
            min: { value: 2, message: 'Must be at least 2' },
            max: { value: 50, message: 'Must not exceed 50' },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              sx={{ maxWidth: 320, mb: 3 }}
              label="Max Batch Size"
              type="number"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || 'Default: 50 transactions per batch'}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          control={control}
          name="maxBatchAgeMs"
          defaultValue={21600000}
          rules={{
            required: 'Max batch age is required',
            min: { value: 60000, message: 'Must be at least 60000ms (1 minute)' },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              sx={{ maxWidth: 320, mb: 3 }}
              label="Max Batch Age (ms)"
              type="number"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || 'Default: 21600000ms (6 hours)'}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          control={control}
          name="batchAmountThreshold"
          defaultValue="20000000000000000000000"
          rules={{
            required: 'Batch amount threshold is required',
            pattern: {
              value: /^\d+$/,
              message: 'Must be a valid number',
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              sx={{ maxWidth: 320 }}
              label="Batch Amount Threshold (wei)"
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message ||
                'Default: 20000000000000000000000 (20k tokens with 18 decimals)'
              }
            />
          )}
        />
      </Box>
    </Edit>
  );
};
