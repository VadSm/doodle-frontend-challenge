import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ChatPage } from '@/pages/chat';

import { store } from './providers/store';
import './styles/index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <ChatPage />
      <ToastContainer
        closeOnClick
        newestOnTop
        pauseOnFocusLoss={false}
        position="top-right"
      />
    </Provider>
  </StrictMode>,
);
