import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App';
import SocketProvider, { RoomProvider } from './context/socket.context';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename='discord-trello'>
      <RoomProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </RoomProvider>
    </BrowserRouter>
  </React.StrictMode>
);

