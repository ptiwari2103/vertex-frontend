import { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 10;
const DISTRIBUTOR_TOKEN_KEY = "gift_distributor_token";

const LoginDistributor = () => {
    // Authorization state
    const [isAuthorized, setIsAuthorized] = useState(!!sessionStorage.getItem(DISTRIBUTOR_TOKEN_KEY));
    const [loginuserid, setLoginuserid] = useState(sessionStorage.getItem("distributor_id") || null);
    const [showAuthModal, setShowAuthModal] = useState(!sessionStorage.getItem(DISTRIBUTOR_TOKEN_KEY));
    const [authForm, setAuthForm] = useState({ user_id: "", password: "" });
    const [authError, setAuthError] = useState("");
    const [authSubmitting, setAuthSubmitting] = useState(false);

    // Main page state
    const [giftList, setGiftList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    //const [members, setMembers] = useState([]);
    const [gifts, setGifts] = useState([]);
    const [form, setForm] = useState({ member: "", gift: "", quantity: "" });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const [userId, setUserId] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessages, setSuccessMessages] = useState({serverresponse: ""});
    const [singleUser, setSingleUser] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState({ servererror: "" });

    // Helper: get distributor token
    const getDistributorToken = () => sessionStorage.getItem(DISTRIBUTOR_TOKEN_KEY);

    // Authorization modal handlers
    const handleAuthChange = (e) => {
        setAuthForm({ ...authForm, [e.target.name]: e.target.value });
    };
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (!authForm.user_id || !authForm.password) {
            setAuthError("Both User ID and Password are required.");
            return;
        }
        setAuthSubmitting(true);
        setAuthError("");
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/gifts/distributor-login`, {
                login_user_id: authForm.user_id,
                password: authForm.password
            });
            // console.log("res=",res);
            // console.log("distributed id =",res.data.user.id);
            if (res.data.success && res.data.token && res.data.user.id) {
                sessionStorage.setItem(DISTRIBUTOR_TOKEN_KEY, res.data.token);
                sessionStorage.setItem("distributor_id", res.data.user.id);
                setIsAuthorized(true);
                setShowAuthModal(false);
                setLoginuserid(res.data.user.id);
                
                await fetchMembersAndGifts(res.data.token); // fetch and update members/gifts after login
            } else {
                setAuthError("Invalid server response.");
            }
        } catch (error) {
            setAuthError(error.response?.data?.message || "Invalid User ID or Password.");
        } finally {
            setAuthSubmitting(false);
        }
    };

    
    useEffect(() => {
        const token = getDistributorToken();
        if (token) {
            fetchMembersAndGifts(token);
        }
        // eslint-disable-next-line
    }, [isAuthorized]);

    // Logout/reset auth
    const handleLogout = () => {
        sessionStorage.removeItem(DISTRIBUTOR_TOKEN_KEY);
        sessionStorage.removeItem("distributor_id");
        setIsAuthorized(false);
        setShowAuthModal(true);
        setLoginuserid(null);
    };

    // Fetch paginated gift_received list
    const fetchGiftList = async (pageNum = 1) => {
        setLoading(true);
        try {
            const token = getDistributorToken();
            const loginUserId = loginuserid;
            
            // Skip API call if loginUserId is null
            if (!loginUserId) {
                setGiftList([]);
                setTotalPages(1);
                setLoading(false);
                return;
            }
            
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/gifts/received`, {
                params: { 
                    page: pageNum, 
                    page_size: PAGE_SIZE,
                    distributor_id: loginUserId 
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("fetch gift list:", res);

            if(res.data.success){
                // Update state with the response data
                setGiftList(res.data.data || []);
                setTotalPages(res.data.total_pages || 1);
                setPage(res.data.page || 1);
            } else {
                setGiftList([]);
                setTotalPages(1);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) handleLogout();
            setGiftList([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };
    

    // Fetch members and gifts together after login
    const fetchMembersAndGifts = async (token) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/gifts/member-gift-list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //console.log(res);
            if(res.data.success) {
                //setMembers(res.data.users || []);
                setGifts(res.data.gifts || []);
            }else{
                console.log("Failed to fetch members and gifts");
            }
        } catch {
            //setMembers([]);
            setGifts([]);
        }
    };

    useEffect(() => {
        if (isAuthorized) fetchGiftList(page);
        // eslint-disable-next-line
    }, [page, isAuthorized]);

    // Modal open: fetch dropdowns
    const openModal = () => {
        setForm({ member: "", gift: "", quantity: "" });
        setFormError("");
        setShowModal(true);

        setUserId("");
        setSingleUser(null);
        setShowError(false);
        setErrors({ servererror: "" });
        setShowSuccess(false);
        setSuccessMessages({ servererror: "" });
    };

    // Modal close
    const closeModal = () => {
        setShowModal(false);
        setFormError("");
    };

    // Handle form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit gift distribution
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.member || !form.gift || !form.quantity) {
            setFormError("All fields are required");
            return;
        }
        setSubmitting(true);
        setFormError("");
        try {
            const token = getDistributorToken();
            await axios.post(`${import.meta.env.VITE_API_URL}/gifts/distribute`, {
                user_id: form.member,
                gift_id: form.gift,
                quantity: form.quantity,
                distributor_id: loginuserid
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            closeModal();
            fetchGiftList(1);
            setPage(1);
        } catch (error) {
            if (error.response && error.response.status === 401) handleLogout();
            setFormError(error.response?.data?.message || "Failed to distribute gift");
        } finally {
            setSubmitting(false);
        }
    };


    // Handle user ID changes
    useEffect(() => {
        if (userId && userId.length === 6) {  
            const token = getDistributorToken();          
            const fetchData = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/gifts/member/gift-status`, { "user_id": userId }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log('Response:', response.data);

                    if(response.data.success){
                        const userdata = response.data.user;
                        setSingleUser(userdata);

                        setShowSuccess(true);
                        setSuccessMessages(prev => ({
                            ...prev,
                            serverresponse: "Added in member list."
                        }));

                        setShowError(false);
                        setErrors({ servererror: "" })
                    }else{
                        setShowSuccess(true);
                        setSuccessMessages(prev => ({
                            ...prev,
                            serverresponse: response.data.message
                        }));
                    }
                } catch (err) {                    
                    console.log("Server Error22:", err.response?.data || err.message); // Log the full error response
                    if (err.response && err.response.data) {
                        const errorMessage =  err.response.data.message || "An unknown error occurred";
                        setShowError(true);
                        setErrors(prev => ({
                            ...prev,
                            servererror: errorMessage
                        }));
                    } else {
                        setShowError(true);
                        setErrors(prev => ({
                            ...prev,
                            servererror: "There was an error: Please try again"
                        }));
                    }
                }
            };    
            fetchData(); // Invoke the function
        }
    }, [userId]);



    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <h3 className="text-lg font-semibold mb-4">Gift Distributor Login</h3>
                        <form onSubmit={handleAuthSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium">User ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="user_id"
                                    value={authForm.user_id}
                                    onChange={handleAuthChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium">Password <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={authForm.password}
                                    onChange={handleAuthChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            {authError && <div className="text-red-500 text-sm mb-2">{authError}</div>}
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-700 transition mx-auto block"
                                disabled={authSubmitting}
                            >
                                {authSubmitting ? "Authorizing..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Content: Only render if authorized */}
            {isAuthorized && <>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gift Received</h2>
                    <div className="flex gap-2">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={openModal}
                        >
                            Gift Distribute
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={() => {
                                sessionStorage.clear();
                                setIsAuthorized(false);
                                setShowAuthModal(true);
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gift Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distributed By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                            ) : giftList.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8">No record found.</td></tr>
                            ) : (
                                giftList.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.user.name + ' (' + item.user.user_id + ')'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.gift.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.distributor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >Prev</button>
                        <span className="px-3 py-1">Page {page} of {totalPages}</span>
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                        >Next</button>
                    </div>
                )}
                {/* Modal */}
                {showModal && (                    

                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-10">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                            <h3 className="text-lg font-semibold mb-4">Distribute Gift</h3>
                            
                            {showSuccess && (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 w-full mb-4" role="alert">
                                    {Object.keys(successMessages).map((key) => (
                                        successMessages[key] && <li key={key}>{successMessages[key]}</li>
                                    ))}
                                </div>
                            )}


                            {/* Regular error messages */}
                            {showError && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full mb-4" role="alert">
                                    {Object.keys(errors).map((key) => (
                                        errors[key] && <li key={key}>{errors[key]}</li>
                                    ))}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium">User ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter your user ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoComplete="off"
                                    name="username"
                                    maxLength={6}
                                />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm font-medium">Member <span className="text-red-500">*</span></label>
                                    <select
                                        name="member"
                                        value={form.member}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Member</option>
                                        {singleUser && (
                                            <option value={singleUser.id}>{singleUser.name+' ('+singleUser.user_id+')'}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm font-medium">Gift <span className="text-red-500">*</span></label>
                                    <select
                                        name="gift"
                                        value={form.gift}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Gift</option>
                                        {gifts.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
                                    <select
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Quantity</option>
                                        {[...Array(2)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-700 transition mx-auto block"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </>}
        </div>
    );
};

export default LoginDistributor;