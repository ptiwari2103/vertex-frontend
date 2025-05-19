import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

const FDWallet = () => {
    const { userdata } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/wallets/fd-transactions`, {
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
            console.error("Error fetching FD wallet transactions:", err);
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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header with wallet info */}
                <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <h1 className="text-white font-bold text-3xl mb-2">FD Wallet</h1>
                        <p className="text-green-100 mb-4">Fixed Deposit Account</p>
                        
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4">
                            <div>
                                <div className="text-white text-4xl font-bold">₹{userdata?.fd_wallet?.balance || '0.00'}</div>
                                <div className="text-green-100 text-sm mt-1">Available Balance</div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <button className="bg-white text-green-700 px-6 py-2 rounded-md hover:bg-green-50 transition-colors duration-200 font-medium">
                                    Deposit
                                </button>
                                <button className="bg-green-800 text-white px-6 py-2 rounded-md hover:bg-green-900 transition-colors duration-200 font-medium">
                                    Withdraw
                                </button>
                            </div>
                        </div>
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
                                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
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
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
                                                            className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
        </div>
    );
};

export default FDWallet;
