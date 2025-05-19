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
        <div className="flex flex-col justify-start items-center min-h-[calc(100vh-64px)] pt-0 pb-8">
            {/* Wallet Boxes - All 4 in a single row */}
            <div className="w-full max-w-6xl mb-6 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* CD Wallet Box */}
                    <Link to="/cd-wallet" className="transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg overflow-hidden cursor-pointer h-full">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">CD Wallet</h3>
                                        <p className="text-blue-100 text-xs">Certificate of Deposit</p>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-white text-xl font-bold">₹{userdata?.cd_wallet?.balance || '0.00'}</div>
                                    <div className="text-blue-100 text-xs mt-1">Available Balance</div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* FD Wallet Box */}
                    <Link to="/fd-wallet" className="transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg overflow-hidden cursor-pointer h-full">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">FD Wallet</h3>
                                        <p className="text-green-100 text-xs">Fixed Deposit</p>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-white text-xl font-bold">₹{userdata?.fd_wallet?.balance || '0.00'}</div>
                                    <div className="text-green-100 text-xs mt-1">Available Balance</div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* RD Wallet Box */}
                    <Link to="/rd-wallet" className="transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg shadow-lg overflow-hidden cursor-pointer h-full">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">RD Wallet</h3>
                                        <p className="text-amber-100 text-xs">Recurring Deposit</p>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-white text-xl font-bold">₹{userdata?.rd_wallet?.balance || '0.00'}</div>
                                    <div className="text-amber-100 text-xs mt-1">Available Balance</div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* OD Wallet Box */}
                    <Link to="/od-wallet" className="transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg overflow-hidden cursor-pointer h-full">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">OD Wallet</h3>
                                        <p className="text-purple-100 text-xs">Overdraft Account</p>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-white text-xl font-bold">₹{userdata?.od_wallet?.balance || '0.00'}</div>
                                    <div className="text-purple-100 text-xs mt-1">Available Balance</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
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
