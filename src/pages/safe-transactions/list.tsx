import React from 'react';
import { utils } from 'ethers';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import { Chip, Typography } from '@mui/material';
import { useNavigation } from '@refinedev/core';

import { SafeTransaction } from '../../providers/safe-transactions-data-provider';
import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';
import { SafeTransactionStatus } from '../../components/safe-transaction-status';
import { decodeWXTMTokenCalldata } from '../../helpers/decode-wxtm-token-calldata';
import { DateFormatedField } from '../../components/date-formated-field';

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
        flex: 0.3,
        filterable: false,
        sortable: false,
      },
      {
        field: '1',
        headerName: 'Operation:',
        display: 'flex',
        flex: 0.4,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => (
          <Chip
            sx={{ width: 60 }}
            size="small"
            label={decodeWXTMTokenCalldata({ data: row.data })?.method || 'other'}
          />
        ),
      },

      {
        field: '2',
        headerName: 'To Address:',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          const address =
            decodeWXTMTokenCalldata({ data: row.data })?.parameters[0]?.value || 'N/A';
          return <BlockchainExplorerLink address={address}>{address}</BlockchainExplorerLink>;
        },
      },

      {
        field: '3',
        headerName: 'Token Amount:',
        display: 'flex',
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          const amount18Decimals = decodeWXTMTokenCalldata({ data: row.data })?.parameters[1]
            ?.value;

          if (amount18Decimals) {
            return <Typography>{utils.formatUnits(amount18Decimals, 18)}</Typography>;
          } else {
            return <Typography>N/A</Typography>;
          }
        },
      },
      {
        field: '4',
        headerName: 'Signatures:',
        display: 'flex',
        flex: 0.4,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => `${row.confirmationsRequired}/${row.confirmations?.length || 0}`,
      },
      {
        field: '5',
        headerName: 'Status:  ',
        display: 'flex',
        flex: 0.5,
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
        flex: 0.7,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.submissionDate} />;
        },
      },
      {
        field: 'executionDate',
        headerName: 'Executed At:',
        type: 'string',
        display: 'flex',
        flex: 0.7,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.isExecuted ? row.executionDate : null} />;
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
