import { createContext, useContext, ReactNode, useState, useEffect, useReducer } from 'react';
import * as SocketClient  from 'socket.io-client';
import EVENTS from '../utils/events';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import {v4 as uuidV4} from 'uuid';
import { PeerState, peersReducer } from '../reducers/peerReducer';
import { addPeerStreamAction, addPeerNameAction, removePeerAction } from '../reducers/peerActions';
import moment from 'moment';
import { chatReducer } from '../reducers/chatReducer';
import { addHistoryAction, addMessageAction } from '../reducers/chatActions';


interface IRoomValue {
  stream?: MediaStream,
  screenStream?: MediaStream;
  peers: PeerState;
  shareScreen: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  screenSharingId: string;
}

interface RoomProviderProps {
  children: ReactNode;
}

type TChildren = {
  children: ReactNode;
};

interface IContext {
  socket?: SocketClient.Socket;
  userName?: string;
  setUserName: (value: React.SetStateAction<string>) => void;
  roomId?: string;
  rooms?: any;
  messages?: IMessage[];
  setMessages?: (value: React.SetStateAction<IMessage[]>) => void;
}

export interface IMessage {
  userName?: string;
  message?: string;
  value?: string;
  time?: string;
  emoji?: string;
  author?: string;
}


const HOST_BACKEND = 'http://localhost:3000';
const WS = 'http://localhost:8080';

const socket = SocketClient.io(HOST_BACKEND);

export const RoomContext = createContext<null | any>(null);
const ws = SocketClient.io(WS);

export const RoomProvider: React.FC<RoomProviderProps> = ({ children } : TChildren) => {
  const navigate = useNavigate();

  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [screenStream, setScreenStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {})
  const [screenSharingId, setScreenSharingId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [rooms, setRooms] = useState();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: []
  })

  useEffect(() => {
    window.onfocus = function () {
      document.title = 'Chat app';
    };
  }, []);

  const enterRoom = ({roomId}: {roomId: 'string'}) => {
    console.log({roomId})
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({participants} : {participants: string[]}) => {
    console.log({participants})
  }

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  }

  const shareScreen = () => {
    if(screenSharingId){
      try{
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(switchStream);
      }catch(error){
        console.error('Error accessing media devices.', error);      
      }
    }else{
      try{
        navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
          switchStream(stream);
          setScreenStream(stream);
        });
      }catch(error){
        console.error('Error accessing media devices.', error);      
      }
      
    }
    
  }

  const switchStream = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(me?.id || '' );
    Object.values(me?.connections || {}).forEach((connection) => {
      const videoTrack = stream.getTracks().find(track => track.kind === 'video');
      connection[0].peeerConnection.getSenders()?.find((sender: any) => sender.track.kind === 'video').replaceTrack(videoTrack).catch((error: any) => console.error(error))
    })
  }

  const sendMessage = (message: string) => {
    const messageData: IMessage = { 
      userName,
      message, 
      time: moment().calendar(),
      author: me?.id,
    }
    chatDispatch(addMessageAction(messageData));

    ws.emit('send-message', roomId, messageData)
  }

  const addMessage = (message : IMessage) => {
    chatDispatch(addMessageAction(message));
    console.log('message:',message)
  }

  const addHistory = (messages : IMessage[]) => {
    chatDispatch(addHistoryAction(messages));
  }

  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  useEffect(() => {
    const initializePeer = async () => {
        const savedId = localStorage.getItem('userId');
        const meId = savedId || uuidV4();
        localStorage.setItem('userId', meId);

        // Инициализация Peer
        const newPeer = new Peer(meId, {
            host: 'localhost',
            port: 9001,
            path: '/'
        });

        newPeer.on('open', (id) => {
            console.log('PeerJS ID:', id);
            setMe(newPeer);
        });

        newPeer.on('error', (err) => {
            console.error('PeerJS error:', err);
        });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(stream);
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    initializePeer();

    // WebSocket event handlers
    ws.on('room-created', enterRoom);
    ws.on('get-users', getUsers);
    ws.on('user-disconnected', removePeer);
    ws.on('user-started-sharing', (peerId) => setScreenSharingId(peerId));
    ws.on('user-stopped-sharing', (peerId) => setScreenSharingId(peerId));
    ws.on('add-message', addMessage);
    ws.on('get-messages', addHistory);

    // Cleanup function
    return () => {
        ws.off('room-created', enterRoom);
        ws.off('get-users', getUsers);
        ws.off('user-disconnected', removePeer);
        ws.off('user-started-sharing');
        ws.off('user-stopped-sharing');
        ws.off('add-message', addMessage);
        ws.off('get-messages', addHistory);
        
        if (me) {
            me.destroy(); // Очистка PeerJS ресурса
        }
    };
}, [me]);

  useEffect(() => {
    if (screenSharingId){
      ws.emit('start-sharing', {peerId: screenSharingId, roomId})
    }
    else{
      ws.emit('stop-sharing')
    }
   
  }, [screenSharingId, roomId])

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
  
    console.log('PeerJS ID:', me);
    console.log('MediaStream:', stream);
  
    const handleUserJoined = ({ peerId, userName: name }: { peerId: string, userName: string }) => {
      console.log('User joined with peerId:', peerId, 'and userName:', userName);
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        }
      });
  
      if (!call) {
        console.error('Failed to initiate call to peerId:', peerId);
        return;
      }
  
      console.log('Initiating call to peerId:', peerId);
      call.on('stream', (peerStream) => {
        console.log('Received peer stream:', peerStream);
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      call.on('error', (err) => {
        console.error('Error in call:', err);
      });
      dispatch(addPeerNameAction(peerId, name));
    };
  
    ws.on('user-joined', handleUserJoined);
    me.on('call', (call) => {
      console.log('Received call from peerId:', call.peer);
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on('stream', (peerStream) => {
        console.log('Received peer stream from call:', peerStream);
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
      call.on('error', (err) => {
        console.error('Error in call:', err);
      });
    });
  
    return () => {
      ws.off('user-joined', handleUserJoined);
    };
  }, [me, stream, userName]);

  useEffect(() => {
    console.log({ peers });
  }, [peers]);

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers, shareScreen, screenStream, screenSharingId, sendMessage, chat, setRoomId, userName, setUserName, roomId, rooms, messages, setMessages }}>
      {children}
    </RoomContext.Provider>
  );
};

const SocketContext = createContext<IContext>({
  socket,
  userName: '',
  setUserName: () => false,
  roomId: '',
  rooms: {},
  messages: [],
  setMessages: () => false,
});

const SocketProvider = () => {
  

  // return (
  //   <SocketContext.Provider
  //     value={{ socket, userName, setUserName, roomId, rooms, messages, setMessages }}
  //     {...children}
  //   />
  // );
};

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;
