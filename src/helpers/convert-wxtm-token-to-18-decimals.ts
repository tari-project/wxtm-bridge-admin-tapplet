import { ethers } from 'ethers';

export const convertWxtmTokenTo18Decimals = ({
  wxtmTokenAmount,
}: {
  wxtmTokenAmount: string;
}): string => {
  return ethers.BigNumber.from(wxtmTokenAmount).mul(ethers.BigNumber.from(10).pow(12)).toString();
};
