export interface DeleteRequestData {
  types: {
    EIP712Domain: [
      { name: 'name'; type: 'string' },
      { name: 'version'; type: 'string' },
      { name: 'chainId'; type: 'uint256' },
      { name: 'verifyingContract'; type: 'address' },
    ];
    DeleteRequest: [{ name: 'safeTxHash'; type: 'bytes32' }, { name: 'totp'; type: 'uint256' }];
  };
  primaryType: 'DeleteRequest';
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  message: {
    safeTxHash: string;
    totp: number;
  };
}
