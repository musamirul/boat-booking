import { useEffect, useState } from 'react';
import { getSchedulesWithPrices } from '../../api/user/schedules';
import { addToCart } from '../../api/user/cart';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../components/layouts/UserLayout';

export default function BookingCalendar({ userId }) {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantities, setQuantities] = useState({ adult: 0, child: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    getSchedulesWithPrices().then(res => setSchedules(res.data));
  }, []);

  const handleSelect = (s) => setSelected(s);

  const handleAddToCart = async () => {
    const total = quantities.adult + quantities.child;
    if (!selected || total === 0) return alert("Please select at least one ticket");

    try {
      if (quantities.adult > 0) {
        await addToCart({
          user_id: userId,
          schedule_id: selected.schedule_id,
          ticket_type_id: selected.prices.adult.ticket_type_id,
          quantity: quantities.adult
        });
      }
      if (quantities.child > 0) {
        await addToCart({
          user_id: userId,
          schedule_id: selected.schedule_id,
          ticket_type_id: selected.prices.child.ticket_type_id,
          quantity: quantities.child
        });
      }
      navigate('/cart');
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  return (
    <UserLayout>
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🎟 Select Schedule & Tickets {userId}</h2>

      {schedules.map(s => (
        <div key={s.schedule_id} className="p-4 bg-gray-100 rounded">
          <div>
            <b>{s.boat_name}</b> at {new Date(s.departure_time).toLocaleString()}
          </div>
          <div>Adult: RM {s.prices.adult.price} | Child: RM {s.prices.child.price}</div>
          <button onClick={() => handleSelect(s)} className="mt-2 text-blue-600">Select</button>
        </div>
      ))}

      {selected && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="text-lg font-semibold mb-2">Selected: {new Date(selected.departure_time).toLocaleString()}</h3>
          <div className="flex gap-4">
            <div>
              <label>Adult</label>
              <input type="number" className="border w-20 p-1" value={quantities.adult}
                onChange={e => setQuantities(q => ({ ...q, adult: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label>Child</label>
              <input type="number" className="border w-20 p-1" value={quantities.child}
                onChange={e => setQuantities(q => ({ ...q, child: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <button onClick={handleAddToCart} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Next</button>
        </div>
      )}
    </div>
    </UserLayout>
  );
}
