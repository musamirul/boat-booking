import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSchedulePrices } from '../api/schedule';

function SchedulePriceList() {
  const { scheduleId } = useParams(); // ✅ extract from route param
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scheduleId) return;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await getSchedulePrices(scheduleId);
        setPrices(res.data.prices || []);
      } catch (err) {
        console.error('Error fetching prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [scheduleId]);

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Ticket Prices for Schedule #{scheduleId}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : prices.length === 0 ? (
        <p>No prices found for this schedule.</p>
      ) : (
        <ul className="space-y-1">
          {prices.map((price) => (
            <li key={price.ticket_type_id} className="flex justify-between">
              <span>{price.ticket_type_name}</span>
              <span>RM {price.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SchedulePriceList;