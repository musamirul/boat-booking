import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import BookingForm from './components/BookingForm';
import BoatForm from './components/BoatForm';
import BookingList from './components/BookingList';
import ScheduleForm from './components/ScheduleForm';
import SchedulePriceList from './components/SchedulePriceList';
import './App.css'

function App() {
  
  return (
    <Router>
      <div className="p-4">
        <nav className="space-x-4 mb-4">
          <Link to="/" className="text-blue-600">Booking</Link>
          <Link to="/boats" className="text-blue-600">Boats</Link>
          <Link to="/list" className="text-blue-600">Booking List</Link>
          <Link to="/CreateSchedule" className="text-blue-600">Create Schedule</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BookingForm />} />
          <Route path="/boats" element={<BoatForm />} />
          <Route path="/list" element={<BookingList />}/>
          <Route path="/CreateSchedule" element={<ScheduleForm />}/>
          <Route path="/schedule/:scheduleId" element={<SchedulePriceList />} /> {/* 👈 New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App
