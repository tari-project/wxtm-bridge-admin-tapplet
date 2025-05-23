import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/mui';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import nestjsxCrudDataProvider from '@refinedev/nestjsx-crud';
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import axios from 'axios';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';

import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';

import { Header } from './components/header';
import { ColorModeContextProvider } from './contexts/color-mode';
import { Login } from './pages/login';
import { API_URL } from './config';
import { useAuthProvider } from './hooks/use-auth-provider';
import { WalletProvider } from './components/wallet-provider';
import { safeTransactionsDataProvider } from './providers/safe-transactions-data-provider';
import { SafeTransactionsList } from './pages/safe-transactions';
import { SafeTransactionsShow } from './pages/safe-transactions/show';
import { WrapTokenTransactionsList } from './pages/wrap-token-transactions';
import { WrapTokenTransactionsEdit } from './pages/wrap-token-transactions/edit';
import { TokensUnwrappedList } from './pages/tokens-unwrapped';
import { TokensUnwrappedEdit } from './pages/tokens-unwrapped/edit';

function App() {
  const dataProvider = nestjsxCrudDataProvider(API_URL, axios);
  const { isLoading, authProvider } = useAuthProvider({ axios });

  if (isLoading) {
    return <span>loading...</span>;
  }

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <WalletProvider>
                <Refine
                  dataProvider={{ default: dataProvider, safeTransactionsDataProvider }}
                  notificationProvider={useNotificationProvider}
                  routerProvider={routerBindings}
                  authProvider={authProvider}
                  resources={[
                    {
                      name: 'wrap-token-transactions',
                      list: '/wrap-token-transactions',
                      edit: '/wrap-token-transactions/edit/:id',
                      icon: <RotateRightIcon />,
                      meta: {
                        label: 'Wrapp token',
                      },
                    },
                    {
                      name: 'tokens-unwrapped',
                      list: '/tokens-unwrapped',
                      edit: '/tokens-unwrapped/edit/:id',
                      icon: <RotateLeftIcon />,
                      meta: {
                        label: 'Unwrapp token',
                      },
                    },
                    {
                      name: 'safe transaction',
                      list: '/safe-transactions',
                      show: '/safe-transactions/show/:id',
                      icon: <LockIcon />,
                      meta: { dataProviderName: 'safeTransactionsDataProvider' },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    title: {
                      icon: <DashboardIcon />,
                      text: 'WXTM Bridge',
                    },
                  }}
                >
                  <Routes>
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-inner"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemedLayoutV2 Header={Header}>
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route
                        index
                        element={<NavigateToResource resource="wrap-token-transactions" />}
                      />

                      <Route path="/wrap-token-transactions">
                        <Route index element={<WrapTokenTransactionsList />} />
                        <Route path="edit/:id" element={<WrapTokenTransactionsEdit />} />
                      </Route>

                      <Route path="/tokens-unwrapped">
                        <Route index element={<TokensUnwrappedList />} />
                        <Route path="edit/:id" element={<TokensUnwrappedEdit />} />
                      </Route>

                      <Route path="/safe-transactions">
                        <Route index element={<SafeTransactionsList />} />
                        <Route path="show/:id" element={<SafeTransactionsShow />} />
                      </Route>

                      <Route path="*" element={<ErrorComponent />} />
                    </Route>

                    <Route
                      element={
                        <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                          <NavigateToResource />
                        </Authenticated>
                      }
                    >
                      <Route path="/login" element={<Login />} />
                    </Route>
                  </Routes>

                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
              </WalletProvider>
              {/* <DevtoolsPanel /> */}
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
