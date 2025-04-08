import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/authContext';


const ProfileDetailViewForm = () => {
    const { userdata } = useContext(AuthContext);
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

    // const [documents, setDocuments] = useState({
    //     profile_image: null,
    //     divyang_certificate: null
    // });

    const [documentPreviews, setDocumentPreviews] = useState({
        profile_image: null,
        divyang_certificate: null
    });

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
            // setDocuments(prev => ({
            //     ...prev,
            //     profile_image
            // }));
            setDocumentPreviews(prev => ({
                ...prev,
                profile_image
            }));
        }

        if (divyang_certificate) {
            // setDocuments(prev => ({
            //     ...prev,
            //     divyang_certificate
            // }));
            setDocumentPreviews(prev => ({
                ...prev,
                divyang_certificate
            }));
        }

    }, [userdata]);

    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Profile Details</h2>

                <form className="space-y-4">
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
                                value={userdata?.email_id || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
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
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            >
                                <option value="">Select Relation</option>
                                {nomineeRelations.map(relation => (
                                    <option key={relation} value={relation}>{relation}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image*</label>
                            <input
                                type="file"
                                name="profile_image"
                                readOnly
                                disabled
                                accept="image/*"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                            {documentPreviews.profile_image && (
                                <img src={documentPreviews.profile_image} alt="Profile Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Name*</label>
                            <input
                                type="text"
                                name="nominee_name"
                                value={formData?.nominee_name || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Relation*</label>
                            <select
                                name="nominee_relation"
                                value={formData.nominee_relation}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            >
                                <option value="">Select Relation</option>
                                {nomineeRelations.map(relation => (
                                    <option key={relation} value={relation}>{relation}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Contact*</label>
                            <input
                                type="text"
                                name="nominee_contact"
                                value={formData?.nominee_contact || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Email</label>
                            <input
                                type="email"
                                name="nominee_email"
                                value={formData?.nominee_email || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                   

                    
                    
                        <div className="flex items-center">
                            <div className="text-sm text-gray-900">
                                <span className="font-medium">Are you Divyang?: </span>
                                <span>{formData?.is_divyang ? "Yes" : "No"}</span>
                            </div>
                        </div>

                        {formData?.is_divyang && (
                            <>
                            <div>                                
                                <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Type*</label>
                                <select 
                                    name="divyang_type" 
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.divyang_type || ''}
                                    readOnly
                                    disabled
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
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Certificate*</label>
                               <input
                                type="file"
                                name="divyang_certificate"
                                readOnly
                                disabled
                                accept="image/*,.pdf"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                                value={formData.divyang_certificate || ''}
                                />
                                {documentPreviews.divyang_certificate && (
                                    <img src={documentPreviews.divyang_certificate} alt="Divyang Certificate Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                                )}
                            </div>
                            </>
                        )}

                        <div className="flex items-center">
                            <div className="text-sm text-gray-900">
                                <span className="font-medium">Are you a Senior Citizen?: </span>
                                <span>{formData?.is_senior_citizen ? "Yes" : "No"}</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileDetailViewForm;
