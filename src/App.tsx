import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { Location } from './pages/Location';
import { Community } from './pages/Community';
import { Reservation } from './pages/Reservation';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="location" element={<Location />} />
          <Route path="community" element={<Community />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
