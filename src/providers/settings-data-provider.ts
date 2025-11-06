import { DataProvider, GetOneResponse, UpdateParams, UpdateResponse } from '@refinedev/core';
import { SettingsService, SettingsEntity } from '@tari-project/wxtm-bridge-backend-api';

export const ServiceStatus = SettingsEntity.wrapTokensServiceStatus;
export type ServiceStatus = SettingsEntity.wrapTokensServiceStatus;

export const settingsDataProvider: DataProvider = {
  getList: async () => {
    throw new Error('create method is not implemented in safeTransactionsDataProvider');
  },

  getOne: async <TData = SettingsEntity>(): Promise<GetOneResponse<TData>> => {
    const resp = await SettingsService.getSettings();
    return { data: resp as TData };
  },

  create: async () => {
    throw new Error('create method is not implemented in safeTransactionsDataProvider');
  },

  update: async <
    TData = SettingsEntity,
    TVariables = {
      wrapTokensServiceStatus: ServiceStatus;
      maxBatchSize: number;
      maxBatchAgeMs: number;
      batchAmountThreshold: string;
      unwrapManualApprovalThreshold: string;
      wrapDailyLimit: string;
      unwrapDailyLimit: string;
      unwrapMinDaysOfFunds: number;
    },
  >({
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const typedVars = variables as {
      wrapTokensServiceStatus: ServiceStatus;
      maxBatchSize: number;
      maxBatchAgeMs: number;
      batchAmountThreshold: string;
      unwrapManualApprovalThreshold: string;
      wrapDailyLimit: string;
      unwrapDailyLimit: string;
      unwrapMinDaysOfFunds: number;
    };

    await SettingsService.updateSettings({
      wrapTokensServiceStatus: typedVars.wrapTokensServiceStatus,
      maxBatchSize: typedVars.maxBatchSize,
      maxBatchAgeMs: typedVars.maxBatchAgeMs,
      batchAmountThreshold: typedVars.batchAmountThreshold,
      unwrapManualApprovalThreshold: typedVars.unwrapManualApprovalThreshold,
      wrapDailyLimit: typedVars.wrapDailyLimit,
      unwrapDailyLimit: typedVars.unwrapDailyLimit,
      unwrapMinDaysOfFunds: typedVars.unwrapMinDaysOfFunds,
    });

    return {
      data: {} as unknown as TData,
    };
  },

  deleteOne: async () => {
    throw new Error('deleteOne method is not implemented in safeTransactionsDataProvider');
  },

  getApiUrl: () => {
    throw new Error('getApiUrl method is not implemented in safeTransactionsDataProvider');
  },
};
