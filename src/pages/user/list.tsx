import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { List, useDataGrid } from '@refinedev/mui';
import React from 'react';

export const UsersList = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        minWidth: 50,
        display: 'flex',
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'auth0Id',
        headerName: 'AUTH ID',
        minWidth: 200,
        display: 'flex',
      },
      {
        field: 'createdAt',
        headerName: 'createdAt',
        type: 'string',
        minWidth: 200,
        display: 'flex',
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
