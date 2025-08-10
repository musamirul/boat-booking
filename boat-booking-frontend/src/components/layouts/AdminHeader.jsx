import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useLocation } from "react-router-dom";

export default function AdminHeader({ darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth(); // get admin user info
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // ✅ Define titles based on route
  const pageTitles = {
    "/admin": "Admin Dashboard",
    "/admin/boats": "Manage Boats",
    "/admin/bookings": "Booking List",
    "/admin/schedule": "Create Schedule",
    "/admin/createschedule": "Create Schedule",
    "/admin/ticket-types": "Create Ticket",
  };

  const currentTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header
      className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow p-4 flex justify-between items-center sticky top-0 z-50`}
    >
      {/* ✅ Dynamic Title */}
      <h1 className="text-xl font-bold">{currentTitle}</h1>

      {/* ✅ Right Side */}
      <div className="flex items-center gap-4 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded border"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* ✅ Username with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            {user?.name || "Admin"}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}