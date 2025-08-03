import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingForm from "./components/Admin/BookingForm";
import BoatForm from "./components/Admin/BoatForm";
import BookingList from "./components/Admin/BookingList";
import ScheduleForm from "./components/Admin/ScheduleForm";
import SchedulePriceList from "./components/Admin/SchedulePriceList";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { useAuth } from "./components/AuthContext";
import BoatPage from "./components/Admin/BoatPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import SchedulePage from "./components/Admin/SchedulePage";
import TicketTypesPage from "./components/Admin/TicketTypesPage";
import SchedulesPage from "./components/Admin/SchedulePage";
import ScheduleList from "./components/Admin/ScheduleList";
import BookingCalendar from "./components/Admin/BookingCalendar";
import UserDashboard from "./components/User/UserDashboard"; 

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

          {role === "user" && <Link to="/user-dashboard" className="text-blue-600">Dashboard</Link>} {/* ✅ added */}
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
          <Route path="/user-dashboard" element={<UserRoute><UserDashboard /></UserRoute>} /> {/* ✅ added */}
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