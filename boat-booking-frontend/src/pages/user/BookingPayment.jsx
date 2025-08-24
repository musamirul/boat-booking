import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getBookingDetails } from "../../api/user/bookings";
import { makePayment } from "../../api/user/payments";
import UserLayout from '../../components/layouts/UserLayout';
import boatPlaceholder from "../../assets/boat-image.jpg";

export default function BookingPayment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const totalFromState = location.state?.total || 0;
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const boat_image = boatPlaceholder;
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
    {/* <div className="p-4">
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
    </div> */}

    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Payment for Booking #{bookingId}
          </h1>
        </header>

        <div className="mt-8">
          <ul className="space-y-4">
          {Array.isArray(details) ? (
              details.map((item) => (
                <li
                  key={item.booking_detail_id}
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
                
              ))
            ) : (
              <p>No booking details available.</p>
            )}
              </ul>
              <div className="mt-4 font-bold">Total: RM {totalFromState}</div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Processing Payment..." : "Pay Now"}
              </button>
        </div>
        
      </div>
    </div>

    </UserLayout>
  );
}