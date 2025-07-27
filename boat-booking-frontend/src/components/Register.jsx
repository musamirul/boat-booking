import { useState } from 'react';
import { registerUser } from '../api/auth';

function Register(){
    const [form,setForm] = useState({name:'',email:'', password:''});
    const [message,setMessage] = useState('');

    const handleChange = (e)=>{
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await registerUser(form);
            if(res.data.success){
                setMessage('Registered successfully!');
            }else{
                setMessage(res.data.error || 'Registration failed');
            }
        }catch{
            setMessage('API error during registration');
        }
    };
    return(
        <div>
            <h2 className="text-lg font-bold">Register</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input className="block w-full border p-2" name="name" onChange={handleChange} placeholder='Name'/>
                <input className="block w-full border p-2" name="email" onChange={handleChange} placeholder='Email'/>
                <input className="block w-full border p-2" name="password" type='password' onChange={handleChange} placeholder='Password'/>
                <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>

            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;