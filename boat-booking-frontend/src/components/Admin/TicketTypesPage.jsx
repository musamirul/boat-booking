import { useEffect, useState } from "react";
import { getTicketTypes, createTicketType, updateTicketType, deleteTicketType } from "../../api/ticketTypes";

export default function TicketTypesPage() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentType, setCurrentType] = useState({ ticket_type_id: null, name: "" });

  // ✅ Fetch Ticket Types on Load
  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    try {
      const res = await getTicketTypes();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setTicketTypes(data);
    } catch (err) {
      console.error("Error fetching ticket types:", err);
      setTicketTypes([]);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setCurrentType({ ...currentType, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit (Add / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateTicketType(currentType);
        alert("Ticket type updated!");
      } else {
        await createTicketType(currentType);
        alert("Ticket type added!");
      }
      setShowModal(false);
      setEditMode(false);
      setCurrentType({ ticket_type_id: null, name: "" });
      fetchTicketTypes();
    } catch (err) {
      console.error("Error saving ticket type:", err);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (type) => {
    setEditMode(true);
    setCurrentType(type);
    setShowModal(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket type?")) {
      try {
        await deleteTicketType(id);
        alert("Ticket type deleted!");
        fetchTicketTypes();
      } catch (err) {
        console.error("Error deleting ticket type:", err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🎟 Ticket Types</h1>
        <button
          onClick={() => {
            setEditMode(false);
            setCurrentType({ ticket_type_id: null, name: "" });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Ticket Type
        </button>
      </div>

      {/* ✅ Table */}
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ticketTypes) && ticketTypes.length > 0 ? (
            ticketTypes.map((type, idx) => (
              <tr key={type.ticket_type_id} className="hover:bg-gray-50">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{type.name}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => handleEdit(type)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(type.ticket_type_id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No ticket types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Ticket Type" : "Add Ticket Type"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={currentType.name}
                onChange={handleChange}
                placeholder="Ticket Type Name"
                className="border p-2 w-full"
                required
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-3 py-1 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
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