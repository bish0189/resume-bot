import { SquidContextProvider } from '@squidcloud/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SquidContextProvider
    options={{
      appId: '112xk1upr3cvj6iwa4',
      region: 'us-east-1.aws',
      environmentId: 'dev', 
      squidDeveloperId: 'esr2mttr8junu4s0af',
    }}
  >
    <App />
  </SquidContextProvider>
);