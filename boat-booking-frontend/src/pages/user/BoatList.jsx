import { useEffect, useState } from "react";
import { getSchedules } from "../../api/user/schedules";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/layouts/UserLayout";
import boatPlaceholder from "../../assets/boat-image.jpg";

export default function BoatList() {
  const [boats, setBoats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSchedules().then((res) => {
      // Group schedules by boat
      const boatMap = {};
      res.data.forEach((s) => {
        if (!boatMap[s.boat_id]) {
          boatMap[s.boat_id] = {
            boat_id: s.boat_id,
            boat_name: s.boat_name,
            image: s.boat_image || boatPlaceholder,
          };
        }
      });
      setBoats(Object.values(boatMap));
    });
  }, []);

  return (
    <UserLayout>
        
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boats.map((boat) => (
            <div key={boat.boat_id} className="group relative block overflow-hidden p-4 shadow">
                <img
                    src={boat.image}
                    alt={boat.boat_name}
                    className="h-64 w-full rounded-lg object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                />

                <div className="relative  bg-white p-6">

                    <h3 className="mt-4 text-lg font-medium text-gray-900">{boat.boat_name}</h3>

                    <p className="mt-1.5 text-sm text-gray-700">A boat is a watercraft, typically smaller than a ship, designed for transportation, recreation, or other purposes on water</p>

                    <form className="mt-4">
                    <button
                        onClick={() => navigate(`/boat/${boat.boat_id}/schedule`)}
                        className="block w-full rounded-sm bg-yellow-400 p-4 text-sm font-medium transition hover:scale-105"
                    >
                        BOOK NOW
                    </button>
                    </form>
                </div>
            </div>
            ))}
        </div>
        
      {/* <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boats.map((boat) => (
          <div key={boat.boat_id} className="border rounded-lg shadow p-4">
            <img src={boat.image} alt={boat.boat_name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{boat.boat_name}</h3>
            <button
              onClick={() => navigate(`/boat/${boat.boat_id}/schedule`)}
              className="block w-full rounded-sm bg-yellow-400 p-4 text-sm font-medium transition hover:scale-105"
            >
              Book
            </button>
          </div>
        ))}
      </div> */}
    </UserLayout>
  );
}