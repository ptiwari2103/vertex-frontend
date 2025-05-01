import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/authContext';

const Referral = () => {
    const { userdata } = useContext(AuthContext);
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userdata?.id) return;
        
        // In a real implementation, you might fetch this data from an API
        // For now, we'll use the data from userdata if available
        if (userdata?.userReferralMoney) {
            setReferralData(userdata.userReferralMoney);
        }
        setLoading(false);
    }, [userdata]);

    // Calculate subtotals and total
    const calculateRefundableSubtotal = () => {
        if (!referralData) return 0;
        return (referralData.shared_money || 0) + (referralData.compulsory_deposit || 0);
    };

    const calculateNonRefundableSubtotal = () => {
        if (!referralData) return 0;
        return (
            (referralData.admission_fee || 0) + 
            (referralData.building_fund || 0) + 
            (referralData.welfare_fund || 0) + 
            (referralData.other_deposit || 0)
        );
    };

    const calculateTotal = () => {
        return calculateRefundableSubtotal() + calculateNonRefundableSubtotal();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `₹ ${Number(amount || 0).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Member Fees Information</h2>
                
                {referralData ? (
                    <div className="space-y-6">
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <span className="font-bold mr-2">Pay Key:</span>
                                <span>{referralData.pay_key}</span>
                            </div>
                        </div>

                        {/* Refundable Section */}
                        <div className="border rounded-lg overflow-hidden mb-6">
                            <div className="bg-primary p-4">
                                <h3 className="text-xl font-semibold">Refundable Deposits</h3>
                            </div>
                            <div className="p-4 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="flex">
                                            <span className="font-bold mr-2">Shared Money:</span>
                                            <span>{formatCurrency(referralData.shared_money)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <span className="font-bold mr-2">Compulsory Deposit:</span>
                                            <span>{formatCurrency(referralData.compulsory_deposit)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex">
                                        <span className="font-bold mr-2">Refundable Subtotal:</span>
                                        <span>{formatCurrency(calculateRefundableSubtotal())}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Non-Refundable Section */}
                        <div className="border rounded-lg overflow-hidden mb-6">
                            <div className="bg-info p-4">
                                <h3 className="text-xl font-semibold">Non-Refundable Fees</h3>
                            </div>
                            <div className="p-4 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="flex">
                                            <span className="font-bold mr-2">Admission Fee:</span>
                                            <span>{formatCurrency(referralData.admission_fee)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <span className="font-bold mr-2">Building Fund:</span>
                                            <span>{formatCurrency(referralData.building_fund)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="flex">
                                            <span className="font-bold mr-2">Welfare Fund:</span>
                                            <span>{formatCurrency(referralData.welfare_fund)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <span className="font-bold mr-2">Other Deposit:</span>
                                            <span>{formatCurrency(referralData.other_deposit)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex">
                                        <span className="font-bold mr-2">Non-Refundable Subtotal:</span>
                                        <span>{formatCurrency(calculateNonRefundableSubtotal())}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Section */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-100">
                                <div className="flex">
                                    <span className="font-bold mr-2">Total Amount:</span>
                                    <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">
                        <p>No referral information available for this member.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Referral;
