import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/authContext';

const AddressViewForm = () => {
    const { userdata } = useContext(AuthContext);
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

    useEffect(() => {
        if (!userdata?.userAddress) return;
        const { userAddress } = userdata;
        setFormData(prev => ({
            ...prev,
            permanent_address: userAddress?.activeAddress?.permanent_address || '',
            permanent_city: userAddress?.activeAddress?.permanent_city || '',
            permanent_state: userAddress?.activeAddress?.permanent_state || '',
            permanent_district: userAddress?.activeAddress?.permanent_district || '',
            permanent_pincode: userAddress?.activeAddress?.permanent_pincode || '',
            correspondence_address: userAddress?.activeAddress?.correspondence_address || '',
            correspondence_city: userAddress?.activeAddress?.correspondence_city || '',
            correspondence_state: userAddress?.activeAddress?.correspondence_state || '',
            correspondence_district: userAddress?.activeAddress?.correspondence_district || '',
            correspondence_pincode: userAddress?.activeAddress?.correspondence_pincode || '',
            is_same_address: userAddress?.activeAddress?.is_same_address || false
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_same_address"
                            checked={formData.is_same_address}
                            readOnly
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
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
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressViewForm;
