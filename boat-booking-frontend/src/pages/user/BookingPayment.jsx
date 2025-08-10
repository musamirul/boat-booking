import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getBookingDetails } from "../../api/user/bookings";
import { makePayment } from "../../api/user/payments";
import UserLayout from '../../components/layouts/UserLayout';

export default function BookingPayment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const totalFromState = location.state?.total || 0;
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getBookingDetails(bookingId).then((res) => setDetails(res.data));
  }, [bookingId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await makePayment({ booking_id: bookingId, amount: totalFromState });
      if (response.data.success) {
        alert("Payment successful! Booking confirmed.");
        navigate("/");
      } else {
        alert("Payment failed: " + (response.data.message || ""));
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Payment for Booking #{bookingId}</h2>
      {Array.isArray(details) ? (
          details.map((item) => (
            <div key={item.booking_detail_id} className="border p-2 mb-2">
              {item.boat_name} - {new Date(item.departure_time).toLocaleString()} - {item.ticket_type} x {item.quantity} = RM {item.price * item.quantity}
            </div>
          ))
        ) : (
          <p>No booking details available.</p>
        )}
      <div className="mt-4 font-bold">Total: RM {totalFromState}</div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
    </UserLayout>
  );
}