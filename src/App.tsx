import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { Location } from './pages/Location';
import { Reservation } from './pages/Reservation';
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
          <Route path="reservation" element={<Reservation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
