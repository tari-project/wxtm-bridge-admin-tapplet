import { Box, Paper } from '@mui/material';
import ReactJsonView from '@microlink/react-json-view';
import { useContext } from 'react';

import { ColorModeContext } from '../../contexts/color-mode';
import { WrapTokenTransactionDebugTabProps } from './types';

export const WrapTokenTransactionDebugTab = ({
  transaction,
}: WrapTokenTransactionDebugTabProps) => {
  const { mode } = useContext(ColorModeContext);

  const customDarkTheme = {
    base00: 'transparent', // Bg
    base01: '#2d2d2d',
    base02: '#42F7C0', // Lanes
    base03: '#737373',
    base04: '#b4b4b4',
    base05: '#ffffff',
    base06: '#e6e6e6',
    base07: '#37A794', // Text
    base08: '#ffff00',
    base09: '#42F7C0', // Data
    base0A: '#ffffff',
    base0B: '#ffffff',
    base0C: '#ffffff',
    base0D: '#37A794', // Arrows
    base0E: '#ffff00',
    base0F: '#ffffff',
  };

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
          theme={mode === 'dark' ? customDarkTheme : 'rjv-default'}
          enableClipboard={false}
          displayObjectSize={false}
          name={'debug'}
        />
      </Paper>
    </Box>
  );
};
