import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/authContext';

const BankViewForm = () => {
    const { userdata } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        account_holder: '',
        account_number: '',
        ifsc_number: '',
        bank_name: '',
        branch_name: '',
        account_type: ''
    });

    useEffect(() => {
        if (!userdata?.bank) return;

        const { bank } = userdata;
        setFormData(prev => ({
            ...prev,
            account_holder: bank?.account_holder || userdata.name|| '',
            account_number: bank?.account_number || '',
            bank_name: bank?.bank_name || '',
            branch_name: bank?.branch_name || '',
            ifsc_number: bank?.ifsc_number || '',
            account_type: bank?.account_type || ''
        }));
        
    }, [userdata]);


    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                    Bank Account Details
                </h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Holder Name
                            </label>
                            <input
                                type="text"
                                name="account_holder"
                                value={formData.account_holder}
                                required
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number
                            </label>
                            <input
                                type="text"
                                name="account_number"
                                value={formData.account_number}
                                required
                                readOnly
                                pattern="[0-9]{9,18}"
                                title="Please enter a valid account number (9-18 digits)"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                name="bank_name"
                                value={formData.bank_name}
                                required
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name
                            </label>
                            <input
                                type="text"
                                name="branch_name"
                                value={formData.branch_name}
                                required
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Number*
                            </label>
                            <input
                                type="text"
                                name="ifsc_number"
                                value={formData.ifsc_number}
                                required
                                readOnly
                                pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                title="Please enter a valid IFSC code (e.g., SBIN0123456)"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type*</label>
                            <select
                                name="account_type"
                                value={formData.account_type}
                                required
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Account Type</option>
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                                <option value="Salary">Salary</option>
                            </select>
                        </div>
                    </div>                   
                </form>
            </div>
        </div>
    );
};

export default BankViewForm;
