import { useState, useEffect } from "react";
import axios from "axios";

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
        terms_accepted: false
    });

    const [errors, setErrors] = useState({
        name: "",
        guardian_name: "",
        mobile_number: "",
        password: "",
        state_id: "",
        district_id: ""
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
        if (!/^[6-9]\d{9}$/.test(value)) {
            return "Enter valid 10-digit mobile number starting with 6-9";
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
            return;
        }

        // For name and guardian_name fields
        if (name === "name" || name === "guardian_name") {
            //alert(value);
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

        // For password validation
        if (name === "password") {
            const error = validatePassword(value);
            setErrors(prev => ({
                ...prev,
                password: error
            }));
            setFormData({
                ...formData,
                password: value
            });
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
        if (errors.name || errors.guardian_name || errors.mobile_number || errors.password) {
            alert("Please fix the validation errors before submitting.");
            return;
        }

        // Validate mobile number before submission
        const mobileError = validateMobile(formData.mobile_number);
        if (mobileError) {
            setErrors(prev => ({
                ...prev,
                mobile_number: mobileError
            }));
            alert("Please enter a valid mobile number.");
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
            if (!formData[key]) {
                alert("All fields are required!");
                return;
            }
        }

        if (!formData.terms_accepted) {
            alert("You must agree to the terms and conditions.");
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
            setShowPopup(true);
            // Clear form data after successful registration
            setFormData({
                name: "",
                password: "",
                guardian_name: "",
                date_of_birth: "",
                gender: "",
                mobile_number: "",
                state_id: "", 
                district_id: "", 
                terms_accepted: false
            });
        } catch (err) {
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.details
                    ?.map(detail => `${detail.field}: ${detail.message}`)
                    .join("\n") || err.response.data.error;
        
                alert("Registration failed: " + errorMessage);
            } else {
                alert("Registration failed: Please try again");
            }
        }
        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] mb-8">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>

                <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-6 mb-16" autoComplete="off">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Name <span className="text-red-500">*</span>
                        <span className="text-xs text-green-500 mt-1"> (Your name should match the Aadhaar.)</span>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                            autoComplete="off"
                            maxLength={50}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-2 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
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
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Father's/Husband's Name */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Father&apos;s/Husband&apos;s Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="guardian_name" 
                            value={formData.guardian_name} 
                            onChange={handleChange} 
                            required 
                            className={`w-full p-2 border rounded-lg ${errors.guardian_name ? 'border-red-500' : ''}`}
                            autoComplete="off"
                            maxLength={50}
                        />
                        {errors.guardian_name && <p className="text-xs text-red-500 mt-1">{errors.guardian_name}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Date of Birth <span className="text-red-500">*</span></label>
                        <input 
                            type="date" 
                            name="date_of_birth" 
                            value={formData.date_of_birth} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Gender <span className="text-red-500">*</span></label>
                        <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                        </select>
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Mobile Number <span className="text-red-500">*</span></label>
                        <input 
                            type="tel" 
                            name="mobile_number" 
                            value={formData.mobile_number} 
                            onChange={handleChange} 
                            required 
                            className={`w-full p-2 border rounded-lg ${errors.mobile_number ? 'border-red-500' : ''}`}
                            maxLength={10}
                            placeholder="Enter 10-digit mobile number"
                        />
                        {errors.mobile_number && <p className="text-xs text-red-500 mt-1">{errors.mobile_number}</p>}
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">State <span className="text-red-500">*</span></label>
                        <select 
                            name="state_id" 
                            value={formData.state_id} 
                            onChange={handleChange} 
                            required 
                            className={`w-full p-2 border rounded-lg ${errors.state_id ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </select>
                        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">District <span className="text-red-500">*</span></label>
                        <select 
                            name="district_id" 
                            value={formData.district_id} 
                            onChange={handleChange} 
                            required 
                            className={`w-full p-2 border rounded-lg ${errors.district_id ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                        {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                    </div>

                    {/* Terms & Conditions - Full width */}
                    <div className="flex items-center col-span-2 space-x-2">
                        <input type="checkbox" name="terms_accepted" checked={formData.terms_accepted} onChange={handleChange} />
                        <span className="text-sm">I agree to the</span>
                        <a 
                            href="/terms-and-conditions.html" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                            terms and conditions
                        </a>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 col-span-2">
                        Register
                    </button>
                </form>
            </div>

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
                            <button 
                                onClick={() => setShowPopup(false)} 
                                className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
