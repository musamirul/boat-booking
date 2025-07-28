import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ detect current route

  const menuItems = [
    { key: "dashboard", label: "Dashboard", path: "/admin" },
    { key: "boats", label: "Boats", path: "/admin/boats" },
    { key: "bookings", label: "Bookings", path: "/admin/bookings" },
    { key: "scheduleform", label: "Schedules Form", path: "/admin/scheduleform" },
    { key: "schedule", label: "Schedules", path: "/admin/schedule" },
    { key: "schedulelist", label: "Schedules List", path: "/admin/schedulelist" },
    { key: "ticketTypes", label: "Ticket Types", path: "/admin/ticket-types" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col shadow-lg">
        <div className="p-4 text-2xl font-bold border-b border-blue-600">
          🛥️ Boat Admin
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path); // ✅ auto highlight
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`block w-full text-left p-2 rounded transition-all ${
                  isActive ? "bg-blue-500 font-semibold" : "hover:bg-blue-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="p-4 bg-red-500 hover:bg-red-600 transition-all"
        >
          🚪 Logout
        </button>
      </aside>

      {/* ✅ Right Content */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Shared Admin Header */}
        <AdminHeader darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}