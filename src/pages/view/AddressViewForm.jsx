import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const AddressViewForm = () => {
    const navigate = useNavigate();
    const { userdata, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        permanent_address: '',
        permanent_city: '',
        permanent_state_id: '',
        permanent_district_id: '',
        permanent_pincode: '',
        correspondence_address: '',
        correspondence_city: '',
        correspondence_state_id: '',
        correspondence_district_id: '',
        correspondence_pincode: '',
        is_same_address: false,
    });

    const [errors, setErrors] = useState({});
    
    // Add states for dropdown options
    const [states, setStates] = useState([]);
    const [permanentDistricts, setPermanentDistricts] = useState([]);
    const [correspondenceDistricts, setCorrespondenceDistricts] = useState([]);
    
    useEffect(() => {
        if (errors.serverError === "Invalid token" || errors.serverError === "Token has expired") {
            logout();
            navigate('/');
        }
    }, [errors.serverError, logout, navigate]);

    // Fetch states from API
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/locations/states`)
            .then(response => setStates(response.data))
            .catch(error => console.error("Error fetching states", error));
    }, []);

    useEffect(() => {
        if (!userdata?.address) return;

        const { address } = userdata;
        
        // Fetch districts for the user's states
        if (address?.permanent_state_id) {
            axios.get(`${import.meta.env.VITE_API_URL}/locations/districts?stateId=${address.permanent_state_id}`)
                .then(response => setPermanentDistricts(response.data))
                .catch(error => console.error("Error fetching permanent districts", error));
        }
        
        if (address?.correspondence_state_id && !address?.is_same_address) {
            axios.get(`${import.meta.env.VITE_API_URL}/locations/districts?stateId=${address.correspondence_state_id}`)
                .then(response => setCorrespondenceDistricts(response.data))
                .catch(error => console.error("Error fetching correspondence districts", error));
        }
        
        setFormData(prev => ({
            ...prev,
            permanent_address: address?.permanent_address || '',
            permanent_city: address?.permanent_city || '',
            permanent_state_id: address?.permanent_state_id || '',
            permanent_district_id: address?.permanent_district_id || '',
            permanent_pincode: address?.permanent_pincode || '',
            correspondence_address: address?.correspondence_address || '',
            correspondence_city: address?.correspondence_city || '',
            correspondence_state_id: address?.correspondence_state_id || '',
            correspondence_district_id: address?.correspondence_district_id || '',
            correspondence_pincode: address?.correspondence_pincode || '',
            is_same_address: address?.is_same_address || false,
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                                name="permanent_state_id"
                                value={formData.permanent_state_id}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select
                                name="permanent_district_id"
                                value={formData.permanent_district_id}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select District</option>
                                {permanentDistricts.map((district) => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </select>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    name="correspondence_state_id"
                                    value={formData.correspondence_state_id}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select State</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <select
                                    name="correspondence_district_id"
                                    value={formData.correspondence_district_id}
                                    readOnly
                                    disabled
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select District</option>
                                    {correspondenceDistricts.map((district) => (
                                        <option key={district.id} value={district.id}>{district.name}</option>
                                    ))}
                                </select>
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
                            </div>
                        </div>
                </form>
            </div>
        </div>
    );
};

export default AddressViewForm;
