import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/authContext';

const KycViewForm = () => {
    const { userdata } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        pan_number: '',
        aadhar_number: ''
    });

    const [documentPreviews, setDocumentPreviews] = useState({
        pan_number_image: null,
        aadhar_number_image_front: null,
        aadhar_number_image_back: null
    });
    
    useEffect(() => {
        if (!userdata) return;

        const pan_number = userdata.profile.pan_number;
        const aadhar_number = userdata.profile.aadhar_number;
        const pan_number_image = "http://localhost:5001/"+userdata.profile.pan_number_image;
        const aadhar_number_image_front = "http://localhost:5001/"+userdata.profile.aadhar_number_image_front;
        const aadhar_number_image_back = "http://localhost:5001/"+userdata.profile.aadhar_number_image_back;
        
        setFormData(prev => ({
            ...prev,
            pan_number,
            aadhar_number
        }));
        setDocumentPreviews(prev => ({
            ...prev,
            pan_number_image,
            aadhar_number_image_front,
            aadhar_number_image_back
        }));
    }, [userdata]);

    return (
        <div className="container mx-auto px-2 mt-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">KYC Details</h2>

                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                            <input
                                type="text"
                                name="pan_number"
                                value={formData.pan_number}
                                readOnly
                                required
                                maxLength={10}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ABCDE1234F"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                            <input
                                type="text"
                                name="aadhar_number"
                                value={formData.aadhar_number}
                                readOnly
                                required
                                maxLength={12}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123456789012"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card (Front)</label>
                            {/* <input
                                type="file"
                                name="pan_number_image"
                                readOnly
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            /> */}
                            {documentPreviews.pan_number_image && (
                                <img src={documentPreviews.pan_number_image} alt="PAN Card Preview" className="mt-2 h-20 object-contain" />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card (Front)</label>
                            {/* <input
                                type="file"
                                name="aadhar_number_image_front"
                                readOnly
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            /> */}
                            {documentPreviews.aadhar_number_image_front && (
                                <img src={documentPreviews.aadhar_number_image_front} alt="Aadhar Front Preview" className="mt-2 h-20 object-contain" />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card (Back)</label>
                            {/* <input
                                type="file"
                                name="aadhar_number_image_back"
                                readOnly
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            /> */}
                            {documentPreviews.aadhar_number_image_back && (
                                <img src={documentPreviews.aadhar_number_image_back} alt="Aadhar Back Preview" className="mt-2 h-20 object-contain" />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KycViewForm;
