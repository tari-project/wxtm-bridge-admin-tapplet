import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import { useNavigation } from '@refinedev/core';
import React from 'react';
import { utils } from 'ethers';
import { Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { WrapTokenTransactionStatus } from '../../components/wrap-token-transaction-status';
import { WrapTokenTransactionOrigin } from '../../components/origin-badge';
import { DateFormatedField } from '../../components/date-formated-field';
import { TruncatedAddress } from '../../components/truncated-address';

import {
  equalsEmptyOperators,
  containsEqualsEmptyOperators,
} from '../../helpers/allowed-operators';
import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';

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
        field: 'id',
        headerName: 'ID:',
        display: 'flex',
        align: 'center',
        flex: 0.3,
        filterOperators: equalsEmptyOperators(),
        renderCell: ({ row }) => {
          return (
            <Typography sx={{ backgroundColor: row?.error?.length && '#E78400' }}>
              {row.id}
            </Typography>
          );
        },
      },
      {
        field: 'safeNonce',
        headerName: 'Safe Nonce:',
        display: 'flex',
        align: 'center',
        flex: 0.3,
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'paymentId',
        headerName: 'Payment ID:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.paymentId} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'from',
        headerName: 'From Address:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.from} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'to',
        headerName: 'To Address:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.to} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'tokenAmount',
        headerName: 'Tokens Received:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.51,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.tokenAmount, 6)}</Typography>;
        },
        filterOperators: containsEqualsEmptyOperators(),
      },
      {
        field: 'amountAfterFee',
        headerName: 'Tokens to Mint:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.51,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.amountAfterFee, 6)}</Typography>;
        },
        filterOperators: containsEqualsEmptyOperators(),
      },
      {
        field: 'feeAmount',
        headerName: 'Fee:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.45,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.feeAmount, 6)}</Typography>;
        },
        filterOperators: containsEqualsEmptyOperators(),
      },
      {
        field: 'transactionHash',
        headerName: 'Transaction Hash:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return (
            <BlockchainExplorerLink txHash={row.transactionHash}>
              <TruncatedAddress address={row.transactionHash || ''} startChars={5} endChars={7} />
            </BlockchainExplorerLink>
          );
        },
      },
      {
        field: 'blockHeight',
        headerName: 'Block Height:',
        display: 'flex',
        align: 'center',
        headerAlign: 'left',
        flex: 0.31,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return <Typography>{row.tariBlockHeight}</Typography>;
        },
      },
      {
        field: 'status',
        headerName: 'Status:',
        display: 'flex',
        justifyContent: 'center',
        flex: 0.7,
        renderCell: ({ row }) => {
          return <WrapTokenTransactionStatus status={row.status} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'origin',
        headerName: 'Origin:',
        display: 'flex',
        align: 'center',
        justifyContent: 'center',
        flex: 0.4,
        renderCell: ({ row }) => {
          return <WrapTokenTransactionOrigin origin={row.origin} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'Aggregated',
        headerName: 'Aggregated',
        display: 'flex',
        align: 'center',
        flex: 0.1,
        renderCell: ({ row }) => {
          return row.aggregatedTransactions.length ? (
            <Typography
              component="span"
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                borderRadius: '50%',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {row.aggregatedTransactions.length}
            </Typography>
          ) : null;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.createdAt} />;
        },
        filterable: false,
      },
      {
        field: 'debug',
        headerName: 'Debug data:',
        display: 'flex',
        align: 'center',
        flex: 0.2,
        renderCell: ({ row }) => {
          return row.debug ? <CheckCircleIcon color="warning" fontSize="medium" /> : null;
        },
        filterOperators: equalsEmptyOperators(),
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
      />
    </List>
  );
};
