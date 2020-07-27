import React from 'react';
import Routes from './routes';

import './App.css';
import { ToastProvider } from './hooks/toast';

const App = () => {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  )
}

export default App;
