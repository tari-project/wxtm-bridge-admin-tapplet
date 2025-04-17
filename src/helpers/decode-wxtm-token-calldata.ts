import { WXTM__factory } from '@tari-project/wxtm-bridge-contracts';

import { decodeCalldata } from './decode-calldata';

const contractInterface = WXTM__factory.createInterface();

export const decodeWXTMTokenCalldata = ({ data }: { data?: string }) => {
  return decodeCalldata({ data, contractInterface });
};
