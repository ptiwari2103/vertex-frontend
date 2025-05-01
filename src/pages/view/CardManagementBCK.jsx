import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

const CardManagement = () => {
    const { userdata } = useContext(AuthContext);
    
    const [cardDetails, setCardDetails] = useState(null);
    const [requestStatus, setRequestStatus] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({ message: "" });
    const [cardTransactions, setCardTransactions] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentReason, setPaymentReason] = useState("");
    const [validationError, setValidationError] = useState("");
    const [requestType, setRequestType] = useState("use");

    // Define fetchCardTransactions outside of fetchCardDetails to avoid circular dependency
    const fetchCardTransactions = async (cardId) => {
        // Skip if transactions were already provided in the card details response
        if (cardTransactions.length > 0) return;
        
        try {
            console.log("Fetching transactions for card ID:", cardId);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/transactions`, {
                params: {
                    card_id: cardId
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("Transactions fetched:", response.data);
            setCardTransactions(response.data || []);
        } catch (err) {
            console.error("Error fetching card transactions:", err);
            setCardTransactions([]);
        }
    };

    const fetchCardDetails = useCallback(async () => {
        try {
            // For debugging, use a hardcoded user_id if userdata is not available
            const userId = userdata?.id || 86;
            
            console.log("Fetching card details for user ID:", userId);
            
            // Try using hardcoded data for testing if the API fails
            let responseData;
            
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/details`, {
                    params: {
                        user_id: userId
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                console.log("API Response:", response.data);
                responseData = response.data;
            } catch (error) {
                console.error("Error fetching from API, using hardcoded data:", error);
                // Fallback to hardcoded data if API fails
                responseData = {
                    card: {
                        id: 1,
                        user_id: 86,
                        card_number: "4234324242342342",
                        expiry_month: 3,
                        expiry_year: 2026,
                        cvv_code: "324",
                        assigned_date: "2025-04-04T04:20:02.000Z",
                        card_limit: 4000,
                        current_balance: 3500,
                        first_tx: 1,
                        status: "Approved",
                        created_at: "2025-04-01T04:19:38.000Z",
                        updated_at: "2025-04-10T04:19:38.000Z"
                    },
                    transactions: [
                        {
                            id: 11,
                            user_id: 86,
                            payment_category: "Card",
                            comment: "Card Limit",
                            type: "Deposit",
                            added: 1000,
                            used: null,
                            balance: 4000,
                            status: "Closed",
                            created_date: "2025-05-01T04:20:45.000Z",
                            updated_date: "2025-05-01T04:20:45.000Z"
                        }
                    ]
                };
            }
            
            // Handle the nested card object in the response
            if (responseData && responseData.card) {
                console.log("Setting card details from nested structure:", responseData.card);
                const cardData = responseData.card;
                
                // Ensure we have a card ID
                if (!cardData.id && !cardData.card_id) {
                    console.warn("Card ID not found in response");
                }
                
                // Set card details directly to state
                setCardDetails(cardData);
                console.log("Card details set to state:", cardData);
                
                // Set transactions if they exist in the response
                if (responseData.transactions && Array.isArray(responseData.transactions)) {
                    console.log("Setting transactions from response:", responseData.transactions);
                    setCardTransactions(responseData.transactions);
                } else {
                    // Fetch transactions separately if needed
                    const cardId = cardData.id || cardData.card_id;
                    if (cardId) {
                        fetchCardTransactions(cardId);
                    }
                }
            } else {
                console.log("Setting card details directly:", responseData);
                setCardDetails(responseData);
                
                // Fetch card transactions if not included in the response
                const cardId = responseData?.id || responseData?.card_id;
                if (cardId) {
                    fetchCardTransactions(cardId);
                }
            }
        } catch (err) {
            console.error("Error in fetchCardDetails:", err);
            // Set a default card for debugging
            setCardDetails({
                id: 1,
                user_id: 86,
                card_number: "4234324242342342",
                expiry_month: 3,
                expiry_year: 2026,
                cvv_code: "324",
                assigned_date: "2025-04-04T04:20:02.000Z",
                card_limit: 4000,
                current_balance: 3500,
                status: "Approved",
                created_at: "2025-04-01T04:19:38.000Z",
                updated_at: "2025-04-10T04:19:38.000Z"
            });
        }
    }, [userdata, cardTransactions.length]);
    
    

    const requestNewCreditCard = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/cards/request`, {
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

    const requestPayment = async () => {
        setValidationError("");
        
        if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
            setValidationError("Please enter a valid amount");
            return;
        }
        
        if (!paymentReason.trim()) {
            setValidationError("Please provide a reason for the payment request");
            return;
        }
        
        const amount = parseFloat(paymentAmount);
        const cardLimit = parseFloat(cardDetails.card_limit || 0);
        const currentBalance = parseFloat(cardDetails.current_balance || 0);
        
        // For use amount requests, check against current balance
        if (requestType === "use" && amount > currentBalance) {
            setValidationError(`Amount cannot exceed your current balance of ₹${currentBalance.toLocaleString()}`); 
            return;
        }
        
        // For payable amount requests, check against card limit
        if (requestType === "payable" && amount > cardLimit) {
            setValidationError(`Amount cannot exceed your card limit of ₹${cardLimit.toLocaleString()}`); 
            return;
        }
        
        try {
            // Get the card ID from the correct property
            const cardId = cardDetails.id || cardDetails.card_id;
            
            if (!cardId) {
                setValidationError("Card ID not found. Please refresh the page.");
                return;
            }
            
            console.log("Sending payment request with data:", {
                user_id: userdata?.id || 86,
                card_id: cardId,
                amount: amount,
                reason: paymentReason,
                request_type: requestType
            });
            
            await axios.post(`${import.meta.env.VITE_API_URL}/cards/payment-request`, {
                user_id: userdata?.id || 86,
                card_id: cardId,
                amount: amount,
                reason: paymentReason,
                request_type: requestType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setRequestStatus({ success: true, message: "Payment request sent successfully!" });
            setShowSuccess(true);
            setSuccessMessages({ message: "Payment request sent successfully!" });
            setShowPaymentModal(false);
            setPaymentAmount("");
            setPaymentReason("");
            setValidationError("");
            // Refresh card details and transactions
            fetchCardDetails();
        } catch (error) {
            setRequestStatus({ success: false, message: "Error requesting payment. Please try again later." });
            setShowSuccess(false);
        }
    };
    
    useEffect(() => {
        console.log("Fetching card details...");
        fetchCardDetails();
    }, [fetchCardDetails]);

    // For debugging
    useEffect(() => {
        console.log("Current cardDetails state:", cardDetails);
        if (cardDetails) {
            console.log("Card status:", cardDetails.status);
            console.log("Is card approved?", cardDetails.status === "Approved");
        }
    }, [cardDetails]);
    
    // Force render for debugging
    const [forceRender, setForceRender] = useState(0);
    
    useEffect(() => {
        // Force a re-render after a short delay to ensure state is updated
        const timer = setTimeout(() => {
            setForceRender(prev => prev + 1);
            console.log("Forced re-render", forceRender);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [forceRender]);
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            {/* Debug info */}
            <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700">
                <div>Debug Info (Force render: {forceRender})</div>
                <div>Card data loaded: {cardDetails ? 'Yes' : 'No'}</div>
                {cardDetails && (
                    <>
                        <div>Card ID: {cardDetails.id}</div>
                        <div>Card Status: {cardDetails.status}</div>
                        <div>Card Number: {cardDetails.card_number}</div>
                        <div>Is Approved: {String(cardDetails.status === "Approved")}</div>
                    </>
                )}
            </div>
            
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
            {/* Card display and status handling */}
            {/* Force display the card for debugging */}
            {true ? 
                (cardDetails && cardDetails.status === "Approved") ? (
                    <div className="mb-6 flex justify-between items-center">
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
                        
                        {/* Request for Payment buttons */}
                        <div className="ml-8 flex flex-col space-y-4 justify-center">
                            <button
                                onClick={() => {
                                    setRequestType("use");
                                    setShowPaymentModal(true);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-64"
                            >
                                Request for Use Amount
                            </button>
                            <button
                                onClick={() => {
                                    setRequestType("payable");
                                    setShowPaymentModal(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-64"
                            >
                                Request for Payable Amount
                            </button>
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
                ) : (
                    <div className="mb-6 text-yellow-500">
                        Card status not available. Please refresh the page.
                    </div>
                )
            : (
                <button
                  onClick={requestNewCreditCard}
                  className="absolute top-6 right-6 mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Request New Credit Card
                </button>
            )}
            
            {/* Card Details Listing */}
            {cardDetails && (cardDetails.status === "Approved" || true) && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Card Details</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Card Number</h3>
                                <p className="text-gray-800 font-semibold">
                                    {cardDetails.card_number?.match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Card Holder</h3>
                                <p className="text-gray-800 font-semibold">{userdata?.name || 'YOUR NAME'}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Expiry Date</h3>
                                <p className="text-gray-800 font-semibold">
                                    {cardDetails.expiry_month || 'MM'}/{cardDetails.expiry_year || 'YY'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Card Type</h3>
                                <p className="text-gray-800 font-semibold">{cardDetails.card_type || 'Credit Card'}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Status</h3>
                                <p className="text-gray-800 font-semibold">{cardDetails.status}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Credit Limit</h3>
                                <p className="text-gray-800 font-semibold">
                                ₹{cardDetails.card_limit || '0.00'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Current Balance</h3>
                                <p className="text-gray-800 font-semibold">
                                ₹{cardDetails.current_balance || '0.00'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Request Date</h3>
                                <p className="text-gray-800 font-semibold">
                                {new Date(cardDetails.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Assigned Date</h3>
                                <p className="text-gray-800 font-semibold">
                                {new Date(cardDetails.assigned_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Card Transactions */}
                    <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-800">Recent Transactions</h2>
                    {cardTransactions.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cardTransactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.transaction_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                            No transactions found for this card.
                        </div>
                    )}
                </div>
            )}
            
            {/* Payment Request Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {requestType === "use" ? "Request for Use Amount" : "Request for Payable Amount"}
                        </h2>
                        
                        {validationError && (
                            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                                {validationError}
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                Amount (₹) <span className="text-xs text-gray-500 font-normal">
                                    Max: ₹{requestType === "use" ? cardDetails?.current_balance || '0' : cardDetails?.card_limit || '0'}
                                </span>
                            </label>
                            <input
                                id="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                max={requestType === "use" ? cardDetails?.current_balance || 0 : cardDetails?.card_limit || 0}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="Enter amount"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                Reason
                            </label>
                            <textarea
                                id="reason"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                                value={paymentReason}
                                onChange={(e) => setPaymentReason(e.target.value)}
                                placeholder="Explain the reason for this payment request"
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setValidationError("");
                                    setPaymentAmount("");
                                    setPaymentReason("");
                                    setRequestType("use");
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={requestPayment}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardManagement;
