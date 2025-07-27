import { useEffect, useState } from "react";
import { getBoats, createBoat, updateBoat, deleteBoat } from "../api/boats";

export default function BoatPage() {
  const [boats, setBoats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBoat, setCurrentBoat] = useState({ name: "", capacity: "", status: "active" });

  // ✅ Fetch Boats
  useEffect(() => { fetchBoats(); }, []);
  const fetchBoats = async () => {
    try {
      const res = await getBoats();
      setBoats(res.data);
    } catch (err) {
      console.error("Error fetching boats:", err);
    }
  };

  // ✅ Handle Form Change
  const handleChange = (e) => {
    setCurrentBoat({ ...currentBoat, [e.target.name]: e.target.value });
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateBoat(currentBoat);
        alert("✅ Boat updated!");
      } else {
        await createBoat(currentBoat);
        alert("✅ Boat added!");
      }
      setShowModal(false);
      setEditMode(false);
      setCurrentBoat({ name: "", capacity: "", status: "active" });
      fetchBoats();
    } catch (err) {
      console.error("Error saving boat:", err);
    }
  };

  // ✅ Edit Boat
  const handleEdit = (boat) => {
    setEditMode(true);
    setCurrentBoat(boat);
    setShowModal(true);
  };

  // ✅ Delete Boat
  const handleDelete = async (boat_id) => {
    if (window.confirm("❗ Are you sure you want to delete this boat?")) {
      try {
        await deleteBoat(boat_id);
        alert("🗑️ Boat Deleted!");
        fetchBoats();
      } catch (err) {
        console.error("Error deleting boat:", err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow">
      {/* ✅ Add Boat Button */}
      <button
        className="mb-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => {
          setEditMode(false);
          setCurrentBoat({ name: "", capacity: "", status: "active" });
          setShowModal(true);
        }}
      >
        + Add Boat
      </button>

      {/* ✅ Boat Table */}
      <table className="w-full border-collapse bg-white rounded-xl shadow hover:shadow-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2 text-center">Boat Name</th>
            <th className="p-2 text-center">Capacity</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {boats.map((b) => (
            <tr key={b.boat_id} className="border-b hover:bg-gray-100">
              <td className="p-2">{b.name}</td>
              <td className="p-2">{b.capacity}</td>
              <td className="p-2">
                <span className={b.status === "active" ? "text-green-600" : "text-red-600"}>
                  {b.status}
                </span>
              </td>
              <td className="p-2 text-center space-x-2">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(b)}>✏️ Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(b.boat_id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal for Add/Edit Boat */}
      {showModal && (
        <div className="fixed inset-0 rounded-xl shadow bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editMode ? "✏️ Edit Boat" : "➕ Add Boat"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text" name="name" value={currentBoat.name} onChange={handleChange}
                placeholder="Boat Name" className="border p-2 w-full rounded" required
              />
              <input
                type="number" name="capacity" value={currentBoat.capacity} onChange={handleChange}
                placeholder="Capacity" className="border p-2 w-full rounded" required
              />
              <select name="status" value={currentBoat.status} onChange={handleChange}
                className="border p-2 w-full rounded">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end space-x-2 mt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                  {editMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}