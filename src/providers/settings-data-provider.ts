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

  update: async <TData = SettingsEntity, TVariables = { wrapTokensServiceStatus: ServiceStatus }>({
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const typedVars = variables as { wrapTokensServiceStatus: ServiceStatus };

    await SettingsService.updateSettings({
      wrapTokensServiceStatus: typedVars.wrapTokensServiceStatus,
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
