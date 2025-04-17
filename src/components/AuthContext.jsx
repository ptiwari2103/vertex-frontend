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

    const [unreadCount, setUnreadCount] = useState(0);

    const [agentmembercount, setAgentmembercount] = useState(localStorage.getItem("agentmembercount") || 0);

    const getnotification = async () =>{
        return unreadCount;
    }
    const setnotification = async (count) =>{
        console.log("notification count = ",count)
        setUnreadCount(count);
    }

    // Function to update authentication data
    const login = async (data) => {
        try {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userdata", JSON.stringify(data.user));
            setIsAuthenticated(true);
            setUserdata(data.user);
            localStorage.setItem("agentmembercount", data.user.agentmembercount || 0);
            setAgentmembercount(data.user.agentmembercount || 0);
        } catch (error) {
            console.error("Error in login:", error);
        }
    };

    // Function to log out
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        localStorage.removeItem("agentmembercount");
        setIsAuthenticated(false);        
        setUserdata({});
        setAgentmembercount(0);
    };

    const updateuserdata = (data) => {
        localStorage.setItem("userdata", JSON.stringify(data));        
        setUserdata(data);
        localStorage.setItem("agentmembercount", data.agentmembercount); 
        setAgentmembercount(data.agentmembercount || 0);
    };

    const getagentmembercount = () => {
        const agentmembercountvalue = parseInt(agentmembercount - import.meta.env.VITE_AGENT_WORKING_MEMBER_START || 0)
        return agentmembercountvalue;
    }

    const updateagentmembercount = (count) => {
        setAgentmembercount(count);
    }

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
        <AuthContext.Provider value={{ login, logout, isAuthenticated, userdata, updateuserdata, getnotification, setnotification, getagentmembercount, updateagentmembercount }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;