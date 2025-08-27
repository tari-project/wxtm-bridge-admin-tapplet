import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import React from 'react';
import { utils } from 'ethers';
import { Typography } from '@mui/material';
import { useNavigation } from '@refinedev/core';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';
import { DateFormatedField } from '../../components/date-formated-field';
import { TruncatedAddress } from '../../components/truncated-address';
import { TokensUnwrappedStatus } from '../../components/tokens-unwrapped-status';

import {
  equalsEmptyOperators,
  containsEqualsEmptyOperators,
} from '../../helpers/allowed-operators';

export const TokensUnwrappedList = () => {
  const { dataGridProps } = useDataGrid({
    sorters: {
      initial: [
        {
          field: 'nonce',
          order: 'desc',
        },
      ],
    },
    syncWithLocation: true,
  });

  const { push } = useNavigation();

  const columns = React.useMemo<GridColDef<TokensUnwrappedEntity>[]>(
    () => [
      {
        field: 'nonce',
        headerName: 'Nonce:',
        display: 'flex',
        align: 'center',
        flex: 0.3,
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'from',
        headerName: 'From Address:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return (
            <BlockchainExplorerLink address={row.from}>
              <TruncatedAddress address={row.from} />
            </BlockchainExplorerLink>
          );
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'targetTariAddress',
        headerName: 'To Address:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.targetTariAddress} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      /** @TODO Fix filtering by amount for tokens unwrapped */
      {
        field: 'amount',
        headerName: 'Tokens Burned:',
        display: 'flex',
        align: 'right',
        flex: 0.51,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.amount, 18)}</Typography>;
        },
        filterable: false,
        filterOperators: containsEqualsEmptyOperators(),
      },
      {
        field: 'feeAmount',
        headerName: 'Fee:',
        display: 'flex',
        align: 'right',
        flex: 0.45,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.feeAmount, 18)}</Typography>;
        },
        filterable: false,
        filterOperators: containsEqualsEmptyOperators(),
      },
      {
        field: 'amountAfterFee',
        headerName: 'Tokens To Send:',
        display: 'flex',
        align: 'right',
        flex: 0.51,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.amountAfterFee, 18)}</Typography>;
        },
        filterable: false,
        filterOperators: containsEqualsEmptyOperators(),
      },
      {
        field: 'status',
        headerName: 'Status:',
        display: 'flex',
        justifyContent: 'center',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <TokensUnwrappedStatus status={row.status} />;
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'transactionHash',
        headerName: 'Transaction Hash:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return (
            <BlockchainExplorerLink txHash={row.transactionHash}>
              <TruncatedAddress address={row.transactionHash} />
            </BlockchainExplorerLink>
          );
        },
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'blockNumber',
        headerName: 'Block Number:',
        display: 'flex',
        justifyContent: 'center',
        align: 'center',
        flex: 0.31,
        filterOperators: equalsEmptyOperators(),
      },
      {
        field: 'blockTimestamp',
        headerName: 'Block Timestamp:',
        display: 'flex',
        align: 'center',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.blockTimestamp} />;
        },
        filterable: false,
      },
      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        align: 'center',
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
          push(`/tokens-unwrapped/edit/${params.row.id}`);
        }}
      />
    </List>
  );
};
