import { Routes, Route } from 'react-router-dom';
import Room from '../../pages/Room/Room';
import Chat from '../../pages/Chat/Chat';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
import Auth from '../../pages/Auth/Auth';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<><Header /><Hero/><Room /></>} />
        <Route path='/login' element={<Auth/>} />
        <Route path='/signup' element={<Auth/>} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
