import { Box, List, Paper, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useContext, useMemo } from 'react';
import { utils } from 'ethers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

import { ColorModeContext } from '../../contexts/color-mode';
import { WrapTokenTransactionDebugTabProps } from './types';
import { WrapTokenTransactionStatus } from '../wrap-token-transaction-status';
import { WrapTokenTransactionOrigin } from '../origin-badge';
import { TruncatedAddress } from '../truncated-address';
import { DateFormatedField } from '../date-formated-field';
import { BlockchainExplorerLink } from '../blockchain-explorer-link';

export const WrapTokenTransactionAggregatedTab = ({
  transaction,
}: WrapTokenTransactionDebugTabProps) => {
  const aggregatedTransactions = transaction.aggregatedTransactions || [];

  const columns = useMemo<GridColDef<WrapTokenTransactionEntity>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID:',
        display: 'flex',
        flex: 0.2,
        renderCell: ({ row }) => {
          return (
            <Typography sx={{ backgroundColor: row?.error?.length && '#E78400' }}>
              {row.id}
            </Typography>
          );
        },
      },

      {
        field: 'to',
        headerName: 'To Address:',
        display: 'flex',
        flex: 1,
      },
      {
        field: 'tokenAmount',
        headerName: 'Tokens Received:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.tokenAmount, 6)}</Typography>;
        },
      },
      {
        field: 'amountAfterFee',
        headerName: 'Tokens to Mint:',
        display: 'flex',
        align: 'right',
        headerAlign: 'right',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <Typography>{utils.formatUnits(row.amountAfterFee, 6)}</Typography>;
        },
      },
      {
        field: 'status',
        headerName: 'Status:',
        display: 'flex',
        flex: 0.4,
        renderCell: ({ row }) => {
          return <WrapTokenTransactionStatus status={row.status} />;
        },
      },
      {
        field: 'origin',
        headerName: 'Origin:',
        display: 'flex',
        justifyContent: 'center',
        flex: 0.3,
        renderCell: ({ row }) => {
          return <WrapTokenTransactionOrigin origin={row.origin} />;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        flex: 0.5,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.createdAt} />;
        },
      },
    ],
    []
  );

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Aggregating Transaction
      </Typography>
      <List sx={{}}>
        <DataGrid rows={[transaction]} columns={columns} hideFooter disableRowSelectionOnClick />
      </List>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Source Transactions
      </Typography>
      <List sx={{}}>
        <DataGrid
          rows={aggregatedTransactions}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
        />
      </List>
    </>
  );
};
