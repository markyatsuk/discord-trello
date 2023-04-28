import Container from '../../Components/Container/Container';
import CreateRoom from '../../Components/CreateRoom/CreateRoom';
import UserNameForm from '../../Components/UserNameForm/UserNameForm';
import { useSocket } from '../../context/socket.context';

function Room() {
  const { userName } = useSocket();

  return (
    <div>
      <Container>
        {!userName && <UserNameForm />}
        {userName && <CreateRoom />}
      </Container>
    </div>
  );
}

export default Room;
