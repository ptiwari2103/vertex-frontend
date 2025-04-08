import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../contexts/authContext";

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [userdata, setUserdata] = useState({});
    
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Function to update authentication data
    const login = async (data) => {
        try {
            localStorage.setItem("token", data.token);
            setIsAuthenticated(true);
            setUserdata(data.user);
        } catch (error) {
            console.error("Error in login:", error);
        }
    };

    // Function to log out
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);        
        setUserdata({});
    };

    const updateuserdata = (data) => {
        setUserdata(data);
    };

   
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUserdata({});
            }
        } catch (error) {
            console.error("Error in auth check:", error);
            setIsAuthenticated(false);
            setUserdata({});
        }
    }, []);
    

    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated, userdata, updateuserdata }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
