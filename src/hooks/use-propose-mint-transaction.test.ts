import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WXTM__factory } from '@tari-project/wxtm-bridge-contracts';

import { useProposeMintTransaction } from './use-propose-mint-transaction';
import { convertWxtmTokenTo18Decimals } from '../helpers/convert-wxtm-token-to-18-decimals';
import { useSafe } from './use-safe';
import { SAFE_ADDRESS, WXTM_TOKEN_ADDRESS } from '../config';

const mutate = vi.fn();
vi.mock('@refinedev/core', () => ({
  useNavigation: () => ({
    push: vi.fn(),
  }),
  useNotification: () => ({
    open: vi.fn(),
  }),
  useUpdate: () => ({
    mutate,
  }),
}));

vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0xTestAddress',
  }),
}));

const nonce = 2;

const createTransaction = vi.fn().mockResolvedValue({ data: { nonce } });
const getTransactionHash = vi.fn().mockResolvedValue('0xTestHash');
const signHash = vi.fn().mockResolvedValue({ data: '0xTestSignature' });
const getNextNonce = vi.fn().mockResolvedValue(nonce);
const proposeTransaction = vi.fn().mockResolvedValue({});

vi.mock('./use-safe', () => ({
  useSafe: () => ({
    initSafe: vi.fn().mockResolvedValue({
      createTransaction,
      getTransactionHash,
      signHash,
    }),
    initApi: vi.fn().mockReturnValue({
      getNextNonce,
      proposeTransaction,
    }),
  }),
}));

const encodeFunctionData = vi.fn().mockReturnValue('0xEncodedData');

vi.mock('@tari-project/wxtm-bridge-contracts', () => ({
  WXTM__factory: {
    createInterface: () => ({
      encodeFunctionData,
    }),
  },
}));

vi.mock('../helpers/convert-wxtm-token-to-18-decimals', () => ({
  convertWxtmTokenTo18Decimals: vi.fn().mockReturnValue('WXTMT_TOKEN_CONVERTED_TO_18_DECIMALS'),
}));

describe('useProposeMintTransaction', () => {
  const mockParams = {
    toAddress: '0xRecipientAddress',
    wxtmTokenAmountAfterFee: '1000000',
    wrapTokenTransactionId: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle mint transaction proposal successfully', async () => {
    const { result } = renderHook(() => useProposeMintTransaction());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.proposeMintTransaction(mockParams);
    });

    expect(result.current.loading).toBe(false);

    expect(convertWxtmTokenTo18Decimals).toHaveBeenCalledWith({
      wxtmTokenAmount: mockParams.wxtmTokenAmountAfterFee,
    });

    expect(WXTM__factory.createInterface().encodeFunctionData).toHaveBeenCalledWith('mint', [
      mockParams.toAddress,
      'WXTMT_TOKEN_CONVERTED_TO_18_DECIMALS',
    ]);

    const safe = await useSafe().initSafe();

    expect(safe.createTransaction).toHaveBeenCalledWith({
      transactions: [
        {
          to: WXTM_TOKEN_ADDRESS,
          data: '0xEncodedData',
          value: '0',
        },
      ],
      options: {
        nonce: 2,
      },
    });

    const api = useSafe().initApi();
    expect(api.proposeTransaction).toHaveBeenCalledWith({
      safeAddress: SAFE_ADDRESS,
      safeTransactionData: { nonce },
      safeTxHash: '0xTestHash',
      senderAddress: '0xTestAddress',
      senderSignature: '0xTestSignature',
    });

    expect(mutate).toHaveBeenCalledWith({
      resource: 'wrap-token-transactions',
      id: mockParams.wrapTokenTransactionId,
      values: {
        safeTxHash: '0xTestHash',
        safeNonce: 2,
      },
    });
  });
});
