import { useEffect, useState } from "react";
import {
  getAdminSchedules,
  createAdminSchedule,
  deleteAdminSchedule,
  getSchedulePrices,
  updateSchedulePrice,
} from "../../api/admin/schedulesAdmin";

export default function ManageCreateSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ boat_id: "", departure_time: "", available_seats: "" });
  const [prices, setPrices] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => { loadSchedules(); }, []);

  const loadSchedules = async () => {
    try {
      const res = await getAdminSchedules();
      setSchedules(res.data);
    } catch (err) {
      console.error("Failed to load schedules:", err);
    }
  };

  const saveSchedule = async () => {
    try {
      await createAdminSchedule(form);
      setForm({ boat_id: "", departure_time: "", available_seats: "" });
      loadSchedules();
    } catch (err) {
      console.error("Failed to save schedule:", err);
    }
  };

  const deleteScheduleHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    await deleteAdminSchedule(id);
    loadSchedules();
  };

  const openPrices = async (schedule_id) => {
    setSelectedSchedule(schedule_id);
    const res = await getSchedulePrices(schedule_id);
    setPrices(res.data);
  };

  const updatePriceHandler = async (id, newPrice) => {
    await updateSchedulePrice(id, newPrice);
    openPrices(selectedSchedule);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Schedules</h1>

      {/* Add Schedule */}
      <div className="mb-4">
        <input className="border p-2 mr-2" placeholder="Boat ID"
          value={form.boat_id} onChange={e => setForm({...form, boat_id: e.target.value})} />
        <input className="border p-2 mr-2" type="datetime-local"
          value={form.departure_time} onChange={e => setForm({...form, departure_time: e.target.value})} />
        <input className="border p-2 mr-2" placeholder="Seats"
          value={form.available_seats} onChange={e => setForm({...form, available_seats: e.target.value})} />
        <button className="bg-green-600 text-white px-3 py-1" onClick={saveSchedule}>Add Schedule</button>
      </div>

      {/* Schedules Table */}
      <table className="w-full border">
        <thead><tr><th>Boat</th><th>Departure</th><th>Seats</th><th>Prices</th><th>Action</th></tr></thead>
        <tbody>
          {schedules.map(s => (
            <tr key={s.schedule_id}>
              <td className="border p-2">{s.boat_name}</td>
              <td className="border p-2">{s.departure_time}</td>
              <td className="border p-2">{s.available_seats}</td>
              <td className="border p-2">
                <button className="bg-blue-600 text-white px-2" onClick={() => openPrices(s.schedule_id)}>💲 Edit</button>
              </td>
              <td className="border p-2">
                <button className="bg-red-500 text-white px-2" onClick={() => deleteScheduleHandler(s.schedule_id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Price Editing Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="font-bold mb-2">Edit Ticket Prices</h2>
            {prices.map(p => (
              <div key={p.schedule_price_id} className="flex justify-between mb-2">
                <span>{p.ticket_type_name}</span>
                <input className="border p-1 w-20" type="number" defaultValue={p.price}
                  onBlur={e => updatePriceHandler(p.schedule_price_id, e.target.value)} />
              </div>
            ))}
            <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setSelectedSchedule(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}