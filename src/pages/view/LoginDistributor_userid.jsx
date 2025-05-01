import { useEffect, useState } from "react";
import axios from "axios";

const LoginDistributor = () => {

    const [userId, setUserId] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({ serverresponse: "" });
    const [singleUser, setSingleUser] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState({ servererror: "" });


    // Handle user ID changes
    useEffect(() => {
        if (userId && userId.length === 6) {
            const fetchData = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/gifts/member/gift-status`, { "user_id": userId });
                    console.log('Response:', response.data);

                    if (response.data.success) {
                        const userdata = response.data.user;
                        setSingleUser(userdata);

                        setShowSuccess(true);
                        setSuccessMessages(prev => ({
                            ...prev,
                            serverresponse: "Added in member list."
                        }));

                        setShowError(false);
                        setErrors({ servererror: "" })
                    } else {
                        setShowSuccess(true);
                        setSuccessMessages(prev => ({
                            ...prev,
                            serverresponse: response.data.message
                        }));
                    }
                } catch (err) {
                    console.log("Server Error22:", err.response?.data || err.message); // Log the full error response
                    if (err.response && err.response.data) {
                        const errorMessage = err.response.data.message || "An unknown error occurred";
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
        }
    }, [userId]);



    return (
        <div className="max-w-5xl mx-auto py-8 px-4">

            <h3 className="text-lg font-semibold mb-4">Distribute Gift</h3>

            {/* Success messages */}
            {showSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 w-full mb-4" role="alert">
                    {Object.keys(successMessages).map((key) => (
                        successMessages[key] && <li key={key}>{successMessages[key]}</li>
                    ))}
                </div>
            )}


            {/* Regular error messages */}
            {showError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full mb-4" role="alert">
                    {Object.keys(errors).map((key) => (
                        errors[key] && <li key={key}>{errors[key]}</li>
                    ))}
                </div>
            )}

            <form>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">User ID</label>
                    <input
                        type="text"
                        placeholder="Enter your user ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="off"
                        name="username"
                        maxLength={6}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Member <span className="text-red-500">*</span></label>
                    <select
                        name="member"
                        value=""
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Select Member</option>
                        {singleUser && (
                            <option value={singleUser.id}>{singleUser.name + ' (' + singleUser.user_id + ')'}</option>
                        )}
                    </select>
                </div>


            </form>
        </div>
    );
};

export default LoginDistributor;