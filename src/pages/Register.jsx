import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { termsAndConditions } from '../data/termsAndConditions';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        guardian_name: "",
        date_of_birth: "",
        gender: "",
        mobile_number: "",
        state_id: "", 
        district_id: "", 
        terms_accepted: false,
        confirm_password: "",
        email_id: "",
        key: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        guardian_name: "",
        mobile_number: "",
        password: "",
        state_id: "",
        district_id: "",
        date_of_birth: "",
        confirm_password: "",
        email_id: "",
        key: "",
        terms_accepted: "",
        servererror: "",
    });

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [age, setAge] = useState(null);
    const [isUnderAge, setIsUnderAge] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showError, setShowError] = useState(false);

    // Fetch states from master table (Mock API)
    useEffect(() => {
        axios.get("http://localhost:5001/locations/states")  // Adjust API URL
            .then(response => setStates(response.data))
            .catch(error => console.error("Error fetching states", error));
    }, []);

    // Fetch districts when state changes
    useEffect(() => {
        if (formData.state_id) {
            axios.get(`http://localhost:5001/locations/districts?stateId=${formData.state_id}`)  // Changed to use stateId
                .then(response => setDistricts(response.data))
                .catch(error => console.error("Error fetching districts", error));
        } else {
            setDistricts([]);
        }
    }, [formData.state_id]);

    // Calculate age from date of birth
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        setIsUnderAge(age < 18);
        return age;
    };

    // Validate name input
    const validateNameInput = (name, value) => {
        if (value.length > 50) {
            return "Maximum 50 characters allowed";            
        }
        if (!/^[a-zA-Z\s]*$/.test(value)) {
            return "Only alphabets and spaces allowed";
        }
        return "";
    };

    // Validate mobile number
    const validateMobile = (value) => {
        if (!value) return "";
        if (!/^[0-9]{10}$/.test(value)) {
            return "Enter valid 10-digit mobile number";
        }
        return "";
    };

    // Validate password strength
    const validatePassword = (value) => {
        const strengthChecks = {
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /[0-9]/.test(value),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        };
        
        setPasswordStrength(strengthChecks);

        // Check if all criteria are met
        const isStrong = Object.values(strengthChecks).every(check => check);
        
        if (!isStrong) {
            return "Password must meet all requirements";
        }
        return "";
    };

    // Handle form input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked
            });
            
            // Clear terms and conditions error when checkbox is checked
            if (name === "terms_accepted" && checked) {
                setErrors(prev => ({
                    ...prev,
                    terms_accepted: ""
                }));
            }
            return;
        }

        // For date of birth field
        if (name === "date_of_birth") {
            const calculatedAge = calculateAge(value);
            setAge(calculatedAge);
            
            if (calculatedAge < 18) {
                setErrors(prev => ({
                    ...prev,
                    date_of_birth: "You must be at least 18 years old to register"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    date_of_birth: ""
                }));
            }
        }

        // For confirm password validation
        if (name === "confirm_password") {
            if (value !== formData.password) {
                setErrors(prev => ({
                    ...prev,
                    confirm_password: "Passwords do not match"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirm_password: ""
                }));
            }
        }

        // For password field, also check confirm password
        if (name === "password") {
            const error = validatePassword(value);
            setErrors(prev => ({
                ...prev,
                password: error
            }));

            // Check confirm password match if it's already entered
            if (formData.confirm_password) {
                if (value !== formData.confirm_password) {
                    setErrors(prev => ({
                        ...prev,
                        confirm_password: "Passwords do not match"
                    }));
                } else {
                    setErrors(prev => ({
                        ...prev,
                        confirm_password: ""
                    }));
                }
            }
        }

        // For name and guardian_name fields
        if (name === "name" || name === "guardian_name") {
            const error = validateNameInput(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));

            // Only update if there's no error or if clearing the field
            if (!error || value === "") {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
            return;
        }

        // For mobile number validation
        if (name === "mobile_number") {
            // Allow only numbers
            if (value && !/^\d*$/.test(value)) return;
            
            const error = validateMobile(value);
            setErrors(prev => ({
                ...prev,
                mobile_number: error
            }));

            setFormData({
                ...formData,
                mobile_number: value
            });
            return;
        }

        // For state and district selection
        if (name === "state_id" || name === "district_id") {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        // For other fields
        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for validation errors
        if (errors.name || errors.guardian_name || errors.mobile_number || errors.password || 
            errors.date_of_birth || errors.confirm_password || errors.key) {
            alert("Please fix the validation errors before submitting.");
            return;
        }

        // Check terms acceptance
        if (!formData.terms_accepted) {
            setErrors(prev => ({
                ...prev,
                terms_accepted: "You must accept the terms and conditions to register"
            }));
            return;
        }

        // Check age requirement
        if (age < 18) {
            alert("You must be at least 18 years old to register.");
            return;
        }

        // Validate mobile number before submission
        const mobileError = validateMobile(formData.mobile_number);
        if (mobileError) {
            setErrors(prev => ({
                ...prev,
                mobile_number: mobileError
            }));
            alert("Enter a valid mobile number.");
            return;
        }

        // Validate password strength before submission
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setErrors(prev => ({
                ...prev,
                password: passwordError
            }));
            alert("Please enter a strong password.");
            return;
        }

        // Validate state and district selection
        if (!formData.state_id) {
            setErrors(prev => ({
                ...prev,
                state: "Please select a state"
            }));
            alert("Please select a state.");
            return;
        }

        if (!formData.district_id) {
            setErrors(prev => ({
                ...prev,
                district: "Please select a district"
            }));
            alert("Please select a district.");
            return;
        }

        // Check if all fields are filled
        for (let key in formData) {
            if (!formData[key] && key !== 'email_id') {
                alert("All fields are required!");
                return;
            }
        }

        if(formData.password !== formData.confirm_password){
            alert("Password and confirm password must be same");
            return;
        }
      
        try {
            const dataToSubmit = { ...formData,
                date_of_birth: formData.date_of_birth.split("-").reverse().join("-"), 
            };
            console.log(dataToSubmit);
            
            const response = await axios.post("http://localhost:5001/members/register", dataToSubmit);
            console.log(response.data);
            setUserDetails(response.data);
            // setShowPopup(true);
            // Clear form data after successful registration
            setFormData({
                name: "",
                guardian_name: "",
                date_of_birth: "",
                gender: "",
                mobile_number: "",
                email_id: "",
                state_id: "", 
                district_id: "", 
                terms_accepted: false,
                password: "",
                confirm_password: "",                
                key: ""
            });
            setErrors({
                name: "",
                guardian_name: "",
                mobile_number: "",
                password: "",
                state_id: "",
                district_id: "",
                date_of_birth: "",
                confirm_password: "",
                email_id: "",
                key: "",
                terms_accepted: "",
                servererror: ""
            });
            setShowTermsModal(false);
            setShowPopup(true);
            setShowError(false);
        } catch (err) {

            console.log("Server Error: ");
            console.log(err.response.data);
            //console.log(err.response.data.error);

            if (err.response && err.response.data) {
                // const errorMessage = err.response.data.details
                //     ?.map(detail => `${detail.field}: ${detail.message}`)
                //     .join("\n") || err.response.data.error;
                
                const errorMessage = Array.isArray(err.response.data.details)
                    ? err.response.data.details.map(detail => 
                        typeof detail === "object" 
                            ? `${detail.field}: ${detail.message}` 
                            : detail // Handle text-only errors like ['mobile_number already exists']
    ).join("\n")
    : err.response.data.details || err.response.data.error || "An unknown error occurred";


                setShowError(true);
                setErrors(prev => ({
                    ...prev,
                    servererror: errorMessage
                }));
            } else {
                setShowError(true);
                setErrors(prev => ({
                    ...prev,
                    servererror: "Registration failed: Please try again"
                }));
            }
        }
        
    };

    const TermsModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
    
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="overflow-y-auto flex-grow pr-4">
                        {termsAndConditions.map((section, index) => (
                            <div key={index} className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                                <div className="whitespace-pre-line text-gray-700">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end pt-4 border-t">
                        <button 
                            onClick={onClose}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    TermsModal.propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
            <div className="bg-white p-10 rounded-xl shadow-lg w-[1400px] mb-8">
                <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">Registration Form</h2>


                {showError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full" role="alert">
                        {Object.keys(errors).map((key) => (
                            errors[key] && <li key={key}>{errors[key]}</li>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        {/* Name */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">
                                Name <span className="text-red-500">*</span>
                                <span className="text-sm text-blue-600 ml-2">(Should match your Aadhaar card)</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full p-4 text-lg border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
                        </div>

                        {/* Guardian Name */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">Guardian Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="guardian_name"
                                value={formData.guardian_name}
                                onChange={handleChange}
                                required
                                className={`w-full p-4 text-lg border rounded-lg ${errors.guardian_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.guardian_name && <p className="text-sm text-red-500 mt-2">{errors.guardian_name}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                            <input 
                                type="date" 
                                name="date_of_birth" 
                                value={formData.date_of_birth} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-4 text-lg border rounded-lg ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'}`}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.date_of_birth && <p className="text-sm text-red-500 mt-2">{errors.date_of_birth}</p>}
                            {age !== null && (
                                <div className={`mt-2 text-lg font-semibold ${isUnderAge ? 'text-red-500' : 'text-green-600'}`}>
                                    Age: {age} years old
                                    {isUnderAge && <span className="block text-sm mt-1">Must be at least 18 years old to register</span>}
                                </div>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-4 text-lg border rounded-lg"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Transgender">Transgender</option>
                            </select>
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                            <input 
                                type="tel" 
                                name="mobile_number" 
                                value={formData.mobile_number} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-4 text-lg border rounded-lg ${errors.mobile_number ? 'border-red-500' : 'border-gray-300'}`}
                                maxLength={10}
                                placeholder="Enter 10-digit mobile number"
                            />
                            {errors.mobile_number && <p className="text-sm text-red-500 mt-2">{errors.mobile_number}</p>}
                        </div>

                        <div>
                            <label className="block text-xl text-gray-700 mb-2">
                                Email <span className="text-gray-400 text-base ml-2">(Optional)</span>
                            </label>
                            <input 
                                type="email" 
                                name="email_id" 
                                value={formData.email_id} 
                                onChange={handleChange} 
                                className={`w-full p-4 text-lg border rounded-lg ${errors.email_id ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your email address"
                            />
                            {errors.email_id && <p className="text-sm text-red-500 mt-2">{errors.email_id}</p>}
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                            <select 
                                name="state_id" 
                                value={formData.state_id} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-4 text-lg border rounded-lg ${errors.state_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                            {errors.state && <p className="text-sm text-red-500 mt-2">{errors.state}</p>}
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">District <span className="text-red-500">*</span></label>
                            <select 
                                name="district_id" 
                                value={formData.district_id} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-4 text-lg border rounded-lg ${errors.district_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </select>
                            {errors.district && <p className="text-sm text-red-500 mt-2">{errors.district}</p>}
                        </div>
                        
                        {/* Password */}
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                    className={`w-full p-4 text-lg border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    autoComplete="new-password"
                                    placeholder="Enter strong password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {/* Password strength indicators */}
                            <div className="mt-2 space-y-1 text-sm">
                                <div className={`flex items-center ${passwordStrength.length ? 'text-green-500' : 'text-gray-500'}`}>
                                    <span className="mr-1">✓</span>
                                    <span>At least 8 characters</span>
                                </div>
                                <div className={`flex items-center ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                                    <span className="mr-1">✓</span>
                                    <span>One uppercase letter</span>
                                </div>
                                <div className={`flex items-center ${passwordStrength.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                                    <span className="mr-1">✓</span>
                                    <span>One lowercase letter</span>
                                </div>
                                <div className={`flex items-center ${passwordStrength.number ? 'text-green-500' : 'text-gray-500'}`}>
                                    <span className="mr-1">✓</span>
                                    <span>One number</span>
                                </div>
                                <div className={`flex items-center ${passwordStrength.special ? 'text-green-500' : 'text-gray-500'}`}>
                                    <span className="mr-1">✓</span>
                                    <span>One special character (!@#$%^&*)</span>
                                </div>
                            </div>
                            {errors.password && <p className="text-sm text-red-500 mt-2">{errors.password}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-xl text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="confirm_password" 
                                    value={formData.confirm_password} 
                                    onChange={handleChange} 
                                    required 
                                    className={`w-full p-4 text-lg border rounded-lg ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {errors.confirm_password && (
                                <p className="text-sm text-red-500 mt-2">
                                    {errors.confirm_password}
                                </p>
                            )}
                        </div>

                        {/* Terms & Conditions and Key side by side */}
                        <div className="col-span-2 flex justify-between items-start space-x-8 mt-6 bg-gray-50 p-6 rounded-lg">
                            {/* Terms & Conditions */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox" 
                                        name="terms_accepted" 
                                        checked={formData.terms_accepted} 
                                        onChange={handleChange}
                                        className={`h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded 
                                            ${errors.terms_accepted ? 'border-red-500' : ''}`}
                                    />
                                    <span className="text-xl text-gray-700">I accept the</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowTermsModal(true)}
                                        className="text-xl text-blue-600 hover:text-blue-800 underline font-medium"
                                    >
                                        terms and conditions
                                    </button>
                                </div>
                                {errors.terms_accepted && (
                                    <p className="text-sm text-red-500 mt-2 ml-9">
                                        {errors.terms_accepted}
                                    </p>
                                )}
                            </div>

                            {/* Key */}
                            <div className="flex-1">
                                <label className="block text-xl text-gray-700 mb-2">Key <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="key" 
                                    value={formData.key} 
                                    onChange={handleChange} 
                                    required 
                                    className={`w-full p-4 text-lg border rounded-lg ${errors.key ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your key"
                                />
                                {errors.key && <p className="text-sm text-red-500 mt-2">{errors.key}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Register Button */}
                    <div className="flex justify-center mt-10">
                        <button 
                            type="submit" 
                            className={`px-16 py-4 text-xl rounded-lg font-semibold transition-colors ${
                                isUnderAge 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            disabled={isUnderAge}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
            
            <TermsModal 
                isOpen={showTermsModal} 
                onClose={() => setShowTermsModal(false)} 
            />
            
            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 animate-slideIn">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scaleIn">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                Thank you for registering!
                            </h2>
                            <p className="text-lg text-gray-700 px-4">
                                Welcome to Vertex Finance Company as a valued member.
                            </p>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg space-y-4 border-l-4 border-blue-500 shadow-sm">
                                <p className="text-gray-800 text-lg flex items-center justify-between group hover:bg-blue-50 p-2 rounded transition-all">
                                    <span className="font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                                        </svg>
                                        Name
                                    </span> 
                                    <span className="font-medium text-blue-700">{userDetails?.user?.name}</span>
                                </p>
                                <div className="border-t border-blue-200"></div>
                                <p className="text-gray-800 text-lg flex items-center justify-between group hover:bg-blue-50 p-2 rounded transition-all">
                                    <span className="font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                                        </svg>
                                        Password
                                    </span> 
                                    <span className="font-medium text-blue-700">{userDetails?.user?.password}</span>
                                </p>
                                <div className="border-t border-blue-200"></div>
                                <p className="text-gray-800 text-lg flex items-center justify-between group hover:bg-blue-50 p-2 rounded transition-all">
                                    <span className="font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                                        </svg>
                                        Account ID
                                    </span> 
                                    <span className="font-medium text-blue-700">{userDetails?.user?.account_number}</span>
                                </p>
                                <div className="border-t border-blue-200"></div>
                                <p className="text-gray-800 text-lg flex items-center justify-between group hover:bg-blue-50 p-2 rounded transition-all">
                                    <span className="font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        User ID
                                    </span> 
                                    <span className="font-medium text-blue-700">{userDetails?.user?.user_id}</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <Link 
                                to="/login" 
                                className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:shadow-lg transform hover:-translate-y-0.5 inline-block"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                
            )}
        </div>
    );
};

export default Register;
