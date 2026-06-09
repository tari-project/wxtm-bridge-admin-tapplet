import { useEffect, useMemo, useState } from 'react';
import { useCreate, useDelete, useInvalidate, useList, useUpdate } from '@refinedev/core';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

import { EthereumNodeEntity } from '@tari-project/wxtm-bridge-backend-api';

import { ChainGroup } from './chain-group';
import { NodeFormDialog } from './node-form-dialog';
import { SUPPORTED_CHAINS } from './const';

const RESOURCE = 'ethereum-nodes';
const DATA_PROVIDER = 'ethereumNodesDataProvider';

interface FormState {
  open: boolean;
  chainId: number;
  node: EthereumNodeEntity | null;
}

/**
 * Self-contained CRUD section for the bridge's public Ethereum RPC nodes,
 * embedded at the bottom of the Settings page. Every action (add / edit /
 * toggle / reorder / delete) persists immediately via its own mutations and is
 * independent of the Settings form's Save button.
 *
 * Nodes are grouped by chain and ordered by priority — the first enabled node
 * is the frontend's primary RPC, the rest are viem `fallback()` endpoints.
 */
export const EthereumNodesManager = () => {
  const invalidate = useInvalidate();

  const { data, isLoading } = useList<EthereumNodeEntity>({
    resource: RESOURCE,
    dataProviderName: DATA_PROVIDER,
    pagination: { mode: 'off' },
  });

  const { mutate: createNode } = useCreate();
  const { mutate: updateNode } = useUpdate();
  const { mutate: deleteNode } = useDelete();

  // Local mirror of the server list so drag-reorder / toggles feel instant; it
  // resyncs whenever the query refetches after a mutation invalidation.
  const [nodes, setNodes] = useState<EthereumNodeEntity[]>([]);
  useEffect(() => {
    if (data?.data) {
      setNodes(data.data);
    }
  }, [data]);

  const [form, setForm] = useState<FormState>({ open: false, chainId: 1, node: null });
  const [deleteTarget, setDeleteTarget] = useState<EthereumNodeEntity | null>(null);
  const [saving, setSaving] = useState(false);

  const nodesByChain = useMemo(() => {
    const map = new Map<number, EthereumNodeEntity[]>();
    for (const chain of SUPPORTED_CHAINS) {
      map.set(chain.id, []);
    }
    for (const node of nodes) {
      const bucket = map.get(node.chainId);
      if (bucket) {
        bucket.push(node);
      }
    }
    for (const bucket of map.values()) {
      bucket.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    return map;
  }, [nodes]);

  const revalidate = () =>
    invalidate({ resource: RESOURCE, dataProviderName: DATA_PROVIDER, invalidates: ['list'] });

  const handleReorder = (chainId: number, orderedIds: number[]) => {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const reordered = orderedIds
      .map((id) => byId.get(id))
      .filter((n): n is EthereumNodeEntity => n !== undefined)
      .map((n, index) => ({ ...n, sortOrder: index }));
    const others = nodes.filter((n) => n.chainId !== chainId);
    setNodes([...others, ...reordered]);

    const changed = reordered.filter((n) => byId.get(n.id)?.sortOrder !== n.sortOrder);
    if (changed.length === 0) {
      return;
    }
    let remaining = changed.length;
    changed.forEach((node) => {
      updateNode(
        {
          resource: RESOURCE,
          dataProviderName: DATA_PROVIDER,
          id: node.id,
          values: { sortOrder: node.sortOrder },
          successNotification: false,
          mutationMode: 'pessimistic',
          invalidates: [],
        },
        {
          onSettled: () => {
            remaining -= 1;
            if (remaining === 0) {
              revalidate();
            }
          },
        }
      );
    });
  };

  const handleToggleEnabled = (node: EthereumNodeEntity, enabled: boolean) => {
    setNodes((prev) => prev.map((n) => (n.id === node.id ? { ...n, enabled } : n)));
    updateNode(
      {
        resource: RESOURCE,
        dataProviderName: DATA_PROVIDER,
        id: node.id,
        values: { enabled },
        successNotification: false,
        mutationMode: 'pessimistic',
        invalidates: [],
      },
      { onSuccess: revalidate, onError: revalidate }
    );
  };

  const handleSubmit = (values: { chainId: number; url: string; enabled: boolean }) => {
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      setForm({ open: false, chainId: values.chainId, node: null });
    };
    const onError = () => setSaving(false);

    if (form.node) {
      updateNode(
        { resource: RESOURCE, dataProviderName: DATA_PROVIDER, id: form.node.id, values },
        { onSuccess, onError }
      );
    } else {
      createNode(
        { resource: RESOURCE, dataProviderName: DATA_PROVIDER, values },
        { onSuccess, onError }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) {
      return;
    }
    setSaving(true);
    deleteNode(
      { resource: RESOURCE, dataProviderName: DATA_PROVIDER, id: deleteTarget.id },
      {
        onSuccess: () => {
          setSaving(false);
          setDeleteTarget(null);
        },
        onError: () => setSaving(false),
      }
    );
  };

  return (
    <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 0.5,
          fontWeight: 'bold',
          color: 'info.main',
          borderBottom: '2px solid',
          borderColor: 'info.main',
          pb: 1,
        }}
      >
        Ethereum RPC Nodes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Public RPC endpoints served to the frontend, per chain. Drag to set priority — the first
        enabled node is the primary RPC and the rest act as fallbacks. Changes here save
        immediately.
      </Typography>

      {isLoading && nodes.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        SUPPORTED_CHAINS.map((chain, index) => (
          <Box key={chain.id}>
            {index > 0 && <Divider sx={{ mb: 3 }} />}
            <ChainGroup
              chainId={chain.id}
              label={chain.label}
              caption={chain.caption}
              color={chain.color}
              nodes={nodesByChain.get(chain.id) ?? []}
              onReorder={handleReorder}
              onToggleEnabled={handleToggleEnabled}
              onEdit={(node) => setForm({ open: true, chainId: node.chainId, node })}
              onDelete={(node) => setDeleteTarget(node)}
              onAdd={(chainId) => setForm({ open: true, chainId, node: null })}
            />
          </Box>
        ))
      )}

      <NodeFormDialog
        open={form.open}
        chainId={form.chainId}
        node={form.node}
        saving={saving}
        onClose={() => setForm((prev) => ({ ...prev, open: false }))}
        onSubmit={handleSubmit}
      />

      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete RPC node?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ wordBreak: 'break-all' }}>
            {deleteTarget?.url} will be removed and no longer served to the frontend. This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={saving}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm} disabled={saving}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
