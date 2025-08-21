import { useMemo } from 'react';
import { List } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// import { TokensUnwrappedAuditEntity } from '@tari-project/wxtm-bridge-backend-api';

// import { DateFormatedField } from '../date-formated-field';
// import { formatTimeElapsed } from '../../helpers/format-time-elapsed';
//import { TokensUnwrappedTransactionAuditTabProps } from './types';

export const TokensUnwrappedTransactionAuditTab = () => {
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'fromStatus',
        headerName: 'From:',
        minWidth: 200,
      },
      {
        field: 'toStatus',
        headerName: 'To:',
        minWidth: 200,
      },
      {
        field: 'timeElapsed',
        headerName: 'Time Elapsed:',
        minWidth: 150,
        renderCell: ({ row }) => {
          return <>{row?.note?.error}</>;
        },
      },
      {
        field: 'totalTimeElapsed',
        headerName: 'Total Time:',
        minWidth: 150,
        renderCell: ({ row }) => {
          return <>{row?.note?.error}</>;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        minWidth: 150,
        renderCell: ({ row }) => {
          return <div>{row?.note?.error}</div>;
        },
      },
      {
        field: 'note',
        display: 'flex',
        flex: 1,
        headerName: 'Note:',
        renderCell: ({ row }) => {
          return <>{row?.note?.error}</>;
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        columns={columns}
        hideFooter
        disableColumnFilter
        disableColumnSorting
        disableColumnSelector
      />
    </List>
  );
};
