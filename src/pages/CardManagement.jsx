import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

const CardManagement = () => {
    const { userdata } = useContext(AuthContext);
    
    const [cardDetails, setCardDetails] = useState(null);
    const [requestStatus, setRequestStatus] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({ message: "" });

    const fetchCardDetails = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5001/cards/details`, {
                params: {
                    user_id: userdata?.id
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("Card details:", response.data);
            setCardDetails(response.data);
        } catch (err) {
            console.error("Error fetching card details:", err);
            setCardDetails(null);
        }
    }, [userdata]);

    const requestNewCreditCard = async () => {
        try {
            await axios.post(`http://localhost:5001/cards/request`, {
                user_id: userdata?.user_id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setRequestStatus({ success: true, message: "Credit card request successful!" });
            setShowSuccess(true);
            setSuccessMessages({ message: "Credit card request successful!" });
        } catch (err) {
            setRequestStatus({ success: false, message: "Error requesting new credit card. Please try again later." });
            setShowSuccess(false);
            setSuccessMessages({ message: "Error requesting new credit card. Please try again later." });
        }
    };

    useEffect(() => {
        fetchCardDetails();
    }, [fetchCardDetails]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            {showSuccess && (
                <div className="mb-4 text-green-500">
                    {successMessages.message}
                </div>
            )}
            {!showSuccess && requestStatus && (
                <div className="mb-4 text-red-500">
                    {requestStatus.message}
                </div>
            )}
            {cardDetails ? (
                cardDetails.status === "Approved" ? (
                    <div className="mb-6 flex justify-center">
                        <div className="w-96 h-56 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
                            {/* Card chip */}
                            <div className="w-12 h-10 bg-yellow-300 rounded-md mb-6"></div>
                            
                            {/* Card number */}
                            <div className="text-white text-xl font-mono tracking-wider mb-4">
                                {cardDetails.card_number?.match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••'}
                            </div>
                            
                            {/* Expiry date */}
                            <div className="flex items-center">
                                <div className="mr-6">
                                    <div className="text-gray-300 text-xs uppercase">Valid Thru</div>
                                    <div className="text-white font-mono">
                                        {cardDetails.expiry_month || 'MM'}/{cardDetails.expiry_year || 'YY'}
                                    </div>
                                </div>
                                
                                {/* Card holder name */}
                                <div>
                                    <div className="text-gray-300 text-xs uppercase">Card Holder</div>
                                    <div className="text-white font-mono">{userdata?.name || 'YOUR NAME'}</div>
                                </div>
                            </div>
                            
                            {/* Card network logo - positioned in bottom right */}
                            <div className="absolute bottom-4 right-6">
                                <svg className="w-12 h-12 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                </svg>
                            </div>
                            
                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white opacity-10"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white opacity-10"></div>
                        </div>
                    </div>
                ) : cardDetails.status === "Pending" ? (
                    <div className="mb-6 text-yellow-500">
                        Your request is pending.
                    </div>
                ) : cardDetails.status === "Rejected" ? (
                    <div className="mb-6 text-red-500">
                        Your card request was rejected.
                    </div>
                ) : cardDetails.status === "Blocked" ? (
                    <div className="mb-6 text-red-500">
                        Your card is blocked.
                    </div>
                ) : null
            ) : (
                <button
                  onClick={requestNewCreditCard}
                  className="absolute top-6 right-6 mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Request New Credit Card
                </button>
            )}
        </div>
    );
};

export default CardManagement;
