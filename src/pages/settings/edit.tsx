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
  Paper,
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

  const wrapSubmissionStatus = useMemo(() => {
    return query?.data?.data.bridgeWrapSubmissionsServiceStatus || ServiceStatus.OFFLINE;
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

  const unwrapDailyLimit = useMemo(() => {
    return query?.data?.data.unwrapDailyLimit || '10000000000000000000000000'; // 10_000_000 tokens
  }, [query]);

  const unwrapMinDaysOfFunds = useMemo(() => {
    return query?.data?.data.unwrapMinDaysOfFunds || 3;
  }, [query]);

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} title="Settings">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Bridge Status
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

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Controller
            control={control}
            name="wrapTokensServiceStatus"
            defaultValue={status}
            render={({ field }) => (
              <FormControl fullWidth sx={{ maxWidth: 320 }}>
                <InputLabel id="status-select-label">Main Service Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={field.value}
                  label="Main Service Status"
                  onChange={field.onChange}
                >
                  <MenuItem value={ServiceStatus.ONLINE}>Online</MenuItem>
                  <MenuItem value={ServiceStatus.OFFLINE}>Off</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="bridgeWrapSubmissionsServiceStatus"
            defaultValue={wrapSubmissionStatus}
            render={({ field }) => (
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel id="submission-status-select-label">Wrap Submissions</InputLabel>
                <Select
                  labelId="submission-status-select-label"
                  id="submission-status-select"
                  value={field.value}
                  label="Wrap Submissions"
                  onChange={field.onChange}
                >
                  <MenuItem value={ServiceStatus.ONLINE}>Active</MenuItem>
                  <MenuItem value={ServiceStatus.OFFLINE}>Paused</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1,
            }}
          >
            Wrap Features
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Batch Execute Configuration
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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
                  sx={{ maxWidth: 320 }}
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
                  sx={{ maxWidth: 320 }}
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
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Daily limits
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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
                  value={
                    field.value ? field.value.slice(0, -18) || '10000000000000000000000000' : ''
                  }
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
        </Paper>

        <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: 'secondary.main',
              borderBottom: '2px solid',
              borderColor: 'secondary.main',
              pb: 1,
            }}
          >
            Unwrap Features
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Manual Approval
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Daily limits
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Controller
              control={control}
              name="unwrapDailyLimit"
              defaultValue={unwrapDailyLimit}
              rules={{
                required: 'Daily unwrap limit is required',
                pattern: {
                  value: /^\d+$/,
                  message: 'Must be a valid number',
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  value={
                    field.value ? field.value.slice(0, -18) || '10000000000000000000000000' : ''
                  }
                  fullWidth
                  sx={{ maxWidth: 320 }}
                  label="Unwrap daily limit (xWTM)"
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

            <Controller
              control={control}
              name="unwrapMinDaysOfFunds"
              defaultValue={unwrapMinDaysOfFunds}
              rules={{
                required: 'Minimum days of funds is required',
                min: { value: 1, message: 'Must be at least 1' },
                max: { value: 10, message: 'Must not exceed 10' },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  sx={{ maxWidth: 320 }}
                  label="Minimum days of funds"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'Default: 3 days'}
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
          </Box>
        </Paper>
      </Box>
    </Edit>
  );
};
