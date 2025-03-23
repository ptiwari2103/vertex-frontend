import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const ProfileForm = () => {
    const { userdata } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        nominee_name: '',
        nominee_relation: '',
        permanent_address: '',
        permanent_city: '',
        permanent_state: '',
        permanent_pincode: '',
        correspondence_address: '',
        correspondence_city: '',
        correspondence_state: '',
        correspondence_pincode: '',
        is_same_address: false,
        is_divyang: false,
        is_senior_citizen: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

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
                correspondence_pincode: prev.permanent_pincode
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/users/profile',
                {
                    ...formData,
                    user_id: userdata?.user_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${userdata.user_id}`
                    }
                }
            );

            if (response.data.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Profile Details</h2>

                {errors.submit && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={userdata?.name}  
                                readOnly                              
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />                           
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Name</label>
                            <input
                                type="text"
                                name="nominee_name"
                                value={formData.nominee_name}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Relation</label>
                            <input
                                type="text"
                                name="nominee_relation"
                                value={formData.nominee_relation}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

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

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_divyang"
                                checked={formData.is_divyang}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="text-sm text-gray-700">Are you Divyang?</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_senior_citizen"
                                checked={formData.is_senior_citizen}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="text-sm text-gray-700">Are you a Senior Citizen?</label>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-1 bg-blue-600 text-white rounded-md ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
