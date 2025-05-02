import { Select, Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

export const TokensUnwrappedEdit = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading, query },
    control,
    formState: { errors },
  } = useForm<TokensUnwrappedEntity>({});

  const transaction = query?.data?.data;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} title="Back">
      {transaction && (
        <Stack gap={6} component="form" autoComplete="off">
          <Controller
            name="status"
            control={control}
            defaultValue={transaction.status}
            render={({ field }) => (
              <Select {...field} fullWidth label="Status" error={!!errors.status}>
                <MenuItem value={TokensUnwrappedEntity.status.TOKENS_BURNED}>
                  Tokens Burned
                </MenuItem>
                <MenuItem value={TokensUnwrappedEntity.status.TOKENS_MINTED}>
                  Tokens Minted
                </MenuItem>
              </Select>
            )}
          />
        </Stack>
      )}
    </Edit>
  );
};
