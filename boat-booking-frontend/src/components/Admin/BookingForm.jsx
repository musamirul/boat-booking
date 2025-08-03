import { useState } from 'react';
import { createBooking } from '../../api/booking';

function BookingForm(){
    const [user_id, setUserId] = useState('');
    const [items, setItems] = useState([{ schedule_id:1, ticket_type_id: 1, quantity:2}]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const res = await createBooking({user_id, items});
        console.log(res.data);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <input type='text' placeholder='User ID' value={user_id} onChange={(e) => setUserId(e.target.value)} className='border p-2 w-full'/>
            <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>Book Now</button>
        </form>
    );
}
export default BookingForm;