import {
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListResponse,
  UpdateParams,
  UpdateResponse,
} from '@refinedev/core';
import {
  CreateEthereumNodeReqDTO,
  EthereumNodeEntity,
  EthereumNodesService,
  UpdateEthereumNodeReqDTO,
} from '@tari-project/wxtm-bridge-backend-api';

/**
 * Read/write data provider for the bridge backend's `/ethereum-nodes` endpoint.
 *
 * Unlike the wrap/unwrap resources, this endpoint is a plain Nest controller that
 * returns a bare array (no nestjsx-crud pagination envelope), so it can't go through
 * `customNestjsxCrudDataProvider`. We wrap the generated `EthereumNodesService`
 * directly — same approach as `settingsDataProvider`. Auth is carried by the global
 * `OpenAPI.TOKEN` set in `useAuthProvider`.
 */
export const ethereumNodesDataProvider: DataProvider = {
  getList: async <TData = EthereumNodeEntity>(): Promise<GetListResponse<TData>> => {
    const nodes = await EthereumNodesService.getNodes();
    return {
      data: nodes as TData[],
      total: nodes.length,
    };
  },

  create: async <TData = EthereumNodeEntity, TVariables = CreateEthereumNodeReqDTO>({
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const node = await EthereumNodesService.createNode(variables as CreateEthereumNodeReqDTO);
    return { data: node as TData };
  },

  update: async <TData = EthereumNodeEntity, TVariables = UpdateEthereumNodeReqDTO>({
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    await EthereumNodesService.updateNode(Number(id), variables as UpdateEthereumNodeReqDTO);
    return { data: { id } as TData };
  },

  deleteOne: async <TData = EthereumNodeEntity, TVariables = unknown>({
    id,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    await EthereumNodesService.deleteNode(Number(id));
    return { data: { id } as TData };
  },

  getOne: async () => {
    throw new Error('getOne is not implemented in ethereumNodesDataProvider');
  },

  getApiUrl: () => {
    throw new Error('getApiUrl is not implemented in ethereumNodesDataProvider');
  },
};
