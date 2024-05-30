import { Routes, Route } from 'react-router-dom';

import Room from '../../pages/Room/Room';
// import Chat from '../../pages/Room/Room';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
import Auth from '../../pages/Auth/Auth';
import RoomEnter from '../../pages/RoomEnter/RoomEnter';



function App() {
  
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <Header />
              <Hero />
            </>
          }
        />
        <Route path='/login' element={<Auth />} />
        <Route path='/signup' element={<Auth />} />
        <Route path='/room' element={<RoomEnter />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
