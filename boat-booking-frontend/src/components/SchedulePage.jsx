import React, { useState } from 'react';
import SchedulePriceList from './SchedulePriceList'; // adjust path if needed

function SchedulePage() {
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const handleSelectSchedule = (id) => {
    setSelectedScheduleId(id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Schedules</h2>

      {/* Example: You click a button to select a schedule */}
      <div className="space-x-2">
        <button onClick={() => handleSelectSchedule(1)} className="bg-blue-600 text-white px-3 py-1 rounded">
          Load Schedule 1 Prices
        </button>
        <button onClick={() => handleSelectSchedule(2)} className="bg-blue-600 text-white px-3 py-1 rounded">
          Load Schedule 2 Prices
        </button>
      </div>

      {/* Pass the selected ID to the price list */}
      {selectedScheduleId && (
        <SchedulePriceList scheduleId={selectedScheduleId} />
      )}
    </div>
  );
}

export default SchedulePage;