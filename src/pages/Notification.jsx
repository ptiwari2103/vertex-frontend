
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

const Notification = () => {
       
    const { userdata } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const fetchedRef = useRef(false);

    useEffect(() => {
        const fetchNotification = async () => {
            if (!userdata?.id || fetchedRef.current) return;
            
            try {
                fetchedRef.current = true;
                const response = await axios.get(`http://localhost:5001/messages/notification/${userdata.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.data?.data) {
                    setNotifications(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching notification:", error);
            }
        };

        fetchNotification();
    }, [userdata?.id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                {notifications.length > 0 && (
                    <div className="w-full max-w-6xl mb-6 px-4">
                        <h3 className="font-bold text-2xl mb-4 text-gray-800">Notifications</h3>
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-lg text-gray-800">{notification.subject}</h4>
                                            <span className="text-sm text-gray-500">{formatDate(notification.created_at)}</span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{notification.message}</p>
                                        {notification.image && (
                                            <div className="mt-3">
                                                <img 
                                                    src={`http://localhost:5001/${notification.image}`} 
                                                    alt={notification.subject}
                                                    className="max-h-48 rounded-lg object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
