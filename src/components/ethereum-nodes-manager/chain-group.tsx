import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { NodeRow } from './node-row';
import { ChainGroupProps } from './types';

/**
 * One chain's worth of RPC nodes. Drag-and-drop is scoped to this context, so a
 * node can only be reordered within its own chain. On drop we hand the new id
 * order up to the parent, which persists the resulting `sortOrder` values.
 */
export const ChainGroup = ({
  chainId,
  label,
  caption,
  color,
  nodes,
  onReorder,
  onToggleEnabled,
  onEdit,
  onDelete,
  onAdd,
}: ChainGroupProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = nodes.findIndex((n) => n.id === active.id);
    const newIndex = nodes.findIndex((n) => n.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    const orderedIds = arrayMove(nodes, oldIndex, newIndex).map((n) => n.id);
    onReorder(chainId, orderedIds);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {caption}
            </Typography>
          </Box>
          <Chip
            size="small"
            variant="outlined"
            label={`${nodes.length} node${nodes.length === 1 ? '' : 's'}`}
          />
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onAdd(chainId)}
        >
          Add node
        </Button>
      </Box>

      {nodes.length === 0 ? (
        <Box
          sx={{
            px: 2,
            py: 2.5,
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No nodes configured — the frontend will fall back to viem's public RPCs for this chain.
          </Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={1}>
              {nodes.map((node, index) => (
                <NodeRow
                  key={node.id}
                  node={node}
                  position={index + 1}
                  onToggleEnabled={onToggleEnabled}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      )}
    </Box>
  );
};
