import ProfileDetailViewForm from './ProfileDetailViewForm';
import KycViewForm from './KycViewForm';
import BankViewForm from './BankViewForm';
import AddressViewForm from './AddressViewForm';


const ProfileViewForm = () => {

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* KYC Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <KycViewForm />
            </div>
            
            {/* Profile Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <ProfileDetailViewForm />
            </div>
            
            {/* Address Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <BankViewForm />
            </div>

            {/* Bank Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <AddressViewForm />
            </div>
        </div>
    );
};

export default ProfileViewForm;
