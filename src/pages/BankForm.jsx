import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const BankForm = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        account_holder_name: '',
        account_number: '',
        confirm_account_number: '',
        ifsc_code: '',
        bank_name: '',
        branch_name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.account_number !== formData.confirm_account_number) {
            alert('Account numbers do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/users/bank-details', 
                { 
                    ...formData, 
                    user_id: auth.user_id 
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${auth.token}` 
                    } 
                }
            );
            if (response.data.success) {
                alert('Bank details submitted successfully');
                navigate('/dashboard');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting bank details');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Bank Account Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Holder Name
                            </label>
                            <input
                                type="text"
                                name="account_holder_name"
                                value={formData.account_holder_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number
                            </label>
                            <input
                                type="text"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{9,18}"
                                title="Please enter a valid account number (9-18 digits)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Account Number
                            </label>
                            <input
                                type="text"
                                name="confirm_account_number"
                                value={formData.confirm_account_number}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{9,18}"
                                title="Please enter a valid account number (9-18 digits)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IFSC Code
                            </label>
                            <input
                                type="text"
                                name="ifsc_code"
                                value={formData.ifsc_code}
                                onChange={handleChange}
                                required
                                pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                title="Please enter a valid IFSC code (e.g., SBIN0123456)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch Name
                            </label>
                            <input
                                type="text"
                                name="branch_name"
                                value={formData.branch_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Submit Bank Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BankForm;
