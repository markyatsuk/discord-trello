import { Routes, Route } from 'react-router-dom';
import Room from '../../pages/Room/Room';
import Chat from '../../pages/Chat/Chat';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Room />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
