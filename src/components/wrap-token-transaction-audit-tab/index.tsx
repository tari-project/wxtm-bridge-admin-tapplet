import { useMemo } from 'react';
import { List } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { WrapTokenAuditEntity } from '@tari-project/wxtm-bridge-backend-api';

import { DateFormatedField } from '../date-formated-field';
import { formatTimeElapsed } from '../../helpers/format-time-elapsed';
import { WrapTokenTransactionAuditTabProps } from './types';

const minWidth = 150;

export const WrapTokenTransactionAuditTab = ({
  transaction,
}: WrapTokenTransactionAuditTabProps) => {
  const audits = useMemo(() => {
    return [...transaction.audits].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  }, [transaction]);

  const columns = useMemo<GridColDef<WrapTokenAuditEntity>[]>(
    () => [
      {
        field: 'fromStatus',
        headerName: 'From:',
        minWidth,
      },
      {
        field: 'toStatus',
        headerName: 'To:',
        minWidth,
      },
      {
        field: 'timeElapsed',
        headerName: 'Time Elapsed:',
        minWidth,
        renderCell: ({ row }) => {
          const index = audits.findIndex((audit) => audit.id === row.id);

          if (index === 0) {
            return 'N/A';
          }

          const currentRowDate = new Date(row.createdAt);
          const prevRowDate = new Date(audits[index - 1].createdAt);
          const diffMs = currentRowDate.getTime() - prevRowDate.getTime();

          return formatTimeElapsed(diffMs);
        },
      },
      {
        field: 'totalTimeElapsed',
        headerName: 'Total Time:',
        minWidth,
        renderCell: ({ row }) => {
          const index = audits.findIndex((audit) => audit.id === row.id);

          if (index === 0) {
            return '0m';
          }

          const currentRowDate = new Date(row.createdAt);
          const firstRowDate = new Date(audits[0].createdAt);
          const diffMs = currentRowDate.getTime() - firstRowDate.getTime();

          return formatTimeElapsed(diffMs);
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created At:',
        display: 'flex',
        minWidth,
        renderCell: ({ row }) => {
          return <DateFormatedField date={row.createdAt} />;
        },
      },
      {
        field: 'note',
        display: 'flex',
        flex: 1,
        headerName: 'Note:',
      },
    ],
    [audits]
  );

  return (
    <List>
      <DataGrid
        rows={audits}
        columns={columns}
        hideFooter
        disableColumnFilter
        disableColumnSorting
        disableColumnSelector
      />
    </List>
  );
};
