import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './config';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
