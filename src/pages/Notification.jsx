import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

const Notification = () => {
       
    const { userdata } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const fetchedRef = useRef(false);

    const fetchNotifications = useCallback(async () => {
        if (!userdata?.id) return;
        
        try {
            const response = await axios.get(`http://localhost:5001/messages/notification/${userdata.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data?.data) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [userdata?.id]);

    useEffect(() => {
        if (!fetchedRef.current && userdata?.id) {
            fetchedRef.current = true;
            fetchNotifications();
        }
    }, [userdata?.id, fetchNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            const response = await axios.post(
                `http://localhost:5001/messages/mark-as-read`,
                { 
                    message_id: notificationId,
                    user_id: userdata.id 
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            
            if (response.data.success) {
                // Update the notification in the local state
                setNotifications(prevNotifications => 
                    prevNotifications.map(notification => 
                        notification.id === notificationId 
                            ? { ...notification, read_status: 'Read' } 
                            : notification
                    )
                );
                
                // Reload the notification count in the header
                window.dispatchEvent(new CustomEvent('notification-read'));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

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
                        <div className="space-y-6">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className={`bg-white border-l-4 
                                        ${notification.read_status === 'Unread' 
                                            ? 'border-red-500 shadow-lg scale-105 cursor-pointer hover:bg-red-50 font-bold' 
                                            : 'border-blue-500'} 
                                        rounded-lg shadow-md overflow-hidden transition-all duration-300 mb-4
                                        ${notification.read_status === 'Unread' ? 'ring-2 ring-red-300' : ''}`}
                                    onClick={() => notification.read_status === 'Unread' && markAsRead(notification.id)}
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-semibold text-lg ${notification.read_status === 'Unread' ? 'text-red-700' : 'text-gray-800'}`}>
                                                {notification.subject}
                                                {notification.read_status === 'Unread' && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                                        New
                                                    </span>
                                                )}
                                            </h4>
                                            <span className="text-sm text-gray-500">{formatDate(notification.created_at)}</span>
                                        </div>
                                        <p className={`${notification.read_status === 'Unread' ? 'text-black font-medium' : 'text-gray-600'} mb-3`}>{notification.message}</p>
                                        {notification.image && (
                                            <div className="mt-3">
                                                <img 
                                                    src={`http://localhost:5001/${notification.image}`} 
                                                    alt="Notification" 
                                                    className="max-w-full h-auto rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {notifications.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No notifications to display</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
