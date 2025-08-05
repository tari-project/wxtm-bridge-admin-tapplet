import { Tooltip } from '@mui/material';

import { TruncatedAddressProps } from './types';

export const TruncatedAddress = ({
  address,
  startChars = 6,
  endChars = 6,
}: TruncatedAddressProps) => {
  if (!address) return null;

  if (address.length <= startChars + endChars) {
    return <span>{address}</span>;
  }

  const truncated = `${address.substring(0, startChars)}....${address.substring(address.length - endChars)}`;

  return (
    <Tooltip title={address} arrow>
      <span>{truncated}</span>
    </Tooltip>
  );
};
