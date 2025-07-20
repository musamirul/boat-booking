import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import BookingForm from './components/BookingForm';
import BoatForm from './components/BoatForm';
import './App.css'


function App() {
  
  return (
    <Router>
      <div className="p-4">
        <nav className="space-x-4 mb-4">
          <Link to="/" className="text-blue-600">Booking</Link>
          <Link to="/boats" className="text-blue-600">Boats</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BookingForm />} />
          <Route path="/boats" element={<BoatForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
