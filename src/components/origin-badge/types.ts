import { ChipProps } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

export type WrapTokenTransactionOriginProps = {
  status: WrapTokenTransactionEntity.origin;
  size?: ChipProps['size'];
};
