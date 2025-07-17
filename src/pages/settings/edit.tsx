import { useMemo } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography, Box, Chip } from '@mui/material';
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
            <FormControl fullWidth sx={{ maxWidth: 320 }}>
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
      </Box>
    </Edit>
  );
};
