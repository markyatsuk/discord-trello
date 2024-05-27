import { useRef } from 'react';

import { useSocket } from '../../context/socket.context';
import EVENTS from '../../utils/events';
import Container from '../Container/Container';
import Messages from '../Messages/Messages';

import s from './CreateRoom.module.css';
import { useParams } from 'react-router-dom';

function CreateRoom() {
  const { rooms, socket, roomId } = useSocket();
  const {id} = useParams();
  const roomNameRef = useRef<HTMLInputElement>(null);

  const handleCreateRoom = () => {
    const roomName = roomNameRef.current?.value;

    if (!String(roomName).trim()) return;

    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    if (roomNameRef.current) {
      roomNameRef.current.value = '';
    }
  };

  const handleJoinRoom = (id: string) => {
    if (id === roomId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, id);
  };
  console.log(rooms);
  return (
    <div>
      <Container>
        <div className={s.lobby}>
        {/* <form>
          <input autoComplete='off' placeholder='room name' ref={roomNameRef}  className={s.inputName}/>
          <button type='button' onClick={handleCreateRoom} className={s.createRoomBtn}>
            Create room
          </button>
        </form> */}
        {rooms &&
          Object.keys(rooms).map((key) => {
            return (
              <div key={key}>
                <button disabled={key === roomId} onClick={() => handleJoinRoom(key)}>
                  Join {rooms[key].name}
                </button>
                {rooms[key].name}
              </div>
            );
          })}
          <p>Room id {id}</p>
         <Messages /> 
        </div>
      </Container>
    </div>
  );
}

export default CreateRoom;
