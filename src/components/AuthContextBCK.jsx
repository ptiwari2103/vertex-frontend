import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../contexts/authContext";

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [userdata, setUserdata] = useState(() => {
        try {
            const savedData = localStorage.getItem("userdata");
            return savedData && savedData !== "undefined" ? JSON.parse(savedData) : {};
        } catch (error) {
            console.error("Error parsing userdata from localStorage:", error);
            return {};
        }
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Function to update authentication data
    const login = async (data) => {
        try {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userdata", JSON.stringify(data.user));
            setIsAuthenticated(true);
            setUserdata(data.user);
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
    // useEffect(() => {
    //     console.log("userdata updated in authcontext:", userdata);
    // }, [userdata]);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     setIsAuthenticated(!!token);
    // }, []);


    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const tmp_userdata = localStorage.getItem("userdata");
            if (tmp_userdata && token && 
                tmp_userdata !== "undefined" && 
                tmp_userdata !== "null" && 
                tmp_userdata !== "" && 
                tmp_userdata !== "{}" && 
                tmp_userdata !== "[]") {
                const parsedUserData = JSON.parse(tmp_userdata);
                if (Object.keys(parsedUserData).length > 0) {
                    setIsAuthenticated(true);
                    setUserdata(parsedUserData);
                    return;
                }
            }
            // If any condition fails, clear the auth state
            setIsAuthenticated(false);
            setUserdata({});
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