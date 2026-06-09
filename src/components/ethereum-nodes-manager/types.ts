import { EthereumNodeEntity } from '@tari-project/wxtm-bridge-backend-api';

export interface ChainMeta {
  id: number;
  label: string;
  /** Short caption shown under the chain label. */
  caption: string;
  /** Theme palette colour used for the chain's accent dot. */
  color: string;
}

export interface ChainGroupProps {
  chainId: number;
  label: string;
  caption: string;
  color: string;
  /** Nodes for this chain, already sorted by priority (sortOrder asc). */
  nodes: EthereumNodeEntity[];
  onReorder: (chainId: number, orderedIds: number[]) => void;
  onToggleEnabled: (node: EthereumNodeEntity, enabled: boolean) => void;
  onEdit: (node: EthereumNodeEntity) => void;
  onDelete: (node: EthereumNodeEntity) => void;
  onAdd: (chainId: number) => void;
}

export interface NodeRowProps {
  node: EthereumNodeEntity;
  /** 1-based priority position shown to the operator. */
  position: number;
  onToggleEnabled: (node: EthereumNodeEntity, enabled: boolean) => void;
  onEdit: (node: EthereumNodeEntity) => void;
  onDelete: (node: EthereumNodeEntity) => void;
}

export interface HealthChipProps {
  status: EthereumNodeEntity.status;
  lastCheckedAt: string | null;
  downSince: string | null;
}

export interface NodeFormDialogProps {
  open: boolean;
  /** Pre-selected chain when adding; ignored when editing (uses the node's chain). */
  chainId: number;
  /** The node being edited, or null when adding a new one. */
  node: EthereumNodeEntity | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: { chainId: number; url: string; enabled: boolean }) => void;
}
