import { createContext, useContext, ReactNode, useState, useEffect, useReducer } from 'react';


import * as SocketClient  from 'socket.io-client';

import EVENTS from '../utils/events';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import {v4 as uuidV4} from 'uuid';
import { peersReducer } from './peerReducer';
import { addPeerAction, removePeerAction } from './peerActions';


const HOST_BACKEND = 'http://localhost:3000';
const WS = 'http://localhost:8080';

const socket = SocketClient.io(HOST_BACKEND);
export const RoomContext = createContext<null | any>(null);

const ws = SocketClient.io(WS);

export const RoomProvider: React.FC<RoomProviderProps> = ({ children } : TChildren) => {
  const navigate = useNavigate();

  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {})

  const enterRoom = ({roomId}: {roomId: 'string'}) => {
    console.log({roomId})
    navigate(`/chat/room/${roomId}`);
  };

  const getUsers = ({participants} : {participants: string[]}) => {
    console.log({participants})
  }

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  }

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);

    try{
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {setStream(stream)})
    }catch(error){
      console.log(error)
    }

    ws.on('room-created', enterRoom);
    ws.on('get-users', getUsers);
    ws.on('user-disconnected', removePeer)
  },[])

  useEffect(() => {
    if(!me) return;
    if(!stream) return;

    ws.on('user-joined', ({peerId}) => {
        const call = me.call(peerId, stream);
        call.on('stream', (peerStream) => {
          dispatch(addPeerAction(peerId, peerStream))
        })
      });
    me.on('call', (call) => {
      call.answer(stream)
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream))
      })
    })
    
  }, [me, stream])

  console.log({peers})

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

interface RoomProviderProps {
  children: ReactNode;
}

type TChildren = {
  children: ReactNode;
};

interface IContext {
  socket: SocketClient.Socket;
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
