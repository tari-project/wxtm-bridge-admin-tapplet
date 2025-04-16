import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, ShowButton, useDataGrid } from '@refinedev/mui';

import { SafeTransaction } from '../../providers/safe-transactions-data-provider';

export const SafeTransactionsList = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef<SafeTransaction>[]>(
    () => [
      {
        field: 'transactionHash',
        headerName: 'Transaction Hash',
        display: 'flex',
        flex: 2,
        filterable: false,
        sortable: false,
      },
      {
        field: 'nonce',
        headerName: 'Nonce',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
      },
      {
        field: 'isExecuted',
        headerName: 'isExecuted',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
      },
      {
        field: '',
        headerName: 'Confirmations',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => `${row.confirmationsRequired}/${row.confirmations?.length || 0}`,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        align: 'right',
        headerAlign: 'right',
        minWidth: 120,
        sortable: false,
        display: 'flex',
        renderCell: function render({ row }) {
          return <ShowButton variant="contained" recordItemId={row.safeTxHash} />;
        },
      },
      {
        field: 'submissionDate',
        headerName: 'Submitted At',
        type: 'string',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        valueFormatter: (value) => {
          return new Date(value).toLocaleString();
        },
      },

      {
        field: 'executionDate',
        headerName: 'Executed At',
        type: 'string',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        valueFormatter: (value) => {
          return new Date(value).toLocaleString();
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} getRowId={(row) => row.safeTxHash} />
    </List>
  );
};
