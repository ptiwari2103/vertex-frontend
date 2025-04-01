import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/authContext';

const ProfileDetailViewForm = () => {
    const { userdata } = useContext(AuthContext);

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

        if (profile_image) {
            setDocumentPreviews(prev => ({
                ...prev,
                profile_image
            }));
        }

        if (divyang_certificate) {
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
                                value={userdata?.guardian_relation || ''}
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
                                value={userdata?.profile?.nominee_name || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Relation*</label>
                            <select
                                name="nominee_relation"
                                value={userdata?.profile?.nominee_relation || ''}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Contact</label>
                            <input
                                type="text"
                                name="nominee_contact"
                                value={userdata?.profile?.nominee_contact || ''}
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
                                value={userdata?.profile?.nominee_email || ''}
                                readOnly
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Checkbox fields */}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_divyang"
                                checked={userdata?.profile?.is_divyang || false}
                                readOnly
                                disabled
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Are you Divyang?</label>
                        </div>

                        {userdata?.profile?.is_divyang && (
                            <>
                            <div>                                
                            <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Type*</label>
                            <select 
                                name="divyang_type" 
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={userdata?.profile?.divyang_type || ''}
                                readOnly
                                disabled
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Divyang Certificate*</label>
                                <input
                                    type="file"
                                    name="divyang_certificate"
                                    accept="image/*,.pdf"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                                />
                                {documentPreviews.divyang_certificate && (
                                    <img src={documentPreviews.divyang_certificate} alt="Divyang Certificate Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                                )}
                            </div>
                            </>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_senior_citizen"
                                checked={userdata?.is_senior_citizen || false}
                                readOnly
                                disabled
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Are you a Senior Citizen?</label>
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default ProfileDetailViewForm;
