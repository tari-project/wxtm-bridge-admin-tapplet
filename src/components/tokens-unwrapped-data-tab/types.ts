import { ButtonProps } from '@mui/material';
import { TokensUnwrappedEntity } from '@tari-project/wxtm-bridge-backend-api';

export type TokensUnwrappedTransactionDataTabProps = {
  transaction: TokensUnwrappedEntity;
  saveButtonProps: ButtonProps;
};
