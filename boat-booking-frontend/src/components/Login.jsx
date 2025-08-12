import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "./AuthContext";
import { Description, Button, Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import clsx from 'clsx'
import UsersLayout from "./layouts/UsersLayout";
import UserCTA from "./layouts/UserCTA";

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser({ email, password });
            if (res.data.error) {
                setError(res.data.error);
                return;
            }

            const userRole = (res.data.user.role || "user").toLowerCase();
            login(res.data.user.user_id, userRole, res.data.user.name); // ✅ use context login

            alert("Login successful!");
            navigate(userRole === "admin" ? "/admin" : "/");
        } catch (err) {
            setError("Login failed. Try again.");
        }
    };

    return (
        
        <UsersLayout>
        <div className="rounded-xl border-2 border-gray-100 bg-white w-full max-w-lg px-4">
            <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 space-y-4">
                <Legend className="text-base/7 font-bold text-black">Login</Legend>
                
                {error && <p className="text-red-500">{error}</p>}
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Email</Label>
                    <Description className="text-sm/6 text-black/50">Enter your registered email address.</Description>
                    {/* <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border p-2" required /> */}
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} 
                        className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                    required/>
                </Field>
                <Field>
                    <Label className="text-sm/6 font-medium text-black">Password</Label>
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} 
                        className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                    required/>
                    {/* <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border p-2" required /> */}
                </Field>
                <Field>
                <Button type="submit" className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
                    Login
                </Button>
                {/* <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button> */}
                </Field>
            </form>
            </Fieldset>
        </div>
        </UsersLayout>
    );
}

export default Login;