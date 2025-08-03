import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSchedules, deleteSchedule } from "../../api/schedules";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await getSchedules();
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Error loading schedules:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this schedule?")) {
      await deleteSchedule(id);
      fetchSchedules();
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-3">Schedules</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Boat</th>
            <th className="p-2 border">Departure</th>
            <th className="p-2 border">Available Seats</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.schedule_id} className="hover:bg-gray-50">
              <td className="p-2 border">{s.boat_name}</td>
              <td className="p-2 border">{s.departure_time}</td>
              <td className="p-2 border">{s.available_seats}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => navigate(`/admin/schedule/${s.schedule_id}`)}
                >
                  Manage Prices
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(s.schedule_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}