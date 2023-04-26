import { Routes, Route } from 'react-router-dom';
import Room from '../../pages/Room/Room';
import Chat from '../../pages/Chat/Chat';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
function App() {
  return (
    <div>
      <Header />
      <Hero/>
      <Routes>
        <Route path='/' element={<Room />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
