import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";

const HeaderMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/', { replace: true });
    };

    return (
        <nav className="bg-blue-500 p-3 text-white w-full flex justify-between items-center">
            {auth.user_id ? (
                <>
                    <ul className="flex space-x-6">
                        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Dashboard</NavLink></li>
                        <li><NavLink to="/kycform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>KYC Form</NavLink></li>
                        <li><NavLink to="/bankform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Bank Form</NavLink></li>
                        <li><NavLink to="/profileform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Profile Form</NavLink></li>
                        <li><NavLink to="/profileeditform" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "hover:text-gray-300"}>Profile Edit Form</NavLink></li>
                    </ul>
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="hidden sm:block">{auth.name}</span>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                                <ul className="flex flex-col">
                                    <li>
                                        <NavLink
                                            to="/profile"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button
                                            className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
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
