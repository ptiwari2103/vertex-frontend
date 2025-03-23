import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

function Dashboard() {    
    const { userdata } = useContext(AuthContext);

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
            {/* Show this message only if kyc_status is not true (i.e., 0 or false) */}
            {console.log("===="+userdata?.profile?.kyc_status)}

            {userdata?.profile?.kyc_status ==="Pending" && (
                <div className="text-center">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg shadow-lg max-w-lg mb-4">
                        <p className="font-bold text-xl mb-2">KYC Status: Pending</p>
                        <p className="text-lg mb-4">Your KYC is pending. Please complete your KYC to access all features.</p>
                        <Link 
                            to="/kycform" 
                            className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                        >
                            Complete KYC Now
                        </Link>
                    </div>
                </div>
            )}            
        </div>
    );
}

export default Dashboard;
