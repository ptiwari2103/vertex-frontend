import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const AddressViewForm = () => {
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
    
    useEffect(() => {
        if (errors.serverError === "Invalid token" || errors.serverError === "Token has expired") {
            logout();
            navigate('/');
        }
    }, [errors.serverError, logout, navigate]);

    

    useEffect(() => {
        if (!userdata?.address) return;

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

    }, [userdata]);

    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Address Details</h2>
                
                <form className="space-y-4">

                    {/* Permanent Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                            <input
                                type="text"
                                name="permanent_address"
                                value={formData.permanent_address}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="permanent_city"
                                value={formData.permanent_city}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input
                                type="text"
                                name="permanent_district"
                                value={formData.permanent_district}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                name="permanent_state"
                                value={formData.permanent_state}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                            <input
                                type="text"
                                name="permanent_pincode"
                                value={formData.permanent_pincode}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_same_address"
                            checked={formData.is_same_address}
                            readOnly
                            disabled
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">Same as permanent address</label>
                    </div> */}

                    {/* Correspondence Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correspondence Address</label>
                                <input
                                    type="text"
                                    name="correspondence_address"
                                    value={formData.correspondence_address}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="correspondence_city"
                                    value={formData.correspondence_city}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <input
                                    type="text"
                                    name="correspondence_district"
                                    value={formData.correspondence_district}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="correspondence_state"
                                    value={formData.correspondence_state}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                                <input
                                    type="text"
                                    name="correspondence_pincode"
                                    value={formData.correspondence_pincode}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.correspondence_pincode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.correspondence_pincode}</p>
                                )}
                            </div>
                        </div>
                </form>
            </div>
        </div>
    );
};

export default AddressViewForm;
