import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

const PinManagement = () => {
    const { userdata } = useContext(AuthContext);
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPins = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5001/pins/assignedpins`, {
                    params: {
                        user_id: userdata?.id
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setPins(response.data.pins || []);
                setError(null);
            } catch (err) {
                setError("Failed to fetch pins. Please try again later.");
                console.error("Error fetching pins:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPins();
    }, [userdata?.user_id]);

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="p-2 border border-gray-300">Pin</th>
                                <th className="p-2 border border-gray-300">Used By</th>
                                <th className="p-2 border border-gray-300">Created Date</th>
                                <th className="p-2 border border-gray-300">Assigned Date</th>
                                <th className="p-2 border border-gray-300">Used Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pins.map((pin) => (
                                <tr key={pin.id} className="border border-gray-200 text-center">
                                    <td className="p-2 border border-gray-300">{pin.pin}</td>
                                    <td className="p-2 border border-gray-300">{pin.usedUser ? pin.usedUser.name : "-"}</td>
                                    <td className="p-2 border border-gray-300">{new Date(pin.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 border border-gray-300">{pin.assigned_date ? new Date(pin.assigned_date).toLocaleDateString() : "-"}</td>
                                    <td className="p-2 border border-gray-300">{pin.used_date ? new Date(pin.used_date).toLocaleDateString() : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PinManagement;
