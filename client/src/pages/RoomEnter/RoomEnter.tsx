import Container from '../../Components/Container/Container';
import UserNameForm from '../../Components/UserNameForm/UserNameForm';
import Header from '../../Components/Header/Header';
import { useSocket } from '../../context/socket.context';
import s from './Room.module.css';


function RoomEnter() {
  const { userName } = useSocket();

  return (
    <>
    <Header></Header>
    <div className={s.createRoomLobby}>
      <Container>
        {/* {!userName && <UserNameForm />}
        {userName && <Chat />} */}
        <UserNameForm />
        {/* <Chat /> */}
      </Container>
    </div>
    </>
  );
}

export default RoomEnter;
