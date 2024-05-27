import { useContext, useRef } from 'react';
import { RoomContext, useSocket } from '../../context/socket.context';
import s from './UserNameForm.module.css';
import { NavLink } from 'react-router-dom';


const UserNameForm: React.FC = () => {
  
  const { setUserName } = useSocket();
  const userNameRef = useRef<HTMLInputElement>(null);
  const {ws} = useContext(RoomContext);
  
  const createRoom = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    
    const value = userNameRef.current?.value;

    if (!value) return;
    ws.emit('create-room');
    setUserName(value);
    console.log(value)
    localStorage.setItem('userName', value);
    userNameRef.current.value = '';
  };

  return (
    <div className={s.lobby}>
      <form onSubmit={createRoom}>
        <input autoComplete='off' placeholder='user name' ref={userNameRef} className={s.inputName}/>
        <NavLink to={'/'}><button type='button' onClick={createRoom} className={s.createRoomBtn}>
          Next
        </button></NavLink>
      </form>
    </div>
  );
};

export default UserNameForm;
