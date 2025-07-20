import { useState } from 'react';
import { createBoat } from '../api/boats';

function BoatForm(){
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const res = await createBoat({name, capacity: parseInt(capacity)});
        console.log(res.data);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <input type="text" placeholder='Boat Name' value={name} onChange={(e)=> setName(e.target.value)} className='border p-2 w-full'/>
            <input type='number' placeholder='Capacity' value={capacity} onChange={(e)=> setCapacity(e.target.value)} className='border p-2 w-full' />
            <button type='submit' className='bg-blue-600 text-white px-4 py-2'>Create Boat</button>
        </form>
    );
}

export default BoatForm;