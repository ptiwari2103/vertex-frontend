import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/authContext';

const HeaderMenu = () => {
    const navigate = useNavigate();
    const { userdata, isAuthenticated, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    console.log("Auth Context in HeaderMenu:", userdata, isAuthenticated);

    useEffect(() => {
        if(!userdata.id && isAuthenticated) {
            logout();
            navigate('/');
        }
    }, [userdata, navigate, logout, isAuthenticated]);

    const profileImageUrl = userdata?.profile?.profile_image ? `http://localhost:5001/${userdata.profile.profile_image}` : null;
    
    return (
        <nav className="bg-blue-500 p-3 text-white w-full flex justify-between items-center">
            {isAuthenticated ? (
                <>
                    <ul className="flex space-x-6">
                        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Dashboard</NavLink></li>
                        <li><NavLink to="/profileeditform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Profile Edit Form</NavLink></li>
                        <li><NavLink to="/profileviewform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Profile View Form</NavLink></li>
                        <li><NavLink to="/pinmanagement" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Pin Management</NavLink></li>
                        <li><NavLink to="/cardmanagement" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Credit Card</NavLink></li>   
                        <li><NavLink to="/franchise" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Franchise</NavLink></li>   
                        <li><NavLink to="/agent" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Agent</NavLink></li> 
                        <li><NavLink to="/notification" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Notification</NavLink></li> 
                    </ul>
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {profileImageUrl ? (
                                <img 
                                    src={profileImageUrl} 
                                    alt="Profile" 
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white">
                                    <span className="text-gray-600 text-sm">{userdata?.name?.charAt(0) || "U"}</span>
                                </div>
                            )}
                            <span className="hidden sm:block ml-2">{userdata?.name || "N/A"}</span>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
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
                    <NavLink to="/login" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">Login</NavLink>
                </>
            )}
        </nav>
    );
};

export default HeaderMenu;
