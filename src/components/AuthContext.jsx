import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../contexts/authContext";

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [userdata, setUserdata] = useState(() => {
        const savedData = localStorage.getItem("userdata");
        return savedData ? JSON.parse(savedData) : {};
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Function to update authentication data
    const login = async (data) => {
        try {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userdata", JSON.stringify(data.user));
            setIsAuthenticated(true);
            // console.log("before update in login:");
            // console.log(userdata);
            // console.log("neet to update:");
            // console.log(data);
            // console.log("Processing update:");
            setUserdata(data.user);
            // console.log("after update in login:");
            // console.log(userdata);
        } catch (error) {
            console.error("Error in login:", error);
        }
    };

    // Function to log out
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        setIsAuthenticated(false);        
        setUserdata({});
    };

    const updateuserdata = (data) => {
        localStorage.setItem("userdata", JSON.stringify(data));        
        setUserdata(data);
    };

    // Monitor userdata changes
    useEffect(() => {
        console.log("userdata updated in authcontext:", userdata);
    }, [userdata]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
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
