import CreateRoom from '../../Components/CreateRoom/CreateRoom';
import Messages from '../../Components/Messages/Messages';
import { useSocket } from '../../context/socket.context';
import { useRef } from 'react';

function Room() {
  const { userName, setUserName } = useSocket();
  const userNameRef = useRef<HTMLInputElement>(null);

  const handleSetUserName = () => {
    const value = userNameRef.current?.value;

    if (!value) return;

    setUserName(value);
    localStorage.setItem('userName', value);
    userNameRef.current.value = '';
  };

  return (
    <div>
      {!userName && (
        <div>
          <form>
            <input autoComplete='off' placeholder='user name' ref={userNameRef} />
            <button type='button' onClick={handleSetUserName}>
              Start
            </button>
          </form>
        </div>
      )}
      {userName && (
        <>
          <CreateRoom />
          <Messages />
        </>
      )}
    </div>
  );
}

export default Room;
