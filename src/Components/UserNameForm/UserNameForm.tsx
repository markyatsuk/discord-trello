import { useRef } from 'react';
import { useSocket } from '../../context/socket.context';

const UserNameForm: React.FC = () => {
  const { setUserName } = useSocket();
  const userNameRef = useRef<HTMLInputElement>(null);

  const handleSetUserName = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const value = userNameRef.current?.value;

    if (!value) return;

    setUserName(value);
    localStorage.setItem('userName', value);
    userNameRef.current.value = '';
  };

  return (
    <div>
      <form onSubmit={handleSetUserName}>
        <input autoComplete='off' placeholder='user name' ref={userNameRef} />
        <button type='button' onClick={handleSetUserName}>
          Next
        </button>
      </form>
    </div>
  );
};

export default UserNameForm;
