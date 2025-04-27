import './App.css';
import Header from './components/Header';
import LeftBar from './components/LeftBar';
import VideoWallMenu from './components/VideoWallMenu';
import VideoWall from './pages/VideoWall';
import Mapa from './pages/Mapa';
import Registros from './pages/Registros';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <LeftBar />
      <div>
        <Routes>
          <Route path="/" element={<VideoWall />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path='/registros' element={<Registros />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
