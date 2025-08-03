import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSchedulePrices, updatePrice, addPrice } from "../../api/schedulePrices";
import Modal from "./Modal"; // ✅ simple modal component

export default function SchedulePriceList() {
  const { scheduleId } = useParams();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [newPrice, setNewPrice] = useState({ ticket_type_id: "", price: "" });

  // Fetch Prices
  useEffect(() => {
    fetchPrices();
  }, [scheduleId]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await getSchedulePrices(scheduleId);
      // ✅ Extract array correctly
      setPrices(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Error loading prices:", err);
      setPrices([]);
    }
    setLoading(false);
  };

  // Inline Price Update
  const handlePriceChange = (id, value) => {
    setPrices(prices.map((p) => (p.schedule_price_id === id ? { ...p, price: value } : p)));
  };

  const handlePriceSave = async (priceItem) => {
    try {
      await updatePrice(priceItem.schedule_price_id, priceItem.price);
      alert("Price updated!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Modal - Add New Price
  const handleAddPrice = async (e) => {
    e.preventDefault();
    try {
      await addPrice(scheduleId, newPrice.ticket_type_id, newPrice.price);
      alert("New price added!");
      setShowModal(false);
      fetchPrices();
    } catch (err) {
      console.error("Error adding price:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Prices for Schedule #{scheduleId}</h2>

      <button
        className="mb-3 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        ➕ Add New Price
      </button>

      {loading ? (
        <p>Loading prices...</p>
      ) : prices.length === 0 ? (
        <p>No prices found for this schedule.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Ticket Type</th>
              <th className="border p-2">Price (RM)</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.schedule_price_id}>
                <td className="border p-2">{p.ticket_type_name}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handlePriceChange(p.schedule_price_id, e.target.value)}
                    className="border p-1 w-24"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handlePriceSave(p)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Modal for Adding Price */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 className="text-lg font-semibold mb-3">Add New Price</h3>
          <form onSubmit={handleAddPrice} className="space-y-3">
            <input
              type="number"
              placeholder="Ticket Type ID"
              value={newPrice.ticket_type_id}
              onChange={(e) => setNewPrice({ ...newPrice, ticket_type_id: e.target.value })}
              className="border p-2 w-full"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newPrice.price}
              onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
              className="border p-2 w-full"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
                Save
              </button>
              <button type="button" className="bg-gray-400 text-white px-4 py-1 rounded" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}