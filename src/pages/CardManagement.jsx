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
                    <div className="mb-6">
                        <h2>Card Details</h2>
                        <p>Card Number: {cardDetails.number}</p>
                        <p>Expiry Date: {cardDetails.expiry}</p>
                        <p>Card Holder: {cardDetails.holder}</p>
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
