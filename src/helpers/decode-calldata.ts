import { WXTMControllerInterface } from '@tari-project/wxtm-bridge-contracts/typechain/contracts/WXTMController';

export type DecodedParameter = {
  name: string;
  type: string;
  value: string;
};

export type DecodedCallData = {
  method?: string;
  parameters: DecodedParameter[];
};

export const decodeCalldata = ({
  data,
  contractInterface,
}: {
  data?: string;
  contractInterface: WXTMControllerInterface;
}): DecodedCallData => {
  try {
    if (!data || typeof data !== 'string' || !data.startsWith('0x')) {
      throw new Error('Invalid data format in decodeCalldata');
    }
    const parsedTransaction = contractInterface.parseTransaction({ data });

    const method = parsedTransaction.name;
    const functionFragment = parsedTransaction.functionFragment;

    const parameters = functionFragment.inputs.map((input, index) => ({
      name: input.name,
      type: input.type,
      value: parsedTransaction.args[index].toString(),
    }));

    return {
      method,
      parameters,
    };
  } catch (error) {
    console.error('Error decoding calldata:', error);
    return {
      method: undefined,
      parameters: [],
    };
  }
};
