import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { TabPanel, TabContext } from '@mui/lab';

import { TokensUnwrappedTransactionDataTab } from '../../components/tokens-unwrapped-data-tab';
import { TokensUnwrappedTransactionAuditTab } from '../../components/tokens-unwrapped-audit-tab';
import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

export const TokensUnwrappedEdit = () => {
  const [value, setValue] = useState('0');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const {
    saveButtonProps,
    refineCore: { formLoading, query },
  } = useForm<TokensUnwrappedEntity>({});

  const transaction = query?.data?.data;

  return (
    <Edit isLoading={formLoading} saveButtonProps={{ sx: { display: 'none' } }} title="Back">
      {transaction && (
        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{ borderBottom: 2, borderColor: 'divider' }}
          >
            <Tab label="Data" value="0" />
            <Tab label="Audit" value="1" />
          </Tabs>

          <TabPanel value="0" sx={{ px: 0 }}>
            <TokensUnwrappedTransactionDataTab
              transaction={transaction}
              saveButtonProps={saveButtonProps}
            />
          </TabPanel>

          <TabPanel value="1" sx={{ px: 0 }}>
            <TokensUnwrappedTransactionAuditTab />
          </TabPanel>
        </TabContext>
      )}
    </Edit>
  );
};
