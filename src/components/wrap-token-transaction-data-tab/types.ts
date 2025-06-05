import { ButtonProps } from '@mui/material';
import { WrapTokenTransactionEntity } from '@tari-project/wxtm-bridge-backend-api';

export type WrapTokenTransactionDataTabProps = {
  transaction: WrapTokenTransactionEntity;
  saveButtonProps: ButtonProps;
};
