import { ChainMeta } from './types';

/**
 * The chains the backend accepts (`SUPPORTED_CHAIN_IDS` in
 * `ethereum-node.const.ts`). Rendered in this order, always shown even when a
 * chain has no nodes yet.
 */
export const SUPPORTED_CHAINS: ChainMeta[] = [
  { id: 1, label: 'Ethereum Mainnet', caption: 'chainId 1', color: '#627EEA' },
  { id: 11155111, label: 'Sepolia', caption: 'chainId 11155111 · testnet', color: '#CFB53B' },
  { id: 84532, label: 'Base Sepolia', caption: 'chainId 84532 · testnet', color: '#0052FF' },
];

/** Matches the backend's `@IsUrl({ protocols: ['http','https'], require_protocol: true })`. */
export const HTTP_URL_PATTERN = /^https?:\/\/.+/i;
