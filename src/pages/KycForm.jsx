import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const KycForm = () => {
    const { userdata, updateuserdata } = useContext(AuthContext);
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pan_number: '',
        aadhar_number: ''
    });

    const [documents, setDocuments] = useState({
        pan_number_image: null,
        aadhar_number_image_front: null,
        aadhar_number_image_back: null
    });

    const [documentPreviews, setDocumentPreviews] = useState({
        pan_number_image: null,
        aadhar_number_image_front: null,
        aadhar_number_image_back: null
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({serverresponse: ""});
    const [kycStatus, setKycStatus] = useState(null);
    const [kycEdit, setKycEdit] = useState(false); // Initialize as false by default
    
    useEffect(() => {
        if (!userdata) return;
        console.log("Update KycForm in useEffect");
        const pan_number = userdata.profile.pan_number;
        const aadhar_number = userdata.profile.aadhar_number;
        const pan_number_image = "http://localhost:5001/"+userdata.profile.pan_number_image;
        const aadhar_number_image_front = "http://localhost:5001/"+userdata.profile.aadhar_number_image_front;
        const aadhar_number_image_back = "http://localhost:5001/"+userdata.profile.aadhar_number_image_back;
        
        // Set kycEdit based on kyc_status
        if(userdata.profile.kyc_status === "Approved") {
            setKycEdit(false);
            console.log("kyc edit set to false");
        } else {
            setKycEdit(true);
            console.log("kyc edit set to true");
        }
        
        const kycMessages = {
            Pending: "Your KYC is pending.",
            Submitted: "Your KYC is pending for approval.",
            // Approved: "Your KYC is approved.",
            Rejected: "Your KYC is rejected."
        };
        
        setKycStatus(kycMessages[userdata.profile.kyc_status] || null);

        setFormData(prev => ({
            ...prev,
            pan_number,
            aadhar_number
        }));
        setDocuments(prev => ({
            ...prev,
            pan_number_image,
            aadhar_number_image_front,
            aadhar_number_image_back
        }));
        setDocumentPreviews(prev => ({
            ...prev,
            pan_number_image,
            aadhar_number_image_front,
            aadhar_number_image_back
        }));
    }, [userdata]);

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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'File size should be less than 5MB'
                }));
                return;
            }

            setDocuments(prev => ({
                ...prev,
                [name]: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setDocumentPreviews(prev => ({
                    ...prev,
                    [name]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append('user_id', userdata.user_id);
        formDataToSend.append('pan_number', formData.pan_number);
        formDataToSend.append('aadhar_number', formData.aadhar_number);
        
        Object.entries(documents).forEach(([key, file]) => {
            if (file) {
                formDataToSend.append(key, file);
            }
        });

        try {
            const response = await axios.post(
                'http://localhost:5001/members/kyc',
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                updateuserdata(response.data.data);
                setShowSuccess(true);
                setSuccessMessages(prev => ({
                    ...prev,
                    serverresponse: response.data.message
                }));
                // navigate('/dashboard');                
            }
            console.log(response.data);
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Failed to submit KYC details' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">KYC Details</h2>

                {kycStatus && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {kycStatus}
                    </div>
                )}
                
                {kycEdit===false && (
                    <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                        Your KYC have been approved.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                            <input
                                type="text"
                                name="pan_number"
                                value={formData.pan_number}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ABCDE1234F"
                            />
                            {errors.pan_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.pan_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                            <input
                                type="text"
                                name="aadhar_number"
                                value={formData.aadhar_number}
                                onChange={handleChange}
                                required
                                maxLength={12}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123456789012"
                            />
                            {errors.aadhar_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.aadhar_number}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card (Front)</label>
                            <input
                                type="file"
                                name="pan_number_image"
                                onChange={handleFileChange}
                                accept="image/*"
                                required
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {documentPreviews.pan_number_image && (
                                <img src={documentPreviews.pan_number_image} alt="PAN Card Preview" className="mt-2 h-20 object-contain" />
                            )}
                            {errors.pan_number_image && (
                                <p className="text-red-500 text-xs mt-1">{errors.pan_number_image}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card (Front)</label>
                            <input
                                type="file"
                                name="aadhar_number_image_front"
                                onChange={handleFileChange}
                                accept="image/*"
                                required
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {documentPreviews.aadhar_number_image_front && (
                                <img src={documentPreviews.aadhar_number_image_front} alt="Aadhar Front Preview" className="mt-2 h-20 object-contain" />
                            )}
                            {errors.aadhar_number_image_front && (
                                <p className="text-red-500 text-xs mt-1">{errors.aadhar_number_image_front}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card (Back)</label>
                            <input
                                type="file"
                                name="aadhar_number_image_back"
                                onChange={handleFileChange}
                                accept="image/*"
                                required
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {documentPreviews.aadhar_number_image_back && (
                                <img src={documentPreviews.aadhar_number_image_back} alt="Aadhar Back Preview" className="mt-2 h-20 object-contain" />
                            )}
                            {errors.aadhar_number_image_back && (
                                <p className="text-red-500 text-xs mt-1">{errors.aadhar_number_image_back}</p>
                            )}
                        </div>
                    </div>
                    
                    {kycEdit===true && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-1 bg-blue-600 text-white rounded-md ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            {loading ? 'Submitting...' : 'Submit KYC Details'}
                        </button>
                    </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default KycForm;
