import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import axios from 'axios';

function Dashboard() {    
    const { userdata, updateuserdata, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!localStorage.getItem('token')) {
                    navigate('/');
                    return;
                }

                const response = await axios.post('http://localhost:5001/members/getmemberdata', 
                    { user_id: userdata.user_id },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("Response:", response.data);
                if (response.data.success) {
                    console.log("User data fetched successfully:", response.data.data);
                    updateuserdata(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log("Token expired or invalid, logging out");
                    logout();
                    navigate('/');
                }
            }
        };

        fetchUserData();
    }, [userdata.id, updateuserdata, logout, navigate]);
   
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
        </div>
    );
}

export default Dashboard;
