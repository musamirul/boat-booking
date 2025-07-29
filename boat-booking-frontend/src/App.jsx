import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import BoatForm from "./components/BoatForm";
import BookingList from "./components/BookingList";
import ScheduleForm from "./components/ScheduleForm";
import SchedulePriceList from "./components/SchedulePriceList";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { useAuth } from "./components/AuthContext";
import BoatPage from "./components/BoatPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import SchedulePage from "./components/SchedulePage";
import TicketTypesPage from "./components/TicketTypesPage";
import SchedulesPage from "./components/SchedulePage";
import ScheduleList from "./components/ScheduleList";
import BookingCalendar from "./components/BookingCalendar";

function App() {
  const { role, logout } = useAuth();
  const isLoggedIn = role === "admin" || role === "user";

  return (
    <Router>
      <div className="p-4">
        {/* ✅ Top Navbar */}
        <nav className="space-x-4 mb-4">
          <Link to="/" className="text-blue-600">Booking</Link>

          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-blue-600">Login</Link>
              <Link to="/register" className="text-blue-600">Register</Link>
            </>
          )}

          {role === "user" && <Link to="/" className="text-blue-600">My Bookings</Link>}

          {role === "admin" && (
            <>
              <Link to="/admin" className="text-blue-600">Dashboard</Link>
            </>
          )}

          {isLoggedIn && <button onClick={logout} className="text-red-600">Logout</button>}
        </nav>

        {/* ✅ Routes */}
        <Routes>
          {/* User Pages */}
          <Route path="/" element={<UserRoute><BookingForm /></UserRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Admin Routes with Layout */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} /> {/* default admin page */}
            <Route path="boats" element={<BoatPage />} />
            <Route path="bookings" element={<AdminRoute><BookingList /></AdminRoute>} />
            <Route path="scheduleform" element={<ScheduleForm />} />
            <Route path="ticket-types" element={<AdminRoute><TicketTypesPage /></AdminRoute>} />
            <Route path="schedule" element={<AdminRoute><SchedulesPage /></AdminRoute>} />
            <Route path="schedulelist" element={<AdminRoute><ScheduleList /></AdminRoute>} />
            <Route path="schedulecalendar" element={<AdminRoute><BookingCalendar /></AdminRoute>} />
            <Route path="schedule/:scheduleId" element={<AdminRoute><SchedulePriceList/></AdminRoute>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;