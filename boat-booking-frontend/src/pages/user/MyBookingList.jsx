import { useEffect, useState } from "react";
import { getUserBookings} from "../../api/user/bookings";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';
import dayjs from "dayjs";

export default function MyBookingList() {
  const [bookings, setBookings] = useState([]);
  const { userId } = useAuth();


  useEffect(() => {
    console.log("User ID:", userId); // Debug
    if (userId) {
      loadBooking();
    }
  }, [userId]);




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



  return (
    <UserLayout>
    <div className="p-6">
    <section>
        <h2 className="text-xl font-semibold mb-3">My Bookings</h2>

        {Array.isArray(bookings) && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b, idx) => (
              <div
                key={idx}
                className="rounded-lg shadow-lg/20 bg-white p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Booking Date: {dayjs(b.booking_date).format("YYYY-MM-DD")}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      b.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : b.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{b.boat_name}</h3>
                <p className="text-sm text-gray-600">
                  Departure: {dayjs(b.departure_time).format("YYYY-MM-DD HH:mm")}
                </p>

                <div className="text-sm text-gray-700">
                  <strong>Tickets:</strong>
                  <ul className="list-disc list-inside">
                    {b.tickets.split(", ").map((ticket, i) => (
                      <li key={i}>{ticket}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-700">

                      <div className="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>RM {Number(b.total_price).toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-center text-gray-500">No bookings found.</p>
        )}
      </section>
    </div>
    </UserLayout>
  );
}