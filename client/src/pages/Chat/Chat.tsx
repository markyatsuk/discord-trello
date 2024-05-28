import { useParams } from 'react-router-dom';
import Messages from '../../Components/Messages/Messages';
import { useContext, useEffect } from 'react';
import { RoomContext } from '../../context/socket.context';
import Header from '../../Components/Header/Header';
import { VideoPlayer } from '../../Components/VideoPlayer/VideoPlayer';
import { PeerState } from '../../context/peerReducer';
import { ShareScreenButton } from '../../Components/ShareScreenButton/ShareScreenButton';
function Chat() {
  const {id} = useParams();
  const {ws, me, stream, peers, shareScreen, screenSharingId, setRoomId} = useContext(RoomContext)

  useEffect(() => {
    if(me) ws.emit('join-room', {roomId: id, peerId: me._id})
  },[id, me, ws])

  useEffect(()=> {
    setRoomId(id);
  },[id, setRoomId])

  console.log(peers as PeerState);
  console.log(screenSharingId);

  const screenSharingVideo = screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;
  const {[screenSharingId]: sharing, ...peersToShow} = peers;
  return (
    <>
      <Header></Header>
      <div>
        <p>Room id {id}</p>
        {screenSharingVideo && <div><VideoPlayer stream={screenSharingVideo}/></div>}
        {screenSharingId !== me?.id  && <VideoPlayer stream={stream}/> }
        {Object.values(peersToShow as PeerState).map(peer => (
          <VideoPlayer key={peer.stream.id} stream={peer.stream}/>
        ))}
        <ShareScreenButton onClick={shareScreen}/>
        <Messages />
      </div>
    </>
  );
}

export default Chat;
