import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
    const { login, isAuthenticated } = useContext(AuthContext);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState({ servererror: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingLoading, setIsSubmittingLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({serverresponse: ""});
    const [sessionExpired, setSessionExpired] = useState(false);
    const navigate = useNavigate();

    // Check if session expired on component mount
    useEffect(() => {
        // Get the session expired flag immediately when component mounts
        const sessionExpiredValue = localStorage.getItem('sessionExpired');
        console.log('Login page loaded, sessionExpired=', sessionExpiredValue);
        
        // Check for session expiration flag in localStorage
        if (sessionExpiredValue === 'true') {
            console.log('Session expired flag detected in localStorage');
            
            // Set state to show the expired message
            setSessionExpired(true);
            
            // Clear the session expired flag
            localStorage.removeItem('sessionExpired');
            console.log('Session expired flag cleared from localStorage');
        }
    }, []);

    // Handle user ID changes
    useEffect(() => {
        if (userId && userId.length === 6) {
            // Only clear session expired message if user is actively typing a user ID
            if (sessionExpired) {
                setSessionExpired(false);
            }
            
            setIsSubmitting(false);
            setIsSubmittingLoading(false);
            setShowError(false);
            setErrors(prev => ({
                ...prev,
                servererror: ""
            }));
            setShowSuccess(false);
            setSuccessMessages(prev => ({
                ...prev,
                serverresponse: ""
            }));

            const fetchData = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/members/prelogin`, { "user_id": userId });
                    console.log('Response:', response.data);

                    if(response.data.success){
                        setShowSuccess(true);
                        setSuccessMessages(prev => ({
                            ...prev,
                            serverresponse: response.data.message
                        }));
                    }
                } catch (err) {
                    setIsSubmitting(true);
                    console.log("Server Error22:", err.response?.data || err.message); // Log the full error response
                    if (err.response && err.response.data) {
                        const errorMessage =  err.response.data.message || "An unknown error occurred";
                        setShowError(true);
                        setErrors(prev => ({
                            ...prev,
                            servererror: errorMessage
                        }));
                    } else {
                        setShowError(true);
                        setErrors(prev => ({
                            ...prev,
                            servererror: "There was an error: Please try again"
                        }));
                    }
                }
            };
    
            fetchData(); // Invoke the function
        } else {
            // Don't clear error if it's a session expired message
            if (!sessionExpired) {
                setIsSubmitting(false);
                setIsSubmittingLoading(false);
                setShowError(false);
                setErrors(prev => ({
                    ...prev,
                    servererror: ""
                }));
                setShowSuccess(false);
                setSuccessMessages(prev => ({
                    ...prev,
                    serverresponse: ""
                }));
            }
        }
    }, [userId, sessionExpired]);

    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true); // Start loading
            setIsSubmittingLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/members/login`, { "user_id":userId, "password":password });
            console.log(response.data.data);
            login(response.data.data);
            
            navigate('/dashboard', { replace: true });
            // Clear form fields
            setUserId("");
            setPassword("");
        } catch (err) {
            console.log("Server Error: ");
            console.log(err.response.data);

            if (err.response && err.response.data) {
                const errorMessage = Array.isArray(err.response.data.details)
                    ? err.response.data.details.map(detail => 
                        typeof detail === "object" 
                            ? `${detail.field}: ${detail.message}` 
                            : detail
                    ).join("\n")
                    : err.response.data.details || err.response.data.error || err.response.data.message || "An unknown error occurred";

                setShowError(true);
                setErrors(prev => ({
                    ...prev,
                    servererror: errorMessage
                }));
            } else {
                setShowError(true);
                setErrors(prev => ({
                    ...prev,
                    servererror: "Login failed: Please try again"
                }));
            }
        } finally {
            setIsSubmitting(false); // Stop loading regardless of success or failure
            setIsSubmittingLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] mb-8">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>

                {/* Session expired message - always show if sessionExpired is true */}
                {sessionExpired && (
                    <div className="bg-red-100 border-l-4 border-red-600 text-red-700 font-bold p-4 w-full mb-4" role="alert">
                        Your session has expired due to inactivity. Please log in again.
                    </div>
                )}

                {/* Regular error messages */}
                {showError && !sessionExpired && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full mb-4" role="alert">
                        {Object.keys(errors).map((key) => (
                            errors[key] && <li key={key}>{errors[key]}</li>
                        ))}
                    </div>
                )}

                {showSuccess && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 w-full mb-4" role="alert">
                        {Object.keys(successMessages).map((key) => (
                            successMessages[key] && <li key={key}>{successMessages[key]}</li>
                        ))}
                    </div>
                )}

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

                    <div className="flex justify-center mt-10">
                        <button 
                            type="submit" 
                            className={`px-16 py-4 text-xl rounded-lg font-semibold transition-colors flex items-center justify-center ${
                                isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmittingLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : 'Login'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-6">
                        {/* <a href="#" className="hover:underline">Forgot Password?</a> | */}
                        <a href="/register" className="text-blue-600 hover:underline ml-1">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
