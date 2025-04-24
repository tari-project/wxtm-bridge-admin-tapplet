import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import { useNavigation } from '@refinedev/core';
import React from 'react';
import { utils } from 'ethers';
import { Typography } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';
import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';
import { DateFormatedField } from '../../components/date-formated-field';
import { TruncatedAddress } from '../../components/truncated-address';

export const WrapTokenTransactionsList = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const { push } = useNavigation();

  const columns = React.useMemo<GridColDef<WrapTokenTransactionEntity>[]>(
    () => [
      {
        field: 'paymentId',
        headerName: 'Payment ID:',
        display: 'flex',
        flex: 1,
      },
      {
        field: 'from',
        headerName: 'From Address:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.from} />;
        },
      },
      {
        field: 'to',
        headerName: 'To Address:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <BlockchainExplorerLink address={row.to}>{row.to}</BlockchainExplorerLink>;
        },
      },
      {
        field: 'tokenAmount',
        headerName: 'Tokens:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.4,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.tokenAmount, 6)}</Typography>;
        },
      },
      {
        field: 'status',
        headerName: 'Status:',
        display: 'flex',
        justifyContent: 'center',
        flex: 0.8,
        renderCell: ({ row }) => {
          return <WrapTokenTransactionStatus status={row.status} />;
        },
      },

      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        flex: 0.6,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.createdAt} />;
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        onRowClick={(params) => {
          push(`/wrap-token-transactions/show/${params.row.id}`);
        }}
      />
    </List>
  );
};
