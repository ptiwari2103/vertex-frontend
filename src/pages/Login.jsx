import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
    const { login, isAuthenticated } = useContext(AuthContext);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/members/login", { "user_id":userId, "password":password });
            console.log(response.data.data);
            login(response.data.data);
            navigate('/dashboard', { replace: true });
            // Clear form fields
            setUserId("");
            setPassword("");
        } catch (err) {
            if (err.response && err.response.data) {
                let errorMessage = err.response.data.details
                    ?.map(detail => `${detail.field}: ${detail.message}`)
                    .join("\n") || err.response.data.message;
                            
                alert("Login failed: " + errorMessage);
            } else {
                alert("Login failed: Please try again");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] mb-8">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto" autoComplete="off">
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">User ID</label>
                        <input
                            type="text"
                            placeholder="Enter your user ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="off"
                            name="username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="new-password"
                            name="password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mt-4"
                    >
                        Login
                    </button>

                    <div className="text-center text-sm text-gray-600 mt-6">
                        <a href="#" className="hover:underline">Forgot Password?</a> |
                        <a href="/register" className="text-blue-600 hover:underline ml-1">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
