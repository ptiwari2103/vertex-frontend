import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const BankForm = () => {
    const { userdata, updateuserdata, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        account_holder: '',
        account_number: '',
        ifsc_number: '',
        bank_name: '',
        branch_name: '',
        account_type: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({ serverresponse: "" });
    const [pageStatus, setPageStatus] = useState(null);
    const [pageEdit, setPageEdit] = useState(true);
    
    useEffect(() => {
        if (errors.serverError === "Invalid token" || errors.serverError === "Token has expired") {
            logout();
            navigate('/');
        }
    }, [errors.serverError, logout, navigate]);

    const validateForm = () => {
        const newErrors = {};

        // Validate Bank Account Number (Should be 9-18 digits)
        if (!/^\d{9,18}$/.test(formData.account_number)) {
            newErrors.account_number = 'Invalid account number (9-18 digits)';
        }

        // Validate IFSC Code (Standard Indian IFSC format: 4 letters + 7 digits)
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_number)) {
            newErrors.ifsc_number = 'Invalid IFSC code format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        //if (!userdata?.bank) return;
        const { bank } = userdata;
        setFormData(prev => ({
            ...prev,
            account_holder: bank?.account_holder || userdata?.name|| '',
            account_number: bank?.account_number || '',
            bank_name: bank?.bank_name || '',
            branch_name: bank?.branch_name || '',
            ifsc_number: bank?.ifsc_number || '',
            account_type: bank?.account_type || ''
        }));

        // Set pageEdit based on status
        if(userdata?.bank?.id) {
            setPageEdit(false);
            setPageStatus("Your Bank details have been submitted.");
        }      

    }, [userdata]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/members/addupdatebank`,
                {
                    ...formData,
                    user_id: userdata?.user_id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                console.log("Bank updated successfully:", response.data.data);
                updateuserdata(response.data.data);
                setShowSuccess(true);
                setSuccessMessages(prev => ({
                    ...prev,
                    serverresponse: response.data.message
                }));
            }
        } catch (error) {
            if (error.response) {
                // Handle token errors
                if (error.response.data.message === "Invalid token" || error.response.data.message === "Token has expired") {
                    setErrors(prev => ({ ...prev, serverError: error.response.data.message }));
                }
                // Handle duplicate entry error (500 status)
                else if (error.response.data.message === "Duplicate entry error") {
                    setErrors(prev => ({
                        ...prev,
                        account_number: error.response.data.error[0], // "account_no must be unique"
                        serverError: null // Clear any server error if exists
                    }));
                }
                // Handle other errors
                else {
                    setErrors(prev => ({ ...prev, serverError: error.response.data.message }));
                }
            } else {
                setErrors(prev => ({ ...prev, serverError: "An error occurred while submitting the form" }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                    Bank Account Details
                </h2>

                {pageStatus && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {pageStatus}
                    </div>
                )}

                {errors.submit && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errors.submit}
                    </div>
                )}

                {showSuccess && (
                    <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                        {Object.keys(successMessages).map((key) => (
                            successMessages[key] && <li key={key}>{successMessages[key]}</li>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Holder Name
                            </label>
                            <input
                                type="text"
                                name="account_holder"
                                value={formData.account_holder}
                                onChange={handleChange}
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
                                onChange={handleChange}
                                required
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
                                onChange={handleChange}
                                required
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
                                onChange={handleChange}
                                required
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
                                onChange={handleChange}
                                required
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
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Account Type</option>
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                                <option value="Salary">Salary</option>
                            </select>
                        </div>
                    </div>

                    {pageEdit===true && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Submit Bank Details'}
                            </button>
                    </div>
                    )}  
                </form>
            </div>
        </div>
    );
};

export default BankForm;
