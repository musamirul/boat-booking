import { useEffect, useState } from "react";
import { getSchedules, updateSchedule } from "../../api/admin/schedules";
import { getBoats } from "../../api/admin/boats";
import { getTicketTypes } from "../../api/admin/ticketTypes";
import { updateSchedulePrice, addSchedulePrice } from "../../api/admin/schedulePrices";

export default function ManageScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [boats, setBoats] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [editSchedule, setEditSchedule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [newPrice, setNewPrice] = useState({ schedule_id: null, ticket_type_id: "", price: "" });

  // ✅ Fetch all data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sRes, bRes, tRes] = await Promise.all([getSchedules(), getBoats(), getTicketTypes()]);
      setSchedules(Array.isArray(sRes.data) ? sRes.data : []);
      setBoats(bRes.data);
      setTicketTypes(tRes.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  // ✅ Update price (using API)
  const handleUpdatePrice = async (id, price) => {
    try {
      await updateSchedulePrice(id, price);
      loadData();
    } catch (err) {
      console.error("Error updating price", err);
    }
  };

  // ✅ Open modal to add a new price
  const openAddPriceModal = (scheduleId) => {
    setNewPrice({ schedule_id: scheduleId, ticket_type_id: "", price: "" });
    setPriceModalOpen(true);
  };

  // ✅ Save new price
  const saveNewPrice = async () => {
    try {
      await addSchedulePrice(newPrice);
      setPriceModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error adding price", err);
    }
  };

  // ✅ Open edit modal
  const openEditModal = (schedule) => {
    setEditSchedule({ ...schedule });
    setModalOpen(true);
  };

  // ✅ Save updated schedule
  const saveSchedule = async () => {
    try {
      await updateSchedule(editSchedule);
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error updating schedule", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">Schedules with Ticket Prices</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Boat</th>
            <th className="p-2 border">Departure Time</th>
            <th className="p-2 border">Available Seats</th>
            <th className="p-2 border">Ticket Prices</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(schedules) && schedules.length > 0 ? (
            schedules.map((s) => (
              <tr key={s.schedule_id} className="border hover:bg-gray-50">
                <td className="p-2 border">{s.schedule_id}</td>
                <td className="p-2 border">{s.boat_name}</td>
                <td className="p-2 border">{s.departure_time}</td>
                <td className="p-2 border">{s.available_seats}</td>
                <td className="p-2 border">
                  {Array.isArray(s.prices) && s.prices.length > 0 ? (
                    s.prices.map((p) => (
                      <div key={p.schedule_price_id} className="flex items-center space-x-2 mb-1">
                        <span>{p.ticket_type_name}</span>
                        <input
                          type="number"
                          defaultValue={p.price}
                          className="border p-1 w-20"
                          onChange={(e) => (p.newValue = e.target.value)}
                        />
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handleUpdatePrice(p.schedule_price_id, p.newValue || p.price)}
                        >
                          Update
                        </button>
                      </div>
                    ))
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => openAddPriceModal(s.schedule_id)}
                    >
                      + Add Price
                    </button>
                  )}
                </td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => openEditModal(s)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-3 text-center">No schedules found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Edit Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-4 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-2">Edit Schedule</h3>

            <label className="block mb-2">Boat</label>
            <select
              value={editSchedule.boat_id}
              onChange={(e) => setEditSchedule({ ...editSchedule, boat_id: e.target.value })}
              className="border p-2 w-full mb-2"
            >
              {boats.map((boat) => (
                <option key={boat.boat_id} value={boat.boat_id}>{boat.name}</option>
              ))}
            </select>

            <label className="block mb-2">Departure Time</label>
            <input
              type="datetime-local"
              value={editSchedule.departure_time}
              onChange={(e) => setEditSchedule({ ...editSchedule, departure_time: e.target.value })}
              className="border p-2 w-full mb-2"
            />

            <label className="block mb-2">Available Seats</label>
            <input
              type="number"
              value={editSchedule.available_seats}
              onChange={(e) => setEditSchedule({ ...editSchedule, available_seats: e.target.value })}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={saveSchedule}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add Price Modal */}
      {priceModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-4 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-2">Add Ticket Price</h3>

            <label className="block mb-2">Ticket Type</label>
            <select
              value={newPrice.ticket_type_id}
              onChange={(e) => setNewPrice({ ...newPrice, ticket_type_id: e.target.value })}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Ticket Type</option>
              {ticketTypes.map((tt) => (
                <option key={tt.ticket_type_id} value={tt.ticket_type_id}>{tt.name}</option>
              ))}
            </select>

            <label className="block mb-2">Price</label>
            <input
              type="number"
              value={newPrice.price}
              onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setPriceModalOpen(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={saveNewPrice}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}