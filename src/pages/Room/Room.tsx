import Container from '../../Components/Container/Container';
import CreateRoom from '../../Components/CreateRoom/CreateRoom';
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
      <Container>
        {!userName && (
          <div>
            <form>
              <input autoComplete='off' placeholder='user name' ref={userNameRef} />
              <button type='button' onClick={handleSetUserName}>
                Next
              </button>
            </form>
          </div>
        )}
        {userName && <CreateRoom />}
      </Container>
    </div>
  );
}

export default Room;
