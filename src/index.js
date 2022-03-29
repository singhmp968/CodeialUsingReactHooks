import React from 'react';
import ReactDOM from 'react-dom';
import { ToastProvider } from 'react-toast-notifications';

import './styles/index.css';
import { App } from './components';
import { AuthProvider } from './providers/AuthProvider';
import { PostsProvider } from './providers/PostProvider';
// import { PostProvider } from './providers/PostProvider';

ReactDOM.render(
  <React.StrictMode>
    <ToastProvider autoDismiss autoDismissTimeout={5000} placement="top-left">
      <AuthProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
