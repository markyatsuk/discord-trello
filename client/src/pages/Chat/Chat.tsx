import { useParams } from 'react-router-dom';
import Messages from '../../Components/Messages/Messages';
import { useContext, useEffect } from 'react';
import { RoomContext } from '../../context/socket.context';
import Header from '../../Components/Header/Header';
import { VideoPlayer } from '../../Components/VideoPlayer/VideoPlayer';
import { PeerState } from '../../context/peerReducer';

function Chat() {
  const {id} = useParams();
  const {ws, me, stream, peers} = useContext(RoomContext)

  useEffect(() => {
    if(me) ws.emit('join-room', {roomId: id, peerId: me._id})
  },[id, me, ws])

  return (
    <>
      <Header></Header>
      <div>
        <p>Room id {id}</p>
        <div><VideoPlayer stream={stream}/></div>
        {Object.values(peers as PeerState).map(peer => (
          <VideoPlayer key={1} stream={peer.stream}/>
        ))}
        <Messages />
      </div>
    </>
  );
}

export default Chat;
