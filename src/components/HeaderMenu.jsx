import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';

const HeaderMenu = () => {
    const navigate = useNavigate();
    const { userdata, isAuthenticated, logout, getnotification, setnotification } = useContext(AuthContext);
    
    // Initialize totalNotification with 0, will be updated in useEffect
    const [totalNotification, setTotalNotification] = useState(0);
    
    // Update totalNotification when component mounts and when getnotification changes
    useEffect(() => {
        const updateNotificationCount = async () => {
            const count = await getnotification();
            setTotalNotification(count);
        };
        
        updateNotificationCount();
    }, [getnotification]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    //console.log("Auth Context in HeaderMenu:", userdata, isAuthenticated, localStorage.getItem("token"));

    useEffect(() => {
        if(!userdata.id && isAuthenticated) {
            logout();
            navigate('/');
        }
    }, [userdata, navigate, logout, isAuthenticated]);

    // Fetch unread notification count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!userdata?.id) return;
            
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/unread-count/${userdata.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                //console.log("Unread count response:", response.data);
                
                if (response.data?.success && response.data?.data?.count !== undefined) {
                    setTotalNotification(response.data.data.count);
                    setnotification(response.data.data.count);
                }
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };
        
        // Initial fetch
        fetchUnreadCount();
        
        // Set up interval to fetch every 30 seconds
        const intervalId = setInterval(fetchUnreadCount, 30000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [userdata, setnotification]);
    

    // Listen for custom notification events
    useEffect(() => {
        const handleNotificationUpdate = () => {
            // Fetch updated notification count
            getnotification().then(count => {
                setTotalNotification(count);
            });
        };
        
        // Add event listener
        window.addEventListener('notification-read', handleNotificationUpdate);
        
        // Clean up
        return () => {
            window.removeEventListener('notification-read', handleNotificationUpdate);
        };
    }, [getnotification]);
    
    // Get profile image URL
    const profileImageUrl = userdata?.profile?.profile_image 
        ? `${import.meta.env.VITE_API_URL}/${userdata.profile.profile_image}` 
        : null;

    return (
        <nav className="bg-blue-500 p-3 text-white w-full flex justify-between items-center">
            {isAuthenticated ? (
                <>
                    <ul className="flex space-x-6">
                        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Dashboard</NavLink></li>
                        {userdata?.is_edit !== "Approved" && (
                            <li><NavLink to="/profileeditform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Profile Edit</NavLink></li>
                        )}
                        <li><NavLink to="/profileviewform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Profile View</NavLink></li>
                        <li><NavLink to="/pinmanagement" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Pin Management</NavLink></li>
                        <li><NavLink to="/cardmanagement" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Credit Card</NavLink></li>   
                        {userdata?.profile?.is_fanchise === "Active" && (
                            <li><NavLink to="/franchise" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Franchise</NavLink></li>   
                        )}
                        
                        {userdata?.is_edit === "Approved" ? (
                            <li><NavLink to="/agent" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Agent</NavLink></li>
                        ) : (
                            <li><span className="text-gray-400 cursor-not-allowed" title="Requires approval">Agent</span></li>
                        )}
                        
                        <li className="relative">
                            <NavLink to="/notification" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>
                                Notification
                                {totalNotification > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalNotification > 9 ? '9+' : totalNotification}
                                    </span>
                                )}
                            </NavLink>
                        </li>

                        <li className="relative">
                            <NavLink to="/referral" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>
                                Member Fees
                            </NavLink>
                        </li> 
                    </ul>
                    <div className="relative">
                        <div className="flex items-center space-x-3">
                            {profileImageUrl ? (
                                <img 
                                    src={profileImageUrl} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white">
                                    <span className="text-gray-600 text-sm">{userdata?.name?.charAt(0) || "U"}</span>
                                </div>
                            )}
                            <span className="hidden sm:block">
                                {userdata?.name || "N/A"}
                                <br />
                                User ID: {userdata?.user_id || ""}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="ml-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <ul className="flex space-x-6">
                        <li><NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Home</NavLink></li>
                        <li><NavLink to="/about" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>About</NavLink></li>
                        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Contact</NavLink></li>
                        <li><NavLink to="/register" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Register</NavLink></li>
                    </ul>
                    <NavLink to="/logindistributor" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">Gift Distributor</NavLink>
                    <NavLink to="/login" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">Login</NavLink>
                </>
            )}
        </nav>
    );
};

export default HeaderMenu;
