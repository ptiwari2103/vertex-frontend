import KycViewForm from './view/KycViewForm';
import ProfileDetailViewForm from './view/ProfileDetailViewForm';
import AddressViewForm from './view/AddressViewForm';
import BankViewForm from './view/BankViewForm';


const ProfileViewForm = () => {

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <KycViewForm />
            </div>

            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <ProfileDetailViewForm />
            </div>

            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <AddressViewForm />
            </div>

            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <BankViewForm />
            </div>
            
        </div>
    );
};

export default ProfileViewForm;
