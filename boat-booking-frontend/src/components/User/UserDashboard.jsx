import { useEffect, useState } from "react";
import { getSchedules } from "../../api/schedules";
import { getUserBookings, createBooking } from "../../api/booking";
import dayjs from "dayjs";

export default function UserDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadSchedules();
    loadBooking();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await getSchedules();
      setSchedules(res.data);
    } catch (err) {
      console.error("Error loading schedules", err);
    }
  };

  const loadBooking = async () => {
    try {
      const res = await getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error loading booking", err);
    }
  };

  const addToCart = (schedule) => {
    if (cart.find((c) => c.schedule_id === schedule.schedule_id)) {
      alert("Already in cart");
      return;
    }
    setCart([...cart, { ...schedule, ticket: 1 }]);
  };

  const updateTickets = (id, qty) => {
    setCart(cart.map((item) => (item.schedule_id === id ? { ...item, ticket: qty } : item)));
  };

  const checkout = async () => {
    try {
      const payload = {
        user_id: 1, // 🚩 should come from auth
        items: cart.map(c => ({
          schedule_id: c.schedule_id,
          tickets: c.ticket
        }))
      };

      await createBooking(payload);
      alert("Booking successful");
      setCart([]);
      loadBooking();
    } catch (err) {
      console.error("Checkout error", err);
      alert("Failed to book");
    }
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      {/* Upcoming Schedules */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Upcoming Boat Schedules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((s) => (
            <div key={s.schedule_id} className="border p-4 rounded shadow">
              <p><strong>Boat:</strong> {s.boat_name}</p>
              <p><strong>Departure:</strong> {dayjs(s.departure_time).format("YYYY-MM-DD HH:mm")}</p>
              <p><strong>Seats:</strong> {s.available_seats}</p>
              <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded" onClick={() => addToCart(s)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Section */}
      {cart.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Your Cart</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Boat</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Tickets</th>
                <th className="border p-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.schedule_id}>
                  <td className="border p-2">{item.boat_name}</td>
                  <td className="border p-2">{dayjs(item.departure_time).format("YYYY-MM-DD HH:mm")}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      value={item.ticket}
                      onChange={(e) => updateTickets(item.schedule_id, parseInt(e.target.value))}
                    />
                  </td>
                  <td className="border p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => setCart(cart.filter((c) => c.schedule_id !== item.schedule_id))}>
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={checkout}>
              Checkout
            </button>
          </div>
        </section>
      )}

      {/* My Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-3">My Bookings</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Booking ID</th>
              <th className="border p-2">Boat</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.booking_id}>
                <td className="border p-2">{b.booking_id}</td>
                <td className="border p-2">{b.boat_name}</td>
                <td className="border p-2">{dayjs(b.departure_time).format("YYYY-MM-DD HH:mm")}</td>
                <td className="border p-2">{b.status}</td>
                <td className="border p-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => openBookingModal(b)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Booking Details Modal */}
      {modalOpen && selectedBooking && (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[10000]">
          <div className="modal-box bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-3">Booking Details</h3>
            <p><strong>Booking ID:</strong> {selectedBooking.booking_id}</p>
            <p><strong>Boat:</strong> {selectedBooking.boat_name}</p>
            <p><strong>Date:</strong> {dayjs(selectedBooking.departure_time).format("YYYY-MM-DD HH:mm")}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Tickets:</strong> {selectedBooking.total_tickets}</p>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}