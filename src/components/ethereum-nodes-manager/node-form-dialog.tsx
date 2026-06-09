import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import { SUPPORTED_CHAINS, HTTP_URL_PATTERN } from './const';
import { NodeFormDialogProps } from './types';

/**
 * Add / edit dialog for a single RPC node. Mirrors the backend DTO: a chain
 * (one of the supported ids), an http(s) URL, and an enabled flag.
 */
export const NodeFormDialog = ({
  open,
  chainId,
  node,
  saving,
  onClose,
  onSubmit,
}: NodeFormDialogProps) => {
  const isEdit = node !== null;

  const [chain, setChain] = useState(chainId);
  const [url, setUrl] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [touched, setTouched] = useState(false);

  // Re-seed the form whenever the dialog (re)opens for a different node/chain.
  useEffect(() => {
    if (!open) {
      return;
    }
    setChain(node ? node.chainId : chainId);
    setUrl(node ? node.url : '');
    setEnabled(node ? node.enabled : true);
    setTouched(false);
  }, [open, node, chainId]);

  const urlError = touched && !HTTP_URL_PATTERN.test(url.trim());

  const handleSubmit = () => {
    setTouched(true);
    if (!HTTP_URL_PATTERN.test(url.trim())) {
      return;
    }
    onSubmit({ chainId: chain, url: url.trim(), enabled });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit RPC node' : 'Add RPC node'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="node-chain-label">Chain</InputLabel>
            <Select
              labelId="node-chain-label"
              label="Chain"
              value={chain}
              onChange={(e) => setChain(Number(e.target.value))}
            >
              {SUPPORTED_CHAINS.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.label} ({c.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            autoFocus
            label="RPC URL"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            error={urlError}
            helperText={
              urlError ? 'Enter a valid http(s) URL' : 'Full JSON-RPC endpoint, including https://'
            }
          />

          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enabled (served to the frontend)"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {isEdit ? 'Save changes' : 'Add node'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
