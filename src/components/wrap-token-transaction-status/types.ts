import { ChipProps } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

export type WrapTokenTransactionStatusProps = {
  status: WrapTokenTransactionEntity.status;
  size?: ChipProps['size'];
};
