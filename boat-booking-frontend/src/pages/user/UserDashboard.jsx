import { useEffect, useState } from "react";
import { getSchedules } from "../../api/user/schedules";
import { getUserBookings, createBooking } from "../../api/user/bookings";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';
import axios from "axios";
import dayjs from "dayjs";

export default function UserDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { userId } = useAuth();


  useEffect(() => {
    console.log("User ID:", userId); // Debug
    if (userId) {
      loadSchedules();
      loadBooking();
    }
  }, [userId]);

  const loadSchedules = async () => {
    try {
      const res = await getSchedules();
      setSchedules(res.data);
    } catch (err) {
      console.error("Error loading schedules", err);
    }
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };


  const loadBooking = async () => {
    try {
      const res = await getUserBookings(userId);
      console.log("Bookings API response:", res.data);
      
      // If backend returns { bookings: [...] }
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else if (Array.isArray(res.data.bookings)) {
        setBookings(res.data.bookings);
      } else if (Array.isArray(res.data.data)) {
        setBookings(res.data.data);
      } else {
        setBookings([]); // fallback to empty array
      }
    } catch (err) {
      console.error("Error loading bookings", err);
      setBookings([]); // prevent crash
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
        user_id: userId,
        payment_method: "Cash",
        items: cart.map(c => ({
          schedule_id: c.schedule_id,
          ticket: c.ticket
        }))
      };
  
      const res = await axios.post("http://localhost/boat-booking/public/api/user/checkout.php", payload);
      console.log("Checkout response:", res.data); // 👈 log full response
  
      if (res.data.success) {
        alert("Booking successful!");
        setCart([]);
        loadBooking();
      } else {
        alert("Checkout failed: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("Checkout failed");
    }
  };

  return (
    <UserLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard{userId}</h1>

      {/* My Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-3">My Bookings</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Booking ID</th>
              <th className="border p-2">Boat</th>
              <th className="border p-2">Departure Time</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map(b => (
                <tr key={b.booking_id}>
                  <td>{b.booking_id}</td>
                  <td>{b.boat_name}</td>
                  <td>{dayjs(b.departure_time).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => openBookingModal(b)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Upcoming Schedules*/}
      <section className="mb-8 mt-8">
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
      

      {/* Cart Section*/}
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

      {/* Booking Details Modal */}
      {modalOpen && selectedBooking && (() => {
  const firstDetail = selectedBooking.details?.[0];

    return (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[10000]">
          <div className="modal-box bg-white p-6 rounded shadow w-96 max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-bold mb-3">Booking Details</h3>
            <p><strong>Booking ID:</strong> {selectedBooking.booking_id}</p>
            <p><strong>Boat:</strong> {firstDetail?.boat_name || 'N/A'}</p>
            <p><strong>Date:</strong> {firstDetail?.departure_time ? dayjs(firstDetail.departure_time).format("YYYY-MM-DD HH:mm") : 'N/A'}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>

            <h4 className="mt-4 font-semibold">Tickets:</h4>
            <ul className="list-disc list-inside">
              {selectedBooking.details?.length > 0 ? (
                selectedBooking.details.map((detail, idx) => (
                  <li key={idx}>
                    {detail.ticket_type_name} x {detail.quantity} @ RM {detail.price} each = RM {detail.price * detail.quantity}
                  </li>
                ))
              ) : (
                <li>No ticket details available</li>
              )}
            </ul>

            <div className="flex justify-end mt-4">
              <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
    </UserLayout>
  );
}