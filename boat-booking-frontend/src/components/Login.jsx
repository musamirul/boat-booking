import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "./AuthContext";

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
            login(res.data.user.user_id, userRole); // ✅ use context login

            alert("Login successful!");
            navigate(userRole === "admin" ? "/admin" : "/");
        } catch (err) {
            setError("Login failed. Try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md mx-auto mt-10 space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border p-2" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border p-2" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button>
        </form>
    );
}

export default Login;