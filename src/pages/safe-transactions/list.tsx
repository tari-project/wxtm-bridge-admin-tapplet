import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { DateField, List, useDataGrid } from '@refinedev/mui';
import { Chip } from '@mui/material';
import { useNavigation } from '@refinedev/core';

import { SafeTransaction } from '../../providers/safe-transactions-data-provider';
import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';
import { SafeTransactionStatus } from '../../components/safe-transaction-status';
import { decodeWXTMTokenCalldata } from '../../helpers/decode-wxtm-token-calldata';

export const SafeTransactionsList = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const { push } = useNavigation();

  const columns = React.useMemo<GridColDef<SafeTransaction>[]>(
    () => [
      {
        field: 'transactionHash',
        headerName: 'Transaction Hash:',
        display: 'flex',
        flex: 2,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return (
            <BlockchainExplorerLink txHash={row.transactionHash}>
              {row.transactionHash}
            </BlockchainExplorerLink>
          );
        },
      },
      {
        field: 'nonce',
        headerName: 'Nonce:',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
      },
      {
        field: '1',
        headerName: 'Operation:',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => (
          <Chip
            sx={{ width: 60 }}
            size="small"
            label={decodeWXTMTokenCalldata({ data: row.data })?.method}
          />
        ),
      },
      {
        field: '2',
        headerName: 'Signatures:',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => `${row.confirmationsRequired}/${row.confirmations?.length || 0}`,
      },
      {
        field: '3',
        headerName: 'Status:  ',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return <SafeTransactionStatus transaction={row} />;
        },
      },
      {
        field: 'submissionDate',
        headerName: 'Submitted At:',
        type: 'string',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return <DateField value={row.submissionDate} format="YYYY-MM-DD HH:MM" />;
        },
      },
      {
        field: 'executionDate',
        headerName: 'Executed At:',
        type: 'string',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return (
            <DateField
              value={row.isExecuted ? row.executionDate : null}
              format="YYYY-MM-DD HH:MM"
            />
          );
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
        getRowId={(row) => row.safeTxHash}
        onRowClick={(params) => {
          push(`/safe-transactions/show/${params.row.safeTxHash}`);
        }}
      />
    </List>
  );
};
