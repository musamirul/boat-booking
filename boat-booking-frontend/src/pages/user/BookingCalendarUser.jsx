import { useState, useEffect } from "react";
import { getSchedules } from "../../api/user/schedules";
import { addToCart } from "../../api/user/cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';

export default function BookingCalendarUser() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [ticketQty, setTicketQty] = useState({ adult: 0, child: 0 });
  const { userId } = useAuth(); // Replace with actual user ID from auth
  const {username} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getSchedules().then((res) => setSchedules(res.data));
  }, []);

  const handleAddToCart = async () => {
    if (!selectedSchedule || (ticketQty.adult === 0 && ticketQty.child === 0)) {
      alert("Please select a schedule and at least one ticket.");
      return;
    }
  
    const requests = [];
  
    if (ticketQty.adult > 0) {
      requests.push(addToCart({
        user_id: userId,
        schedule_id: selectedSchedule,
        ticket_type_id: 1, // Adult
        quantity: ticketQty.adult
      }));
    }
  
    if (ticketQty.child > 0) {
      requests.push(addToCart({
        user_id: userId,
        schedule_id: selectedSchedule,
        ticket_type_id: 2, // Child
        quantity: ticketQty.child
      }));
    }
  
    await Promise.all(requests);
    navigate("/cart");
  };

  return (
    <UserLayout>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Schedule & Ticket - {userId}-{username}</h2>
      <select
        className="border p-2 w-full mb-4"
        onChange={(e) => setSelectedSchedule(e.target.value)}
      >
        <option value="">Select Schedule</option>
        { schedules.map((s) => (
          <option key={s.schedule_id} value={s.schedule_id}>
            {s.boat_name} - {s.departure_time} (Seats: {s.available_seats})
          </option>
        ))}
      </select>

      <div className="mb-4">
        <label className="block mb-2">Adult Tickets:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={ticketQty.adult}
          onChange={(e) => setTicketQty({ ...ticketQty, adult: parseInt(e.target.value) || 0 })}
          min="0"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Child Tickets:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={ticketQty.child}
          onChange={(e) => setTicketQty({ ...ticketQty, child: parseInt(e.target.value) || 0 })}
          min="0"
        />
      </div>

      <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
    </UserLayout>
  );
}