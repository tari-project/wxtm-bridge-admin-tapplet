import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Switch, Tooltip, Typography, useTheme } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { HealthChip } from './health-chip';
import { NodeRowProps } from './types';

/**
 * A single draggable RPC node. The drag handle is isolated to the grip icon so
 * the action buttons and the enabled switch stay clickable.
 */
export const NodeRow = ({
  node,
  position,
  onToggleEnabled,
  onEdit,
  onDelete,
  disabled,
}: NodeRowProps) => {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
  });

  return (
    <Box
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: isDragging ? 'action.selected' : 'background.paper',
        boxShadow: isDragging ? theme.shadows[6] : 'none',
        opacity: node.enabled ? 1 : 0.55,
        zIndex: isDragging ? 1 : 'auto',
      }}
    >
      <Tooltip title="Drag to reorder priority">
        <IconButton
          size="small"
          disableRipple
          disabled={disabled}
          sx={{
            cursor: disabled ? 'not-allowed' : 'grab',
            touchAction: 'none',
            color: 'text.disabled',
          }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Typography
        variant="caption"
        sx={{
          width: 22,
          textAlign: 'center',
          color: 'text.secondary',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {position}
      </Typography>

      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'monospace',
          fontSize: 13,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={node.url}
      >
        {node.url}
      </Typography>

      <HealthChip
        status={node.status}
        lastCheckedAt={node.lastCheckedAt}
        downSince={node.downSince}
      />

      <Tooltip
        title={
          node.enabled ? 'Enabled — served to the frontend' : 'Disabled — hidden from the frontend'
        }
      >
        <Switch
          size="small"
          checked={node.enabled}
          onChange={(e) => onToggleEnabled(node, e.target.checked)}
          disabled={disabled}
        />
      </Tooltip>

      <Tooltip title="Edit node">
        <IconButton size="small" onClick={() => onEdit(node)} disabled={disabled}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete node">
        <IconButton size="small" color="error" onClick={() => onDelete(node)} disabled={disabled}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
