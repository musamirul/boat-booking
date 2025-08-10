import { useEffect, useState } from "react";
import { getCart } from "../../api/user/cart";
import { createBooking } from "../../api/user/bookings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';

export default function BookingConfirm() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getCart(userId).then((res) => setItems(res.data));
  }, []);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleConfirm = async () => {
    if (items.length === 0) return alert("Cart is empty.");

    setLoading(true);
    try {
      const bookingData = {
        user_id: userId,
        items: items.map(item => ({
          schedule_id: item.schedule_id,
          ticket_type_id: item.ticket_type_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await createBooking(bookingData);
      if (response.data.success) {
        navigate(`/payment/${response.data.booking_id}`, { state: { total } });
      } else {
        alert("Failed to create booking");
      }
    } catch (error) {
      console.error(error);
      alert("Error during booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>
      {items.map((item) => (
        <div key={item.cart_item_id} className="border p-2 mb-2">
          {item.boat_name} - {item.departure_time} - {item.ticket_type} x {item.quantity} = RM {item.price * item.quantity}
        </div>
      ))}
      <div className="mt-4 font-bold">Total: RM {total}</div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
    </UserLayout>
  );
}