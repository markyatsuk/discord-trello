import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App';
import SocketProvider from './context/socket.context';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketProvider>
      <BrowserRouter basename='discord-trello'>
    <App />
    </BrowserRouter>
    </SocketProvider>
  </React.StrictMode>
);

