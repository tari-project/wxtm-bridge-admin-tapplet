import { ChipProps } from '@mui/material';

import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

export type WrapTokenTransactionOriginProps = {
  origin: WrapTokenTransactionEntity.origin;
  size?: ChipProps['size'];
};
