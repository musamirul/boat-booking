import { useEffect, useState } from 'react';
import { getBookings  } from '../api/booking';

function BookingList(){
    const [bookings, setBookings] = useState([]);

    useEffect(()=>{
        const fetchBookings = async ()=>{
            try{
                const res = await getBookings();
                setBookings(res.data);
            }catch(err){
                console.error("failed to fetch bookings:",err);
            }
        };
        fetchBookings();
    },[]);

    return (
        <div className='BORDER p-4'>
            <h2 className='text-xl font-bold mb-4'>All Bookings</h2>
            <ul className='space-y-2'>
                {bookings.map((b) => (
                    <li key={b.booking_id} className='border p-2 rounded shadow'>
                        <div><b>Booking ID:</b> {b.booking_id}</div>
                        <div><b>User:</b> {b.user_name} (ID: {b.user_id})</div>
                        <div><b>Status:</b> {b.status}</div>
                        <div><b>Booking Date:</b> {b.booking_date}</div>
                        <div className='ml-4 mt-2'>
                            <b>Details:</b>
                            <ul className='list-disc ml-6'>
                                {b.details.map((d, index) => (
                                    <li key={index}>
                                        {d.quantity}x {d.ticket_type_name} on {new Date(d.departure_time).toLocaleString()} ({d.boat_name}) - RM {d.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default BookingList;