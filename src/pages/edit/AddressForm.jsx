import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const AddressForm = () => {
    const navigate = useNavigate();
    const { userdata, updateuserdata, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        permanent_address: '',
        permanent_city: '',
        permanent_state: '',
        permanent_district: '',
        permanent_pincode: '',
        correspondence_address: '',
        correspondence_city: '',
        correspondence_state: '',
        correspondence_district: '',
        correspondence_pincode: '',
        is_same_address: false,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({ serverresponse: "" });
    const [pageStatus, setPageStatus] = useState(null);
    const [pageEdit, setPageEdit] = useState(true); // Initialize as false by default

    useEffect(() => {
        if (errors.serverError === "Invalid token" || errors.serverError === "Token has expired") {
            logout();
            navigate('/');
        }
    }, [errors.serverError, logout, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!/^[0-9]{6}$/.test(formData.permanent_pincode)) {
            newErrors.permanent_pincode = 'Invalid pincode format (6 digits)';
        }

        if (!formData.is_same_address && !/^[0-9]{6}$/.test(formData.correspondence_pincode)) {
            newErrors.correspondence_pincode = 'Invalid pincode format (6 digits)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (name === 'is_same_address' && checked) {
            setFormData(prev => ({
                ...prev,
                correspondence_address: prev.permanent_address,
                correspondence_city: prev.permanent_city,
                correspondence_state: prev.permanent_state,
                correspondence_district: prev.permanent_district,
                correspondence_pincode: prev.permanent_pincode
            }));
        }
    };

    useEffect(() => {
        //if (!userdata?.address) return;
        const { address } = userdata;
        setFormData(prev => ({
            ...prev,
            permanent_address: address?.permanent_address || '',
            permanent_city: address?.permanent_city || '',
            permanent_state: address?.permanent_state || '',
            permanent_district: address?.permanent_district || '',
            permanent_pincode: address?.permanent_pincode || '',
            correspondence_address: address?.correspondence_address || '',
            correspondence_city: address?.correspondence_city || '',
            correspondence_state: address?.correspondence_state || '',
            correspondence_district: address?.correspondence_district || '',
            correspondence_pincode: address?.correspondence_pincode || '',
            is_same_address: address?.is_same_address || false
        }));


        // Set pageEdit based on status
        if(userdata?.address?.id) {
            setPageEdit(false);
            setPageStatus("Your Address have been submitted.");
        }     
        

    }, [userdata]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/members/addupdateaddress`,
                {
                    ...formData,
                    user_id: userdata?.user_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data.success) {
                console.log("Address updated successfully:", response.data.data);
                updateuserdata(response.data.data);
                setShowSuccess(true);
                setSuccessMessages(prev => ({
                    ...prev,
                    serverresponse: response.data.message
                }));
            }
        } catch (error) {
            //setErrors({ submit: error.response?.data?.message || 'Failed to update profile' });
            if (error.response) {
                if (error.response.data.message === "Invalid token" || error.response.data.message === "Token has expired") {
                    setErrors(prev => ({ ...prev, serverError: error.response.data.message }));
                } else {
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
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Address Details</h2>
                
                {pageStatus && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {pageStatus}
                    </div>
                )}

                {/* 
                {profileEdit === false && (
                    <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                        Your Profile have been approved.
                    </div>
                )} */}

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

                    {/* Permanent Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                            <input
                                type="text"
                                name="permanent_address"
                                value={formData.permanent_address}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="permanent_city"
                                value={formData.permanent_city}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input
                                type="text"
                                name="permanent_district"
                                value={formData.permanent_district}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                name="permanent_state"
                                value={formData.permanent_state}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                            <input
                                type="text"
                                name="permanent_pincode"
                                value={formData.permanent_pincode}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{6}"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.permanent_pincode && (
                                <p className="text-red-500 text-xs mt-1">{errors.permanent_pincode}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_same_address"
                            checked={formData.is_same_address}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">Same as permanent address</label>
                    </div>

                    {/* Correspondence Address */}
                    {!formData.is_same_address && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correspondence Address</label>
                                <input
                                    type="text"
                                    name="correspondence_address"
                                    value={formData.correspondence_address}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="correspondence_city"
                                    value={formData.correspondence_city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <input
                                    type="text"
                                    name="correspondence_district"
                                    value={formData.correspondence_district}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="correspondence_state"
                                    value={formData.correspondence_state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                                <input
                                    type="text"
                                    name="correspondence_pincode"
                                    value={formData.correspondence_pincode}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{6}"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.correspondence_pincode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.correspondence_pincode}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {pageEdit===true && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-1 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            {loading ? 'Updating...' : 'Update Address'}
                        </button>
                    </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
