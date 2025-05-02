import { ChipProps } from '@mui/material';

import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

export type TokensUnwrappedStatusProps = {
  status: TokensUnwrappedEntity.status;
  size?: ChipProps['size'];
};
