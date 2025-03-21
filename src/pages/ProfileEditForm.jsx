import ProfileForm from './ProfileForm';
import KycForm from './KycForm';
import BankForm from './BankForm';

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

            {/* Bank Section */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <BankForm />
            </div>
        </div>
    );
};

export default ProfileEditForm;
