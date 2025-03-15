import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const ProfileForm = () => {
    const { auth } = useContext(AuthContext);
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
        
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Pincode validation
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

        setFormData(prevState => {
            const newState = {
                ...prevState,
                [name]: newValue
            };

            // If same address checkbox is checked, copy permanent address details
            if (name === 'is_same_address' && checked) {
                return {
                    ...newState,
                    correspondence_address: prevState.permanent_address,
                    correspondence_city: prevState.permanent_city,
                    correspondence_state: prevState.permanent_state,
                    correspondence_pincode: prevState.permanent_pincode
                };
            }

            // If permanent address fields change and same address is checked, update correspondence address
            if (formData.is_same_address && name.startsWith('permanent_')) {
                const correspondenceField = name.replace('permanent_', 'correspondence_');
                return {
                    ...newState,
                    [correspondenceField]: value
                };
            }

            return newState;
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
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
                    user_id: auth.user_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            );
            if (response.data.success) {
                alert('Profile details updated successfully');
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error updating profile details';
            setErrors(prev => ({ ...prev, submit: errorMsg }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Profile Details</h2>

                {errors.submit && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details Section */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Nominee Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nominee Name
                                </label>
                                <input
                                    type="text"
                                    name="nominee_name"
                                    value={formData.nominee_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Relationship with Nominee
                                </label>
                                <input
                                    type="text"
                                    name="nominee_relation"
                                    value={formData.nominee_relation}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Permanent Address Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Permanent Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="permanent_address"
                                    value={formData.permanent_address}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="permanent_city"
                                    value={formData.permanent_city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="permanent_state"
                                    value={formData.permanent_state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    name="permanent_pincode"
                                    value={formData.permanent_pincode}
                                    onChange={handleChange}
                                    required
                                    maxLength="6"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.permanent_pincode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.permanent_pincode}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Same Address Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_same_address"
                            name="is_same_address"
                            checked={formData.is_same_address}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_same_address" className="ml-2 block text-sm text-gray-900">
                            Correspondence address same as permanent address
                        </label>
                    </div>

                    {/* Correspondence Address Section */}
                    {!formData.is_same_address && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Correspondence Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        name="correspondence_address"
                                        value={formData.correspondence_address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="correspondence_city"
                                        value={formData.correspondence_city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="correspondence_state"
                                        value={formData.correspondence_state}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="correspondence_pincode"
                                        value={formData.correspondence_pincode}
                                        onChange={handleChange}
                                        required
                                        maxLength="6"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.correspondence_pincode && (
                                        <p className="mt-1 text-sm text-red-600">{errors.correspondence_pincode}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_divyang"
                                    name="is_divyang"
                                    checked={formData.is_divyang}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_divyang" className="ml-2 block text-sm text-gray-900">
                                    Person with Disability (Divyang)
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_senior_citizen"
                                    name="is_senior_citizen"
                                    checked={formData.is_senior_citizen}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_senior_citizen" className="ml-2 block text-sm text-gray-900">
                                    Senior Citizen
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 bg-blue-600 text-white rounded-md font-medium ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
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
