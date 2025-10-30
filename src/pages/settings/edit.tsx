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

  const maxBatchSize = useMemo(() => {
    return query?.data?.data.maxBatchSize || 50;
  }, [query]);

  const maxBatchAge = useMemo(() => {
    return query?.data?.data.maxBatchAgeMs || 21_600_000; // 6 hours
  }, [query]);

  const batchAmountThreshold = useMemo(() => {
    return query?.data?.data.batchAmountThreshold || '20000000000000000000000'; // 20_000 tokens
  }, [query]);

  const unwrapManualApprovalThreshold = useMemo(() => {
    return query?.data?.data.unwrapManualApprovalThreshold || '0';
  }, [query]);

  const wrapDailyLimit = useMemo(() => {
    return query?.data?.data.wrapDailyLimit || '10000000000000000000000000'; // 10_000_000 tokens
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
          Batch Execute Configuration
        </Typography>

        <Controller
          control={control}
          name="maxBatchSize"
          defaultValue={maxBatchSize}
          rules={{
            required: 'Max batch size is required',
            min: { value: 2, message: 'Must be at least 2' },
            max: { value: 50, message: 'Must not exceed 50' },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              sx={{ maxWidth: 320, mr: 3 }}
              label="Max Batch Size"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || 'Default: 50 transactions per batch'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  field.onChange(value === '' ? '' : Number(value));
                }
              }}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="maxBatchAgeMs"
          defaultValue={maxBatchAge}
          rules={{
            required: 'Max batch age is required',
            min: { value: 60_000, message: 'Must be at least 60000ms (1 minute)' },
          }}
          render={({ field, fieldState }) => (
            <TextField
              value={field.value ? Math.round(field.value / 3600000) : ''}
              fullWidth
              sx={{ maxWidth: 320, mr: 3 }}
              label="Max Batch Age (hours)"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || 'Default: 6 hours'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  field.onChange(value === '' ? '' : Number(value) * 3600000);
                }
              }}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="batchAmountThreshold"
          defaultValue={batchAmountThreshold}
          rules={{
            required: 'Batch amount threshold is required',
            min: {
              value: '1000000000000000000000',
              message: 'Min batch threshold is 1 000 tokens',
            },
            max: {
              value: '5000000000000000000000000',
              message: 'Max batch threshold is 50 000 tokens',
            },
            pattern: {
              value: /^\d+$/,
              message: 'Must be a valid number',
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              value={field.value ? field.value.slice(0, -18) || '0' : ''}
              fullWidth
              sx={{ maxWidth: 320 }}
              label="Batch Amount Threshold (tokens)"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || 'Default: 20 000 tokens'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  field.onChange(value === '' ? '' : value + '000000000000000000');
                }
              }}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
            />
          )}
        />

        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Manual Approval Configuration (unwraps)
        </Typography>

        <Controller
          control={control}
          name="unwrapManualApprovalThreshold"
          defaultValue={unwrapManualApprovalThreshold}
          rules={{
            required: 'Batch amount threshold is required',
            pattern: {
              value: /^\d+$/,
              message: 'Must be a valid number',
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              value={field.value ? field.value.slice(0, -18) || '0' : ''}
              fullWidth
              sx={{ maxWidth: 320 }}
              label="Manual Approval Threshold"
              error={!!fieldState.error}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  field.onChange(value === '' ? '' : value + '000000000000000000');
                }
              }}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
            />
          )}
        />

        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Wrap limits
        </Typography>

        <Controller
          control={control}
          name="wrapDailyLimit"
          defaultValue={wrapDailyLimit}
          rules={{
            required: 'Daily wrap limit is required',
            pattern: {
              value: /^\d+$/,
              message: 'Must be a valid number',
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              value={field.value ? field.value.slice(0, -18) || '10000000000000000000000000' : ''}
              fullWidth
              sx={{ maxWidth: 320 }}
              label="Daily wrap limit (XTM)"
              error={!!fieldState.error}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  field.onChange(value === '' ? '' : value + '000000000000000000');
                }
              }}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
            />
          )}
        />
      </Box>
    </Edit>
  );
};
