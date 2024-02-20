import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import App from './App';
import './index.css';

// import generated route tree
import { routeTree } from './routeTree.gen';

// create router instance
const router = createRouter({ routeTree });

// register router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// render app
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
      <RouterProvider router={router} />
    </StrictMode>
  );
}

