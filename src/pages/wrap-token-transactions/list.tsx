import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import { useNavigation } from '@refinedev/core';
import React from 'react';
import { utils } from 'ethers';
import { Typography } from '@mui/material';
import { getGridStringOperators } from '@mui/x-data-grid';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';
import { DateFormatedField } from '../../components/date-formated-field';
import { TruncatedAddress } from '../../components/truncated-address';

export const WrapTokenTransactionsList = () => {
  const { dataGridProps } = useDataGrid({
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    },

    syncWithLocation: true,
  });

  const { push } = useNavigation();

  const columns = React.useMemo<GridColDef<WrapTokenTransactionEntity>[]>(
    () => [
      {
        field: 'safeNonce',
        headerName: 'Safe Nonce:',
        display: 'flex',
        flex: 0.3,
        filterOperators: getGridStringOperators().filter((op) =>
          ['equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'paymentId',
        headerName: 'Payment ID:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.paymentId} />;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'from',
        headerName: 'From Address:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.from} />;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'to',
        headerName: 'To Address:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.to} />;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'tokenAmount',
        headerName: 'Tokens Received:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.3,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.tokenAmount, 6)}</Typography>;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['contains', 'equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'amountAfterFee',
        headerName: 'Tokens to Mint:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.4,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.amountAfterFee, 6)}</Typography>;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['contains', 'equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'feeAmount',
        headerName: 'Fee:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.4,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.feeAmount, 6)}</Typography>;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['contains', 'equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },
      {
        field: 'status',
        headerName: 'Status:',
        display: 'flex',
        justifyContent: 'center',
        flex: 0.6,
        renderCell: ({ row }) => {
          return <WrapTokenTransactionStatus status={row.status} />;
        },
        filterOperators: getGridStringOperators().filter((op) =>
          ['equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
        ),
      },

      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        flex: 0.6,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.createdAt} />;
        },
        filterable: false,
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
          push(`/wrap-token-transactions/edit/${params.row.id}`);
        }}
        getRowClassName={(params) => {
          return params.row.error ? 'error-row' : '';
        }}
        sx={{
          '& .error-row': {
            backgroundColor: '#E78400',
          },
        }}
      />
    </List>
  );
};
