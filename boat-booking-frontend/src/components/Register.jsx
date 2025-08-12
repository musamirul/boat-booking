import { useState } from 'react';
import { registerUser } from '../api/auth';
import { Description, Button, Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import clsx from 'clsx'
import UsersLayout from "./layouts/UsersLayout";

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
        <UsersLayout>
        <div>
            <div className="rounded-xl border-2 border-gray-100 bg-white items-center gap-4 w-full max-w-lg px-4">
                <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
                <Legend className="text-base/7 font-bold text-black">Register</Legend>
                <form onSubmit={handleSubmit} className='space-y-4'>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Full Name</Label>
                    <Description className="text-sm/6 text-black/50">Enter your full name.</Description>
                    <Input name="name" onChange={handleChange} placeholder='Name' 
                        className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                    required/>
                        {/* <input className="block w-full border p-2" name="name" onChange={handleChange} placeholder='Name'/> */}
                    </Field>
                    <Field>
                    <Label className="text-sm/6 font-medium text-black">Email</Label>
                    <Description className="text-sm/6 text-black/50">Enter your email address.</Description>
                    <Input  name="email" onChange={handleChange} placeholder='Email' 
                        className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                    required/>
                    {/* <input className="block w-full border p-2" name="email" onChange={handleChange} placeholder='Email'/> */}
                    </Field>
                    <Field>
                    <Label className="text-sm/6 font-medium text-black">Password</Label>
                    <Input  name="password" type='password' onChange={handleChange} placeholder='Password' 
                        className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                    required/>
                    </Field>
                    {/* <input className="block w-full border p-2" name="password" type='password' onChange={handleChange} placeholder='Password'/> */}
                    <Field>
                        <Button type="submit" className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
                            Register
                        </Button>
                        {/* <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button> */}
                    </Field>
                    {/* <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button> */}

                </form>
                {message && <p>{message}</p>}
                </Fieldset>
            </div>
        </div>
        </UsersLayout>
    );
}

export default Register;