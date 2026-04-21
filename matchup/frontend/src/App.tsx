import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Fixture from './pages/Fixture';
import Matchup from './pages/Matchup';
import Settlement from './pages/Settlement';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fixture/:id" element={<Fixture />} />
        <Route path="/matchup/:sessionId" element={<Matchup />} />
        <Route path="/settlement/:sessionId" element={<Settlement />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;