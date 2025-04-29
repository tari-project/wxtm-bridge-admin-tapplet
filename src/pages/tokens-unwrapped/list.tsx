import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import React from 'react';
import { utils } from 'ethers';
import { Typography } from '@mui/material';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';
import { DateFormatedField } from '../../components/date-formated-field';
import { TruncatedAddress } from '../../components/truncated-address';

export const TokensUnwrappedList = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef<TokensUnwrappedEntity>[]>(
    () => [
      {
        field: 'subgraphId',
        headerName: 'Subgraph ID:',
        display: 'flex',
        flex: 1,
      },
      {
        field: 'from',
        headerName: 'From Address:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <BlockchainExplorerLink address={row.from}>{row.from}</BlockchainExplorerLink>;
        },
      },
      {
        field: 'targetTariAddress',
        headerName: 'To Address:',
        display: 'flex',
        flex: 1,
        renderCell: ({ row }) => {
          return <TruncatedAddress address={row.targetTariAddress} />;
        },
      },
      {
        field: 'amount',
        headerName: 'Tokens:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.4,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.amount, 6)}</Typography>;
        },
      },
      {
        field: 'blockNumber',
        headerName: 'Block Number:',
        display: 'flex',
        justifyContent: 'center',
        flex: 0.8,
      },

      {
        field: 'blockTimestamp',
        headerName: 'Block Timestamp:',
        display: 'flex',
        flex: 0.6,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.createdAt} />;
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
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
