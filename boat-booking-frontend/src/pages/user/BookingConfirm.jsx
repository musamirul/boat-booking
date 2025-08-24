import { useEffect, useState } from "react";
import { getCart, clearCart  } from "../../api/user/cart";
import { createBooking } from "../../api/user/bookings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';
import boatPlaceholder from "../../assets/boat-image.jpg";

export default function BookingConfirm() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const boat_image = boatPlaceholder;
  const navigate = useNavigate();

  useEffect(() => {
    getCart(userId).then((res) => {
      // Ensure it's always an array
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]); // fallback
      }
    }).catch(() => setItems([]));
  }, [userId]);

  const total = Array.isArray(items) 
  ? items.reduce((sum, item) => sum + item.quantity * item.price, 0) 
  : 0;

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
        await clearCart(userId);
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
    {/* <div className="p-4">
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
    </div> */}

    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
  <div className="mx-auto max-w-3xl">
    <header className="text-center">
      <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
        Confirm Your Booking
      </h1>
    </header>

    {/* Items list */}
    <div className="mt-8">
      <ul className="space-y-4">
        {items.map(item => (
          <li
            key={item.cart_item_id}
            className="flex items-center gap-4 border-b border-gray-200 pb-4"
          >
            <img
              src={item.boat_image || boat_image}
              alt={item.boat_name}
              className="size-16 rounded-sm object-cover"
            />

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {item.boat_name}
              </h3>

              <dl className="mt-0.5 space-y-px text-xs text-gray-600">
                <div>
                  <dt className="inline">Booking Time: </dt>
                  <dd className="inline">
                    {new Date(item.departure_time).toLocaleString()}
                  </dd>
                </div>

                <div>
                  <dt className="inline">Tickets: </dt>
                  <dd className="inline">
                    {item.ticket_type} × {item.quantity}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-800">
              RM {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-bold">Total: RM {total}</div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>

    {/* Total & Confirm button */}
    {/* <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
      <span className="text-lg font-bold text-gray-900">
        Total: RM {total.toFixed(2)}
      </span>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div> */}
  </div>
</div>

    
    </UserLayout>
  );
}