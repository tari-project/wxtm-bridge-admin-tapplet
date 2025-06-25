import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionDataTab } from '../../components/wrap-token-transaction-data-tab';
import { WrapTokenTransactionAuditTab } from '../../components/wrap-token-transaction-audit-tab';
import { WrapTokenTransactionDebugTab } from '../../components/wrap-token-transaction-debug-tab';

export const WrapTokenTransactionsEdit = () => {
  const [value, setValue] = useState('0');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const {
    saveButtonProps,
    refineCore: { formLoading, query },
  } = useForm<WrapTokenTransactionEntity>({
    refineCoreProps: { redirect: false },
  });

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
            {transaction.debug && <Tab label="Debug" value="2" />}
          </Tabs>

          <TabPanel value="0" sx={{ px: 0 }}>
            <WrapTokenTransactionDataTab
              transaction={transaction}
              saveButtonProps={saveButtonProps}
            />
          </TabPanel>

          <TabPanel value="1" sx={{ px: 0 }}>
            <WrapTokenTransactionAuditTab transaction={transaction} />
          </TabPanel>

          <TabPanel value="2" sx={{ px: 0 }}>
            <WrapTokenTransactionDebugTab transaction={transaction} />
          </TabPanel>
        </TabContext>
      )}
    </Edit>
  );
};
