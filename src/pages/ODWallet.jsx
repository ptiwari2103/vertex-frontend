import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import axios from "axios";

const ODWallet = () => {
    const { userdata } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/wallets/od-transactions`, {
                    params: {
                        user_id: userdata?.id
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (response.data.success) {
                    setTransactions(response.data.transactions || []);
                } else {
                    setError(response.data.message || "Failed to fetch transactions");
                }
            } catch (err) {
                console.error("Error fetching OD wallet transactions:", err);
                setError("An error occurred while fetching transactions");
            } finally {
                setLoading(false);
            }
        };

        if (userdata?.id) {
            fetchTransactions();
        }
    }, [userdata?.id]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header with wallet info */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <h1 className="text-white font-bold text-3xl mb-2">OD Wallet</h1>
                        <p className="text-purple-100 mb-4">Overdraft Account</p>
                        
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4">
                            <div>
                                <div className="text-white text-4xl font-bold">₹{userdata?.od_wallet?.balance || '0.00'}</div>
                                <div className="text-purple-100 text-sm mt-1">Available Balance</div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <button className="bg-white text-purple-700 px-6 py-2 rounded-md hover:bg-purple-50 transition-colors duration-200 font-medium">
                                    Deposit
                                </button>
                                <button className="bg-purple-800 text-white px-6 py-2 rounded-md hover:bg-purple-900 transition-colors duration-200 font-medium">
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Transaction History */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                    </div>
                    
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.type === 'credit' ? 'Deposit' : 'Withdrawal'}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default ODWallet;
