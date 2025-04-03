import ProfileForm from './edit/ProfileForm';
import KycForm from './edit/KycForm';
import BankForm from './edit/BankForm';
import AddressForm from './edit/AddressForm';


const ProfileEditForm = () => {

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* KYC Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <KycForm />
            </div>
            
            {/* Profile Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <ProfileForm />
            </div>
            
            {/* Address Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <AddressForm />
            </div>

            {/* Bank Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <BankForm />
            </div>
        </div>
    );
};

export default ProfileEditForm;
