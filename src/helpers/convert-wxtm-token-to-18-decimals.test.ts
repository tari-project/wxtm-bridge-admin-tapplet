import { describe, it, expect } from 'vitest';
import { convertWxtmTokenTo18Decimals } from './convert-wxtm-token-to-18-decimals';
import { utils } from 'ethers';

describe('convertWxtmTokenTo18Decimals', () => {
  it('should convert WXT token', () => {
    const wxtmTokenAmount = utils.parseUnits('1', 6).toString();

    const result = convertWxtmTokenTo18Decimals({ wxtmTokenAmount });
    expect(result).toBe('1000000000000000000');
  });
});
