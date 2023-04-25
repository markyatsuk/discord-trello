import { useRef } from 'react';

import { useSocket } from '../../context/socket.context';
import EVENTS from '../../utils/events';

function CreateRoom() {
  const { rooms, socket, roomId } = useSocket();

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

  return (
    <div>
      <form>
        <input autoComplete='off' placeholder='room name' ref={roomNameRef} />
        <button type='button' onClick={handleCreateRoom}>
          Create room
        </button>
      </form>
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
    </div>
  );
}

export default CreateRoom;
