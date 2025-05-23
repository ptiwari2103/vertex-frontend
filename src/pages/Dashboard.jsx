import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

function Dashboard() {    
    const { userdata, getagentmembercount, updateuserdata, getpagerefresh, setpagerefresh } = useContext(AuthContext);
    const fetchedRef = useRef(false);
    
    useEffect(() => {
        console.log("dashboard page - component mounted");
        
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/members/getmemberdata`, 
                    { user_id: userdata?.user_id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("response", response);
                if (response.data.success && response.data.data) {
                    updateuserdata(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching updated user information:", error);
            } finally {
                setpagerefresh(false);
            }
        };
        
        const shouldFetch = getpagerefresh() && !fetchedRef.current;
        console.log("getpagerefresh=", getpagerefresh(), "fetchedRef.current=", fetchedRef.current);
        
        if (shouldFetch && userdata?.user_id) {
            console.log("Dashboard - Fetching updated user data");
            fetchedRef.current = true;
            fetchUserData();
        } else {
            console.log("Dashboard - Skipping user data fetch");
        }
        
        return () => {
            console.log("Dashboard component unmounting");
            fetchedRef.current = false;
        };
    }, [getpagerefresh, updateuserdata, setpagerefresh, userdata?.user_id]);
   
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] py-8">
            {/* Show KYC status message */}
            {userdata?.profile?.kyc_status === "Pending" && (
                <div className="w-full max-w-6xl mb-6 px-4">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">KYC Status</h3>
                    <div className="space-y-4">
                        <div className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-lg text-gray-800">KYC Verification Required</h4>
                                    <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-3 py-1 rounded-full">Pending</span>
                                </div>
                                <p className="text-gray-600 mb-4">Your KYC verification is pending. Please complete your KYC to access all features and ensure compliance with our security measures.</p>
                                <div className="mt-2">
                                    <Link 
                                        to="/profileeditform" 
                                        className="inline-flex items-center bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                                    >
                                        Complete KYC Now
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {userdata?.agent?.status==="Approved" && (
                <div className="w-full max-w-6xl mb-6 px-4">
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Agent Status</h3>
                    <div className="space-y-4">
                        <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-lg text-gray-800">Agent Dashboard</h4>
                                    <span className={`text-sm ${userdata.profile.is_agent==="Active" ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"} font-medium px-3 py-1 rounded-full`}>
                                        {userdata.profile.is_agent==="Active" ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    {userdata.profile.is_agent==="Active" 
                                        ? "You are an active agent. You can add new members to the platform and earn commissions." 
                                        : "Your agent account is deactivated. Please contact support for assistance."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center justify-between mt-2">
                                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">
                                        Working Members: <span className="font-semibold">{getagentmembercount()}</span>
                                    </div>
                                    {userdata.profile.is_agent==="Active" && (
                                        <Link 
                                            to="/agent" 
                                            className="inline-flex items-center bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Manage Members
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
