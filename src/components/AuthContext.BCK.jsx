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

    const [userdata, setuserdata] = useState(localStorage.getItem("userdata") || {});

    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Function to update authentication data
    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.user_id);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("kyc_status", data.user.profile.kyc_status);
        localStorage.setItem("userdata", JSON.stringify(data.user));

        setAuth({
            token: data.token,
            user_id: data.user.user_id,
            name: data.user.name,
            kyc_status: data.user.profile.kyc_status
        });
        setuserdata(data.user);
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
        localStorage.removeItem("userdata");

        setAuth({ token: null, user_id: null, name: null, kyc_status: null });
        setIsAuthenticated(false);
        setuserdata({});
    };

    const updateuserdata = (data) => {
        const jsondata = JSON.parse(data);
        console.log("updateuserdata function called");
        console.log(jsondata);
        console.log(userdata);
        // setuserdata(prev => ({
        //     ...prev,
        //     profile: {
        //         ...prev.profile,
        //         aadhar_number: jsondata.aadhar_number,
        //         pan_number: jsondata.pan_number,
        //         pan_number_image: jsondata.pan_number_image,
        //         aadhar_number_image_front: jsondata.aadhar_number_image_front,
        //         aadhar_number_image_back: jsondata.aadhar_number_image_back,
        //         kyc_status: jsondata.kyc_status
        //     }
        // }));
        // console.log("after updateuserdata function called");
        // console.log(userdata);
        // localStorage.setItem("userdata", JSON.stringify(userdata));
        // console.log("after localStorage.setItem");
        // console.log(localStorage.getItem("userdata"));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout, isAuthenticated, updateKycStatus, userdata, updateuserdata }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
