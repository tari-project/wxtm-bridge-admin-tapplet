import { Box, Paper } from '@mui/material';
import ReactJsonView from '@microlink/react-json-view';

import { WrapTokenTransactionDebugTabProps } from './types';

export const WrapTokenTransactionDebugTab = ({
  transaction,
}: WrapTokenTransactionDebugTabProps) => {
  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          padding: 3,
        }}
      >
        <ReactJsonView
          src={transaction.debug || {}}
          enableClipboard={false}
          displayObjectSize={false}
          name={'debug'}
        />
      </Paper>
    </Box>
  );
};
