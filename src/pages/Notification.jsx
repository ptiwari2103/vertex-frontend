import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

const Notification = () => {
       
    const { userdata, setnotification } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const fetchedRef = useRef(false);
    const [viewingNotification, setViewingNotification] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!userdata?.id) return;
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/notification/${userdata.id}`, {
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
                `${import.meta.env.VITE_API_URL}/messages/mark-as-read`,
                { 
                    message_user_id: notificationId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                // Update the notification in the local state
                const updatedNotifications = notifications.map(notification => 
                    notification.message_user_id === notificationId 
                        ? { ...notification, read_status: 'Read' } 
                        : notification
                );
                
                setNotifications(updatedNotifications);
                
                // Calculate new unread count
                const newUnreadCount = updatedNotifications.filter(
                    notification => notification.read_status === 'Unread'
                ).length;
                
                // Update the count in AuthContext
                setnotification(newUnreadCount);
                
                // Dispatch event with the new count
                window.dispatchEvent(new CustomEvent('notification-read', {
                    detail: { unreadCount: newUnreadCount }
                }));
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
                                        ${notification.read_status === 'Unread' ? 'ring-2 ring-red-300' : ''}
                                    `}
                                    onClick={() => {
                                        if (notification.read_status === 'Unread') {
                                            markAsRead(notification.message_user_id);
                                        }
                                        setViewingNotification(notification.message_user_id);
                                    }}
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
                                        <div className={`transition-all duration-300 ${notification.read_status === 'Unread' && viewingNotification !== notification.message_user_id ? 'blur-sm' : ''}`}>
                                            <p className={`${notification.read_status === 'Unread' ? 'text-black font-medium' : 'text-gray-600'} mb-3`}>{notification.message}</p>
                                            {notification.image && (
                                                <div className="mt-3">
                                                    <img 
                                                        src={`${import.meta.env.VITE_API_URL}/${notification.image}`} 
                                                        alt="Notification" 
                                                        className="max-w-full h-auto rounded"
                                                    />
                                                </div>
                                            )}
                                        </div>
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
