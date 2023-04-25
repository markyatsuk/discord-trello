import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

import io, { Socket } from 'socket.io-client';

import EVENTS from '../utils/events';

const HOST_BACKEND = 'http://localhost:3000';
const socket = io(HOST_BACKEND);

type TChildren = {
  children: ReactNode;
};

interface IContext {
  socket: Socket;
  userName?: string;
  setUserName: (value: React.SetStateAction<string>) => void;
  roomId?: string;
  rooms: any;
  messages: IMessage[];
  setMessages: (value: React.SetStateAction<IMessage[]>) => void;
}

interface IMessage {
  userName?: string;
  message?: string;
  value?: string;
  time: string;
  emoji?: string;
}

const SocketContext = createContext<IContext>({
  socket,
  userName: '',
  setUserName: () => false,
  roomId: '',
  rooms: {},
  messages: [],
  setMessages: () => false,
});

const SocketProvider = (children: TChildren) => {
  const [userName, setUserName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [rooms, setRooms] = useState();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    window.onfocus = function () {
      document.title = 'Chat app';
    };
  }, []);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (id) => {
    setRoomId(id);
    setMessages([]);
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, userName, time }) => {
    if (!document.hasFocus()) {
      document.title = 'New message...';
    }
    setMessages([
      ...messages,
      {
        message,
        userName,
        time,
      },
    ]);
  });

  return (
    <SocketContext.Provider
      value={{ socket, userName, setUserName, roomId, rooms, messages, setMessages }}
      {...children}
    />
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;
