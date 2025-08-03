
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Chart Data
  const bookingData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 7, 15, 22, 10, 5],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Weekly Bookings" },
    },
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} flex h-screen`}>
      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col">

        {/* ✅ Dashboard Content */}
        <main className="p-6 space-y-6 overflow-y-auto">
          {/* ✅ Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow hover:shadow-lg">
              <h3>Total Boats</h3>
              <p className="text-2xl font-bold text-blue-700">12</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow hover:shadow-lg">
              <h3>Bookings Today</h3>
              <p className="text-2xl font-bold text-green-600">34</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow hover:shadow-lg">
              <h3>Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">RM 4,200</p>
            </div>
          </div>

          {/* ✅ Chart Section */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-xl shadow`}>
            <h2 className="text-lg font-semibold mb-3">Bookings Overview</h2>
            <Bar data={bookingData} options={chartOptions} />
          </div>

          {/* ✅ CRUD Table Example */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-xl shadow`}>
            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-semibold">Boats Management</h2>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">+ Add Boat</button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 border-b">Boat Name</th>
                  <th className="p-2 border-b">Capacity</th>
                  <th className="p-2 border-b">Status</th>
                  <th className="p-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2 border-b">Sea Breeze</td>
                  <td className="p-2 border-b">20</td>
                  <td className="p-2 border-b text-green-600">Active</td>
                  <td className="p-2 border-b">
                    <button className="text-blue-600 mr-2">Edit</button>
                    <button className="text-red-600">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}