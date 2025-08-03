import { useEffect, useState } from 'react';
import { getBoats } from '../../api/boats';
import { createSchedule, addSchedulePrice } from '../../api/schedule';

function ScheduleForm() {
  const [boats, setBoats] = useState([]);
  const [boatId, setBoatId] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [prices, setPrices] = useState({
    adult: '',
    child: '',
  });

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const res = await getBoats();
        setBoats(res.data);
      } catch (err) {
        console.error('Failed to fetch boats:', err);
      }
    };
    fetchBoats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Create the schedule
      const scheduleRes = await createSchedule({
        boat_id: boatId,
        departure_time: departureTime,
        available_seats: availableSeats,
      });

      const scheduleId = scheduleRes.data.schedule_id;

      // 2. Add prices for this schedule
      const ticketTypes = [
        { name: 'adult', id: 1 },
        { name: 'child', id: 2 },
      ];

      for (const type of ticketTypes) {
        const price = prices[type.name];
        if (price !== '') {
          await addSchedulePrice({
            schedule_id: scheduleId,
            ticket_type_id: type.id,
            price,
          });
        }
      }

      alert('Schedule created with prices!');
      setBoatId('');
      setDepartureTime('');
      setAvailableSeats('');
      setPrices({ adult: '', child: ''});
    } catch (err) {
      console.error('Failed to create schedule:', err);
      alert('Error creating schedule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow hover:shadow-lg">
      <h2 className="text-lg font-bold">Create New Schedule</h2>

      <div>
        <label>Boat:</label>
        <select
          value={boatId}
          onChange={(e) => setBoatId(e.target.value)}
          className="block w-full border p-2"
        >
          <option value="">Select Boat</option>
          {boats.map((b) => (
            <option key={b.boat_id} value={b.boat_id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Departure Time:</label>
        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="block w-full border p-2"
        />
      </div>

      <div>
        <label>Available Seats:</label>
        <input
          type="number"
          value={availableSeats}
          onChange={(e) => setAvailableSeats(e.target.value)}
          className="block w-full border p-2"
        />
      </div>

      <div>
        <label>Ticket Prices:</label>
        <div className="space-y-2 mt-2">
          <input
            type="number"
            placeholder="Adult Price"
            value={prices.adult}
            onChange={(e) =>
              setPrices((prev) => ({ ...prev, adult: e.target.value }))
            }
            className="block w-full border p-2"
          />
          <input
            type="number"
            placeholder="Child Price"
            value={prices.child}
            onChange={(e) =>
              setPrices((prev) => ({ ...prev, child: e.target.value }))
            }
            className="block w-full border p-2"
          />
      
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Schedule
      </button>
    </form>
  );
}

export default ScheduleForm;