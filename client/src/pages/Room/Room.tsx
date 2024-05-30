import { useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { RoomContext } from '../../context/socket.context';
import Header from '../../Components/Header/Header';
import { VideoPlayer } from '../../Components/VideoPlayer/VideoPlayer';
import { ShareScreenButton } from '../../Components/ShareScreenButton/ShareScreenButton';
import { ChatButton } from '../../Components/ChatButton/ChatButton';
import { Chat } from '../../Components/Chat/Chat';
import { PeerState } from '../../reducers/peerReducer';

interface CallObject {
  peer: string;
  answer: (stream: MediaStream) => void;
  on: (event: 'stream' | 'error', callback: (stream: MediaStream) => void | ((err: Error) => void)) => void;
}

function Room() {
  const { id } = useParams<{ id: string }>();
  const { ws, me, stream, shareScreen, screenSharingId, setRoomId, userName, peers } = useContext(RoomContext);
  const [showChat, setShowChat] = useState(false);
  const peersRef = useRef<Record<string, { stream?: MediaStream; userName?: string }>>({});

  // useEffect(() => {
  //   console.log('Room ID from useParams:', id);
  //   if (me && me._id && userName) {
  //     console.log('Emitting join-room event');
  //     ws.emit('join-room', { roomId: id, peerId: me._id, userName });
  //   }
  // }, [id, me, ws, userName]);

  // useEffect(() => {
  //   console.log('Setting roomId in context:', id);
  //   setRoomId(id);
  // }, [id, setRoomId]);

  useEffect(() => {
    if (me && me.id && stream)
        ws.emit('join-room', { roomId: id, peerId: me.id, userName });
}, [id, me, stream, userName]);

useEffect(() => {
    setRoomId(id || '');
}, [id, setRoomId]);


  const handleUserJoined = (peerId: string, userName: string, stream?: MediaStream) => {
    console.log('User joined with peerId:', peerId, 'and userName:', userName);
    peersRef.current = { ...peersRef.current, [peerId]: { stream, userName } };
    if(me){
      const call = me.call(peerId, stream);
      console.log('Initiating call to peerId:', peerId);
      if(call){
        call.on('stream', (peerStream: MediaStream) => {
          console.log('Received peer stream:', peerStream);
          peersRef.current = { ...peersRef.current, [peerId]: { stream: peerStream, userName } };
        });
        call.on('error', (err: Error) => {
          console.error('Error in call:', err);
        });
      }
    }
    
   
    

    
  };

  const handleIncomingCall = (call: CallObject) => {
    console.log('Received call from peerId:', call.peer);
    call.answer(stream);

    call.on('stream', (peerStream: MediaStream) => {
      console.log('Received peer stream from call:', peerStream);
      peersRef.current = { ...peersRef.current, [call.peer]: { stream: peerStream } };
    });

    call.on('error', (err) => {
      console.error('Error in call:', err);
    });
  };

  useEffect(() => {
    if (!me || !me.id) {
      console.log('Peer is not initialized yet');
      // return;
    }

    if (!stream) {
      console.log('Stream is not initialized yet');
      // return;
    }

    console.log('Setting up PeerJS event listeners with PeerJS ID:', me?.id);
    console.log('Using MediaStream:', stream);

    ws.on('user-joined', ({ peerId, userName }: { peerId: string; userName: string }) =>
      handleUserJoined(peerId, userName)
    );
    me?.on('call', handleIncomingCall);

    return () => {
      ws.off('user-joined', handleUserJoined);
      me?.off('call', handleIncomingCall);
    };
  }, [me, stream, ws]);

  const screenSharingVideo = screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;
  const { [screenSharingId]: sharing, ...peersToShow } = peers;
  return (
    <>
      <Header />
      <div>
        <p>Room id {id}</p>
        {screenSharingVideo && <VideoPlayer stream={screenSharingVideo} />}
        {screenSharingId !== me?.id && stream && <VideoPlayer stream={stream} />}
        {stream && Object.values(peersToShow as PeerState).filter((peer) => !!peer.stream).map(
          (peer) =>(
            <div key={peer.peerId}>
                <VideoPlayer stream={peer.stream} />
                <div>{peer.userName}</div>
            </div>
        )
        )}
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={() => setShowChat(!showChat)} />
        <Chat />
      </div>
    </>
  );
}

export default Room;