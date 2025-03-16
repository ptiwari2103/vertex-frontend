import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const KycForm = () => {
    const { auth, updateKycStatus } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pan_number: '',
        aadhar_number: ''
    });

    const [documents, setDocuments] = useState({
        pan_front: null,
        aadhar_front: null,
        aadhar_back: null
    });

    const [documentPreviews, setDocumentPreviews] = useState({
        pan_front: null,
        aadhar_front: null,
        aadhar_back: null
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        // PAN validation
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)) {
            newErrors.pan_number = 'Invalid PAN number format';
        }

        // Aadhar validation
        if (!/^[0-9]{12}$/.test(formData.aadhar_number)) {
            newErrors.aadhar_number = 'Invalid Aadhar number format';
        }

        // Document size validation
        Object.entries(documents).forEach(([key, file]) => {
            if (file && file.size > 5 * 1024 * 1024) {
                newErrors[key] = 'File size should be less than 5MB';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(files[0].type)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'Please upload only JPG, JPEG or PNG files'
                }));
                return;
            }

            // Validate file size (5MB)
            if (files[0].size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'File size should be less than 5MB'
                }));
                return;
            }

            const previewUrl = URL.createObjectURL(files[0]);
            setDocumentPreviews(prev => ({
                ...prev,
                [name]: previewUrl
            }));

            setDocuments(prev => ({
                ...prev,
                [name]: files[0]
            }));

            // Clear error when valid file is uploaded
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: null }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const formDataToSend = new FormData();

        // Append form fields
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append user ID
        formDataToSend.append('user_id', auth.user_id);

        // Append files
        Object.keys(documents).forEach(key => {
            if (documents[key]) {
                formDataToSend.append(key, documents[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5001/members/kyc',
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (response.data.success) {
                // Update KYC status in AuthContext
                updateKycStatus('Submitted');
                alert('KYC details submitted successfully');
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error submitting KYC details';
            setErrors(prev => ({ ...prev, submit: errorMsg }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">KYC Verification Form</h2>

                {errors.submit && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={auth.name || ''}
                                disabled
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <input
                                type="text"
                                value={auth.user_id || ''}
                                disabled
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* KYC Details */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                PAN Number
                            </label>
                            <input
                                type="text"
                                name="pan_number"
                                value={formData.pan_number}
                                onChange={handleChange}
                                required
                                placeholder="ABCDE1234F"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.pan_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.pan_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aadhar Number
                            </label>
                            <input
                                type="text"
                                name="aadhar_number"
                                value={formData.aadhar_number}
                                onChange={handleChange}
                                required
                                placeholder="123456789012"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.aadhar_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.aadhar_number}</p>
                            )}
                        </div>

                        {/* Document Upload Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
                            
                            {/* PAN Card Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    PAN Card (Front)
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        name="pan_front"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        required
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {documentPreviews.pan_front && (
                                        <img
                                            src={documentPreviews.pan_front}
                                            alt="PAN Card Preview"
                                            className="h-20 w-auto object-contain"
                                        />
                                    )}
                                </div>
                                {errors.pan_front && (
                                    <p className="mt-1 text-sm text-red-600">{errors.pan_front}</p>
                                )}
                            </div>

                            {/* Aadhar Card Upload */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Aadhar Card (Front)
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            name="aadhar_front"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {documentPreviews.aadhar_front && (
                                            <img
                                                src={documentPreviews.aadhar_front}
                                                alt="Aadhar Front Preview"
                                                className="h-20 w-auto object-contain"
                                            />
                                        )}
                                    </div>
                                    {errors.aadhar_front && (
                                        <p className="mt-1 text-sm text-red-600">{errors.aadhar_front}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Aadhar Card (Back)
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            name="aadhar_back"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {documentPreviews.aadhar_back && (
                                            <img
                                                src={documentPreviews.aadhar_back}
                                                alt="Aadhar Back Preview"
                                                className="h-20 w-auto object-contain"
                                            />
                                        )}
                                    </div>
                                    {errors.aadhar_back && (
                                        <p className="mt-1 text-sm text-red-600">{errors.aadhar_back}</p>
                                    )}
                                </div>
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
                            {loading ? 'Submitting...' : 'Submit KYC Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KycForm;
