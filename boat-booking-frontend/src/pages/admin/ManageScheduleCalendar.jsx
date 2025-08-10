import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getSchedules, addSchedule, updateSchedule } from "../../api/admin/schedules";
import { getBoats } from "../../api/admin/boats";
import { createPortal } from "react-dom";


export default function ManageScheduleCalendar(){
    const [events, setEvents] = useState([]);
    const [boats, setBoats] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editSchedule, setEditSchedule] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newSchedule, setNewSchedule] = useState({boat_id:"",departure_time:"",available_seat:0});
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    //load boats & schedules
    useEffect(()=> { loadData(); }, []);

    const loadData = async () => {
        try {
          const [sRes, bRes] = await Promise.all([getSchedules(), getBoats()]);
          const schedules = sRes.data;
          setBoats(bRes.data);
    
          // convert schedules → FullCalendar events
          const calendarEvents = schedules.map(s => ({
            id: s.schedule_id,
            title: `${s.boat_name} (${s.available_seats} seats)`,
            start: s.departure_time,
            end: new Date(new Date(s.departure_time).getTime() + 10 * 10 * 1000),
            allDay: false,
            extendedProps: s
          }));
    
          setEvents(calendarEvents);
        } catch (err) {
          console.error("Error loading data", err);
        }
    };

    //Event click -> open modal with schedule details
    const handleEventClick = (info)=>{
        setEditSchedule({ ...info.event.extendedProps});
        // setSelectedSchedule({
        //     id: info.event.id,
        //     boat_name: info.event.extendedProps.boat_name,
        //     available_seats: info.event.extendedProps.available_seats,
        //     departure_time: info.event.startStr
        //   });
        //   setViewModalOpen(true);
        setModalOpen(true);
    }

    //When clicking a date -> open modal to add schedule
    const handleDateClick = (info) =>{
        setNewSchedule({ boat_id:"", departure_time: info.dateStr + "T09:00", available_seat:0});
        setAddModalOpen(true);
    };

    // Save updated schedule
    const saveSchedule = async () =>{
        try{
            await updateSchedule(editSchedule);
            setModalOpen(false);
            loadData();   // ✅ CALL THE FUNCTION
        }catch (err){
            console.error("Error updating schedule",err);
        }
    };

    //Add new schedule
    const saveNewSchedule = async () => {
        try {
            await addSchedule(newSchedule);
            setAddModalOpen(false);
            loadData();   // ✅ CALL THE FUNCTION
        }catch (err){
            console.error("Error adding schedule",err);
        }
    };

    return (
        <div className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
          />
    
          {/* ✅ Edit Schedule Modal */}
          {modalOpen && editSchedule && (
            <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
              <div className="modal-box bg-white p-4 rounded shadow w-96">
                <h3 className="text-lg font-bold mb-3">Edit Schedule</h3>
    
                <label className="block mb-2">Boat</label>
                <select
                  value={editSchedule.boat_id}
                  onChange={(e) => setEditSchedule({ ...editSchedule, boat_id: e.target.value })}
                  className="border p-2 w-full mb-2"
                >
                  {boats.map(boat => (
                    <option key={boat.boat_id} value={boat.boat_id}>{boat.name}</option>
                  ))}
                </select>
    
                <label className="block mb-2">Departure Time</label>
                <input
                  type="datetime-local"
                  value={editSchedule.departure_time}
                  onChange={(e) => setEditSchedule({ ...editSchedule, departure_time: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
    
                <label className="block mb-2">Available Seats</label>
                <input
                  type="number"
                  value={editSchedule.available_seats}
                  onChange={(e) => setEditSchedule({ ...editSchedule, available_seats: e.target.value })}
                  className="border p-2 w-full mb-4"
                />
    
                <div className="flex justify-end space-x-2">
                  <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={saveSchedule}>Save</button>
                </div>
              </div>
            </div>
          )}
    
          {/* ✅ Add New Schedule Modal */}
          {addModalOpen && (
            <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
              <div className="modal-box bg-white p-4 rounded shadow w-96">
                <h3 className="text-lg font-bold mb-3">Add New Schedule</h3>
    
                <label className="block mb-2">Boat</label>
                <select
                  value={newSchedule.boat_id}
                  onChange={(e) => setNewSchedule({ ...newSchedule, boat_id: e.target.value })}
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Select Boat</option>
                  {boats.map(boat => (
                    <option key={boat.boat_id} value={boat.boat_id}>{boat.name}</option>
                  ))}
                </select>
    
                <label className="block mb-2">Departure Time</label>
                <input
                  type="datetime-local"
                  value={newSchedule.departure_time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, departure_time: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
    
                <label className="block mb-2">Available Seats</label>
                <input
                  type="number"
                  value={newSchedule.available_seats}
                  onChange={(e) => setNewSchedule({ ...newSchedule, available_seats: e.target.value })}
                  className="border p-2 w-full mb-4"
                />
    
                <div className="flex justify-end space-x-2">
                  <button className="bg-gray-400 px-3 py-1 rounded" onClick={() => setAddModalOpen(false)}>Cancel</button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={saveNewSchedule}>Add</button>
                </div>
              </div>
            </div>
          )}

            {viewModalOpen && selectedSchedule && (
            <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-[10000]">
                <div className="modal-box bg-white p-4 rounded shadow w-96">
                <h3 className="text-lg font-bold mb-3">Schedule Details</h3>

                <p><strong>Schedule ID:</strong> {selectedSchedule.id}</p>
                <p><strong>Boat:</strong> {selectedSchedule.boat_name}</p>
                <p><strong>Seats:</strong> {selectedSchedule.available_seats}</p>
                <p><strong>Departure Time:</strong> {selectedSchedule.departure_time}</p>

                <div className="flex justify-end mt-4">
                    <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => setViewModalOpen(false)}
                    >
                    Close
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    );
}