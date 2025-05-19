import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

const CDWallet = () => {
    const { userdata } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);
    const [validationError, setValidationError] = useState("");
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    
    // Filter state
    const [filterDate, setFilterDate] = useState("");
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const fetchTransactions = async (page = currentPage, limit = itemsPerPage, filters = {}) => {
        try {
            setLoading(true);
            const params = {
                user_id: userdata?.id,
                page,
                limit
            };
            
            // Add date filter if provided
            if (filters.date) params.date = filters.date;
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/members/cd-transactions`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            if (response.data.success) {
                setTransactions(response.data.transactions || []);
                setTotalItems(response.data.total || response.data.transactions?.length || 0);
            } else {
                setError(response.data.message || "Failed to fetch transactions");
            }
        } catch (err) {
            console.error("Error fetching CD wallet transactions:", err);
            setError("An error occurred while fetching transactions");
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchTransactions(newPage, itemsPerPage, isFilterApplied ? { date: filterDate } : {});
    };
    
    // Handle filter application
    const handleFilterApply = (e) => {
        e.preventDefault();
        if (filterDate) {
            setIsFilterApplied(true);
            setCurrentPage(1); // Reset to first page when filter is applied
            fetchTransactions(1, itemsPerPage, { date: filterDate });
        }
    };
    
    // Handle filter reset
    const handleFilterReset = () => {
        setFilterDate("");
        setIsFilterApplied(false);
        setCurrentPage(1);
        fetchTransactions(1, itemsPerPage, {});
    };

    useEffect(() => {
        if (userdata?.id) {
            fetchTransactions(currentPage, itemsPerPage, isFilterApplied ? { date: filterDate } : {});
        }
    }, [userdata?.id]); // Only depend on userdata.id to prevent infinite loops

    // Handle payment submission
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");

        // Validate inputs
        if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
            setValidationError("Please enter a valid amount");
            return;
        }

        if (!paymentMethod) {
            setValidationError("Please select a payment method");
            return;
        }

        try {
            setProcessingPayment(true);
            
            // Here you would normally make an API call to your backend
            // to initiate the payment process
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/payments/initiate`, {
                user_id: userdata?.id,
                amount: parseFloat(paymentAmount),
                payment_method: paymentMethod,
                wallet_type: "cd"
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            if (response.data.success && response.data.payment_url) {
                // Redirect to the third-party payment page
                window.location.href = response.data.payment_url;
            } else {
                setValidationError(response.data.message || "Failed to initiate payment");
                setProcessingPayment(false);
            }
        } catch (err) {
            console.error("Error initiating payment:", err);
            setValidationError("An error occurred while processing your payment request");
            setProcessingPayment(false);
        }
    };
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header with wallet info */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-white font-bold text-2xl">CD Wallet</h1>
                            <p className="text-blue-100 text-sm">Certificate of Deposit Account</p>
                        </div>
                        
                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="bg-white text-blue-700 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 font-medium"
                        >
                            Payment
                        </button>
                    </div>
                </div>
                
                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                            
                            {/* Date Filter */}
                            <div className="w-full md:w-auto">
                                <form onSubmit={handleFilterApply} className="flex flex-col md:flex-row gap-2">
                                    <div>
                                        <label htmlFor="filterDate" className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                                        <input 
                                            type="date" 
                                            id="filterDate"
                                            className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button 
                                            type="submit" 
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            Filter
                                        </button>
                                        {isFilterApplied && (
                                            <button 
                                                type="button" 
                                                onClick={handleFilterReset}
                                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-gray-600">Loading transactions...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-500">
                            {error}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No transactions found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Day Rate</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Interval</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty Paid Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.deposit_date || transaction.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                ₹ {transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.payment_method || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.transaction_id || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.per_day_rate || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.payment_interval || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.interest_amount || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.penality_paid_amount || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.total_amount || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${transaction.status.toLowerCase() === 'completed' || transaction.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 
                                                    transaction.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{transactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            Previous
                                        </button>
                                        
                                        {/* Page numbers */}
                                        {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1)
                                            .filter(page => {
                                                // Show current page, first page, last page, and pages around current page
                                                const lastPage = Math.ceil(totalItems / itemsPerPage);
                                                return page === 1 || page === lastPage || 
                                                    (page >= currentPage - 1 && page <= currentPage + 1);
                                            })
                                            .map((page, index, array) => {
                                                // Add ellipsis if there are gaps
                                                const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                                                const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                                                
                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsisBefore && (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md">...</span>
                                                        )}
                                                        
                                                        <button
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                        >
                                                            {page}
                                                        </button>
                                                        
                                                        {showEllipsisAfter && (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md">...</span>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                                            className={`px-3 py-1 rounded-md ${currentPage >= Math.ceil(totalItems / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Make a Payment</h2>
                        
                        {validationError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                                {validationError}
                            </div>
                        )}
                        
                        <form onSubmit={handlePaymentSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                    Amount (₹)
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_method">
                                    Payment Method
                                </label>
                                <select
                                    id="payment_method"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select payment method</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="net_banking">Net Banking</option>
                                    <option value="wallet">Wallet</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentAmount("");
                                        setPaymentMethod("");
                                        setValidationError("");
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={processingPayment}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CDWallet;
