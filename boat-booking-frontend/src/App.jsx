import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingForm from "./pages/user/BookingForm";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { useAuth } from "./components/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import ManageSchedules from "./pages/admin/ManageSchedules";
import ManageBoats from "./pages/admin/ManageBoats";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageCreateSchedules from "./pages/admin/ManageCreateSchedules";
import ManageTicketTypes from "./pages/admin/ManageTicketTypes";
import ManageScheduleForm from "./pages/admin/ManageScheduleForm";
import ManageScheduleList from "./pages/admin/ManageScheduleList";
import ManageScheduleCalendar from "./pages/admin/ManageScheduleCalendar";
import ManageSchedulePriceList from "./pages/admin/ManageSchedulePriceList";

import UserDashboard from "./pages/user/UserDashboard"; 
import BookingCart from "./pages/user/BookingCart";
import BookingConfirm from "./pages/user/BookingConfirm";
import BookingPayment from "./pages/user/BookingPayment";
import BookingCalendarUser from "./pages/user/BookingCalendarUser";
import MyBookingList from "./pages/user/MyBookingList";
import MyProfile from "./pages/user/MyProfile";




function App() {
  const { role, logout } = useAuth();
  const isLoggedIn = role === "admin" || role === "user";

  return (
    <Router>

        {/* ✅ Top Navbar */}
        <nav className="space-x-4 mb-4">

          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-blue-600">Login</Link>
              <Link to="/register" className="text-blue-600">Register</Link>
            </>
          )}

          {role === "user" && <Link to="/" className="text-blue-600">Dashboard</Link>} 
          {role === "user" && <Link to="/book" className="text-blue-600">Booking Calendar</Link>}

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
          <Route path="/" element={<UserRoute><UserDashboard /></UserRoute>} /> {/* ✅ added */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<BookingCalendarUser />} />
          <Route path="/bookinglist" element={<MyBookingList/>}/>
          <Route path="/profile" element={<MyProfile/>}/>
          <Route path="/cart" element={<BookingCart />} />
          <Route path="/confirm" element={<BookingConfirm />} />
          <Route path="/payment/:bookingId" element={<BookingPayment />} />

          {/* ✅ Admin Routes with Layout */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} /> {/* default admin page */}
            <Route path="boats" element={<ManageBoats />} />
            <Route path="bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
            <Route path="scheduleform" element={<ManageScheduleForm />} />
            <Route path="ticket-types" element={<AdminRoute><ManageTicketTypes /></AdminRoute>} />
            <Route path="schedule" element={<AdminRoute><ManageSchedules /></AdminRoute>} />
            <Route path="schedulelist" element={<AdminRoute><ManageScheduleList /></AdminRoute>} />
            <Route path="createschedule" element={<AdminRoute><ManageCreateSchedules /></AdminRoute>} />
            <Route path="schedulecalendar" element={<AdminRoute><ManageScheduleCalendar /></AdminRoute>} />
            <Route path="schedule/:scheduleId" element={<AdminRoute><ManageSchedulePriceList/></AdminRoute>} />
          </Route>
        </Routes>

    </Router>
  );
}

export default App;