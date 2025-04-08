import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const { userdata, updateuserdata, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email_id: '',
        nominee_name: '',
        nominee_relation: '',
        nominee_contact: '',
        nominee_email: '',
        is_divyang: false,
        is_senior_citizen: false,
        guardian_relation: '',
        divyang_type: '',
        divyang_percentage: '',
    });

    const [documents, setDocuments] = useState({
        profile_image: null,
        divyang_certificate: null
    });

    const [documentPreviews, setDocumentPreviews] = useState({
        profile_image: null,
        divyang_certificate: null
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({serverresponse: ""});
    const [profileStatus, setProfileStatus] = useState(null);
    const [profileEdit, setProfileEdit] = useState(false); // Initialize as false by default

    useEffect(() => {
        if (errors.serverError === "Invalid token" || errors.serverError === "Token has expired") {
            console.log("Invalid token or token has expired");
            logout();
            navigate('/');
        }
    }, [errors.serverError, logout, navigate]);

    const nomineeRelations = ['Father', 'Mother', 'Brother', 'Sister', 'Wife', 'Husband', 'Son', 'Daughter'];

    useEffect(() => {
        if (!userdata?.profile) return;
        
        const { profile } = userdata;
        const profile_image = profile.profile_image ? "http://localhost:5001/"+profile.profile_image : null;
        const divyang_certificate = profile.divyang_certificate ? "http://localhost:5001/"+profile.divyang_certificate : null;

        setFormData(prev => ({
            ...prev,
            email_id: userdata.email_id || '',
            nominee_name: profile.nominee_name || '',
            nominee_relation: profile.nominee_relation || '',
            nominee_contact: profile.nominee_contact || '',
            nominee_email: profile.nominee_email || '',
            is_divyang: profile.is_divyang || false,
            is_senior_citizen: profile.is_senior_citizen || false,
            guardian_relation: userdata.guardian_relation || '',
            date_of_birth: userdata.date_of_birth || '',
            gender: userdata.gender || '',            
            divyang_type: profile.divyang_type || '',
            divyang_percentage: profile.divyang_percentage || ''
        }));

        if (profile_image) {
            setDocuments(prev => ({
                ...prev,
                profile_image
            }));
            setDocumentPreviews(prev => ({
                ...prev,
                profile_image
            }));
        }

        if (divyang_certificate) {
            setDocuments(prev => ({
                ...prev,
                divyang_certificate
            }));
            setDocumentPreviews(prev => ({
                ...prev,
                divyang_certificate
            }));
        }

        // Set profileEdit based on profile_status
        if(userdata.profile.profile_status !== "Pending") {
            setProfileEdit(false);
            //console.log("profile edit set to false");
        } else {
            setProfileEdit(true);
            //console.log("profile edit set to true");
        }        
        const profileMessages = {
            Pending: "Your Profile is pending.",
            Submitted: "Your Profile have been submitted.",                      
        };        
        setProfileStatus(profileMessages[userdata.profile.profile_status] || null);

    }, [userdata]);

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!formData.nominee_name?.trim()) {
            newErrors.nominee_name = 'Nominee name is required';
        }

        if (!formData.nominee_relation) {
            newErrors.nominee_relation = 'Nominee relation is required';
        }

        if (!formData.nominee_contact) {
            newErrors.nominee_contact = 'Nominee contact is required';
        }

        if (!formData.guardian_relation) {
            newErrors.guardian_relation = 'Guardian relation is required';
        }

        if (!documents.profile_image) {
            newErrors.profile_image = 'Profile image is required';
        }

        // Divyang certificate validation
        if (formData.is_divyang && !documents.divyang_certificate) {
            newErrors.divyang_certificate = 'Divyang certificate is required when marked as Divyang';
        }

        // Optional field validations
        if (formData.email_id && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
            newErrors.email_id = 'Invalid email id format';
        }

        if (formData.nominee_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.nominee_email)) {
            newErrors.nominee_email = 'Invalid nominee email format';
        }

        if (formData.nominee_contact && !/^[0-9]{10}$/.test(formData.nominee_contact)) {
            newErrors.nominee_contact = 'Invalid contact number (10 digits)';
        }

        // Document size validation
        Object.entries(documents).forEach(([key, file]) => {
            if (file && file instanceof File && file.size > 10 * 1024 * 1024) {
                newErrors[key] = 'File size should be less than 10MB';
            }
        });

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
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'File size should be less than 10MB'
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
        
        // Append form fields
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        
        // Append files
        Object.entries(documents).forEach(([key, file]) => {
            if (file && file instanceof File) {
                formDataToSend.append(key, file);
            }
        });

        try {
            const response = await axios.post(
                'http://localhost:5001/members/profile',
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                console.log("Profile updated successfully:", response.data.data);
                updateuserdata(response.data.data);
                setShowSuccess(true);
                setSuccessMessages(prev => ({
                    ...prev,
                    serverresponse: response.data.message
                }));
            }
        } catch (error) {
           //setErrors(prev => ({ ...prev, serverError: error.response?.data?.error || error.response?.data?.message || 'Failed to update profile' }));
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
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Profile Details</h2>

                {profileStatus && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {profileStatus}
                    </div>
                )}
                
                {/* {profileEdit===false && (
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Read-only fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                            <input
                                type="text"
                                name="user_id"
                                value={userdata?.user_id || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            <input
                                type="text"
                                name="account_number"
                                value={userdata?.account_number || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={userdata?.name || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile_number"
                                value={userdata?.mobile_number || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        {/* Optional fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Id</label>
                            <input
                                type="email"
                                name="email_id"
                                value={formData.email_id}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.email_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <input
                                type="text"
                                name="gender"
                                value={userdata?.gender || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={userdata?.date_of_birth || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                            <input
                                type="text"
                                name="guardian_name"
                                value={userdata?.guardian_name || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        {/* Required fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Relation*</label>
                            <select
                                name="guardian_relation"
                                value={formData.guardian_relation}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Relation</option>
                                {nomineeRelations.map(relation => (
                                    <option key={relation} value={relation}>{relation}</option>
                                ))}
                            </select>
                            {errors.guardian_relation && (
                                <p className="text-red-500 text-xs mt-1">{errors.guardian_relation}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image*</label>
                            <input
                                type="file"
                                name="profile_image"
                                onChange={handleFileChange}
                                accept="image/*"
                                required={!documents.profile_image}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {documentPreviews.profile_image && (
                                <img src={documentPreviews.profile_image} alt="Profile Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                            )}
                            {errors.profile_image && (
                                <p className="text-red-500 text-xs mt-1">{errors.profile_image}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Name*</label>
                            <input
                                type="text"
                                name="nominee_name"
                                value={formData.nominee_name}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.nominee_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.nominee_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Relation*</label>
                            <select
                                name="nominee_relation"
                                value={formData.nominee_relation}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Relation</option>
                                {nomineeRelations.map(relation => (
                                    <option key={relation} value={relation}>{relation}</option>
                                ))}
                            </select>
                            {errors.nominee_relation && (
                                <p className="text-red-500 text-xs mt-1">{errors.nominee_relation}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Contact*</label>
                            <input
                                type="text"
                                name="nominee_contact"
                                value={formData.nominee_contact}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.nominee_contact && (
                                <p className="text-red-500 text-xs mt-1">{errors.nominee_contact}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Email</label>
                            <input
                                type="email"
                                name="nominee_email"
                                value={formData.nominee_email}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.nominee_email && (
                                <p className="text-red-500 text-xs mt-1">{errors.nominee_email}</p>
                            )}
                        </div>
                    
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_divyang"
                                checked={formData.is_divyang}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Are you Divyang?</label>
                        </div>

                        {formData.is_divyang && (
                            <>
                            <div>                                
                                <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Type*</label>
                                <select 
                                    name="divyang_type" 
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.divyang_type || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Divyang Type</option>
                                    <option value="Blindness">Blindness</option>
                                    <option value="Low-vision">Low-vision</option>
                                    <option value="Hearing Impairment">Hearing Impairment</option>
                                    <option value="Locomotor Disability">Locomotor Disability</option>
                                    <option value="Mental Illness">Mental Illness</option>
                                    <option value="Multiple Disabilities">Multiple Disabilities</option>
                                </select>                                
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Percentage*</label>
                                <input
                                    type="number"
                                    name="divyang_percentage"
                                    min="0"
                                    max="100"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.divyang_percentage || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Certificate*</label>
                                <input
                                    type="file"
                                    name="divyang_certificate"
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                    required={!documents.divyang_certificate}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {documentPreviews.divyang_certificate && (
                                    <img src={documentPreviews.divyang_certificate} alt="Divyang Certificate Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                                )}
                                {errors.divyang_certificate && (
                                    <p className="text-red-500 text-xs mt-1">{errors.divyang_certificate}</p>
                                )}
                            </div>
                            </>
                        )}
                        

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_senior_citizen"
                                checked={formData.is_senior_citizen}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Are you a Senior Citizen?</label>
                        </div>
                    </div>
                    
                    {profileEdit===true && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
