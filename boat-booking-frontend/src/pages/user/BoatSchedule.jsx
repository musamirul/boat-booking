import { useEffect, useState } from "react";
import { getSchedulesByBoat } from "../../api/user/schedules";
import { addToCart } from "../../api/user/cart";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import UserLayout from "../../components/layouts/UserLayout";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function BoatSchedule() {
  const { boatId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedulesForDate, setSchedulesForDate] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  //const [ticketQty, setTicketQty] = useState({ adult: 0, child: 0 });
  const [ticketPrices, setTicketPrices] = useState([]);
  const [ticketQty, setTicketQty] = useState([]);
  const { userId } = useAuth();
  const navigate = useNavigate();


  //When user selects schedule, setprices from backend
  useEffect(()=>{
    if(selectedSchedule){
      const schedule = schedulesForDate.find(s=>s.schedule_id === selectedSchedule);
      if(schedule && schedule.prices){
        setTicketPrices(schedule.prices);

        //Initialize ticketQty with all available ticket types set to 0
        const qtyInit = {};
        schedule.prices.forEach(p=>{
          qtyInit[p.ticket_type_id]=0;
        });
        setTicketQty(qtyInit);
      }
    }else{
      setTicketPrices([]);
      setTicketQty([]);
    }
  },[selectedSchedule,schedulesForDate]);

  // Fetch all schedules for this boat
  useEffect(() => {
    if (boatId) {
      getSchedulesByBoat(boatId)
        .then(res => setSchedules(res.data))
        .catch(err => {
          console.error(err);
          setSchedules([]);
        });
    }
  }, [boatId]);

  // Update schedules for selected date
  useEffect(() => {
    if (selectedDate) {
      const selectedDateStr = selectedDate.toDateString(); // local date string
  
      const filtered = schedules.filter(s => {
        const scheduleDate = new Date(s.departure_time).toDateString();
        return scheduleDate === selectedDateStr;
      });
  
      setSchedulesForDate(filtered);
      setSelectedSchedule(filtered.length > 0 ? filtered[0].schedule_id : null);
    } else {
      setSchedulesForDate([]);
      setSelectedSchedule(null);
    }
  }, [selectedDate, schedules]);

  // Add tickets to cart
  const handleAddToCart = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule.");
      return;
    }

    const requests = [];
    for (const [ticket_type_id, qty] of Object.entries(ticketQty)) {
      if (qty > 0) {
        requests.push(
          addToCart({
            user_id: userId,
            schedule_id: selectedSchedule,
            ticket_type_id: parseInt(ticket_type_id),
            quantity: qty,
          })
        );
      }
    }

    if (requests.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    await Promise.all(requests);
    navigate("/cart");
  };

  // Blue dot for dates with schedules
  const scheduleDates = schedules.map(s => new Date(s.departure_time).toDateString());
  const tileContent = ({ date, view }) => {
    if (view === 'month' && scheduleDates.includes(date.toDateString())) {
      return <div className="mx-auto mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>;
    }
  };

  return (
    <UserLayout>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Select Date & Tickets</h2>

        {/* Calendar */}
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
        />

        {/* Schedules for selected date */}
        {schedulesForDate.length > 0 && (
          <div className="mt-4">
            <label className="block mb-2 font-medium">Select Schedule:</label>
            <select
              className="border p-2 w-full mb-4"
              value={selectedSchedule || ""}
              onChange={e => setSelectedSchedule(parseInt(e.target.value))}
            >
              {schedulesForDate.map(s => (
                <option key={s.schedule_id} value={s.schedule_id}>
                  {new Date(s.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Seats: {s.available_seats}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Ticket selection */}
        {/* <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Adult Tickets:</label>
          <input
            type="number"
            className="border mt-0.5 p-2 w-full rounded border-gray-300 shadow-sm sm:text-lg"
            value={ticketQty.adult}
            onChange={(e) => setTicketQty({ ...ticketQty, adult: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Child Tickets:</label>
          <input
            type="number"
            className="border mt-0.5 p-2 w-full rounded border-gray-300 shadow-sm sm:text-lg"
            value={ticketQty.child}
            onChange={(e) => setTicketQty({ ...ticketQty, child: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div> */}
        {ticketPrices.length > 0 && selectedSchedule && (
        <div className="space-y-4">
          {ticketPrices.map(p => {
            const schedule = schedulesForDate.find(s => s.schedule_id === selectedSchedule);
            const maxSeats = schedule ? schedule.available_seats : 0;

            const totalBooked = Object.values(ticketQty).reduce(
              (sum, qty) => sum + (qty || 0),
              0
            );
            const remainingSeats = Math.max(0, maxSeats - totalBooked);

            return (
              <div key={p.ticket_type_id} className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {p.ticket_type_name} Tickets (RM {p.price}):
                </label>
                <input
                  type="number"
                  className="border mt-0.5 p-2 w-full rounded border-gray-300 shadow-sm sm:text-lg"
                  value={ticketQty[p.ticket_type_id] ?? ""}
                  onChange={e => {
                    let val = e.target.value;
                    let parsed = val === "" ? "" : parseInt(val, 10) || 0;

                    // calculate current total excluding this ticket type
                    const otherTotal = Object.entries(ticketQty)
                      .filter(([id]) => id !== String(p.ticket_type_id))
                      .reduce((sum, [, qty]) => sum + (qty || 0), 0);

                    // ✅ enforce combined total ≤ maxSeats
                    if (parsed + otherTotal > maxSeats) {
                      parsed = Math.max(0, maxSeats - otherTotal);
                    }

                    setTicketQty({
                      ...ticketQty,
                      [p.ticket_type_id]: parsed
                    });
                  }}
                  min="0"
                />
                {/* ✅ Helper text */}
                <p className="text-sm text-gray-500 mt-1">
                  Remaining seats: {remainingSeats}
                </p>
              </div>
            );
          })}
        </div>
      )}

        {/* <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!selectedSchedule || (ticketQty.adult === 0 && ticketQty.child === 0)}
        >
          Add to Cart
        </button> */}
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={
            !selectedSchedule ||
            Object.values(ticketQty).every(qty => qty === 0 || qty === "" || qty == null)
          }
        >
          Add to Cart
        </button>
      </div>
    </UserLayout>
  );
}