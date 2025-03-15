import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../contexts/authContext";

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token") || null,
        user_id: localStorage.getItem("user_id") || null,
        name: localStorage.getItem("name") || null,
        kyc_status: localStorage.getItem("kyc_status") || null
    });

    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Function to update authentication data
    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.user_id);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("kyc_status", data.user.kyc_status);
        
        setAuth({
            token: data.token,
            user_id: data.user.user_id,
            name: data.user.name,
            kyc_status: data.user.kyc_status
        });
        setIsAuthenticated(true);
    };

    // Function to update KYC status
    const updateKycStatus = (status) => {
        localStorage.setItem("kyc_status", status);
        setAuth(prev => ({
            ...prev,
            kyc_status: status
        }));
    };

    // Function to log out
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("name");
        localStorage.removeItem("kyc_status");

        setAuth({ token: null, user_id: null, name: null, kyc_status: null });
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout, isAuthenticated, updateKycStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
