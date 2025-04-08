import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

const PinManagement = () => {
    const { userdata } = useContext(AuthContext);
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [sorting, setSorting] = useState({
        field: 'created_at',
        order: 'desc'
    });
    // New state variables for pin password functionality
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [pinPassword, setPinPassword] = useState('');
    const [pinPasswordError, setPinPasswordError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showVerificationPassword, setShowVerificationPassword] = useState(false);

    // Add ref for input focus
    const pinInputRef = useRef(null);
    const pinVerificationInputRef = useRef(null);

    // Function to check pin password status and show appropriate modal
    const checkPinPasswordStatus = useCallback(() => {
        if (!userdata) return;

        if (userdata.pin_password_status === 'Active') {
            setShowVerifyModal(true);
        } else {
            setShowCreateModal(true);
        }
    }, [userdata]);

    // Function to verify pin password
    const verifyPinPassword = async () => {
        try {
            setPinPasswordError('');
            const response = await axios.post(
                'http://localhost:5001/members/verify-pin-password',
                { pin_password: pinPassword, user_id: userdata?.id },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (response.data.success) {
                setIsAuthenticated(true);
                setShowVerifyModal(false);
                fetchPins();
            } else {
                setPinPasswordError('Incorrect pin password. Please try again.');
            }
        } catch (err) {
            console.error('Error verifying pin password:', err);
            setPinPasswordError('Failed to verify pin password. Please try again.');
        }
    };

    // Function to create pin password
    const createPinPassword = async () => {
        try {
            setPinPasswordError('');
            if (!pinPassword || pinPassword.length < 4) {
                setPinPasswordError('Pin password must be at least 4 characters.');
                return;
            }

            const response = await axios.post(
                'http://localhost:5001/members/create-pin-password',
                { pin_password: pinPassword, user_id: userdata?.id },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (response.data.success) {
                setIsAuthenticated(true);
                setShowCreateModal(false);
                fetchPins();
            } else {
                setPinPasswordError('Failed to create pin password. Please try again.');
            }
        } catch (err) {
            console.error('Error creating pin password:', err);
            setPinPasswordError('Failed to create pin password. Please try again.');
        }
    };

    const fetchPins = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5001/pins/assignedpins`, {
                params: {
                    user_id: userdata?.id,
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    sort_by: sorting.field,
                    sort_order: sorting.order
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const pinsData = response.data.pins || [];
            const total = response.data.total || 0;

            setPins(pinsData);
            setPagination(prev => ({
                ...prev,
                totalPages: Math.max(1, Math.ceil(total / pagination.itemsPerPage)),
                totalItems: total
            }));
            setError(null);
        } catch (err) {
            setError("Failed to fetch pins. Please try again later.");
            console.error("Error fetching pins:", err);
            setPagination(prev => ({
                ...prev,
                totalPages: 1,
                totalItems: 0
            }));
            setPins([]);
        } finally {
            setLoading(false);
        }
    }, [userdata?.id, pagination.currentPage, pagination.itemsPerPage, sorting.field, sorting.order]);

    // Check pin password status on page load
    useEffect(() => {
        if (userdata && !pageLoaded) {
            setPageLoaded(true);
            checkPinPasswordStatus();
        }
    }, [userdata, pageLoaded, checkPinPasswordStatus]);

    // Only fetch pins when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log("Fetching pins...");
            fetchPins();
        }
    }, [isAuthenticated, fetchPins]);

    const handleSort = (field) => {
        setSorting(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const getSortIcon = (field) => {
        if (sorting.field !== field) return '↕️';
        return sorting.order === 'asc' ? '↑' : '↓';
    };

    const renderPageNumbers = () => {
        const totalPages = Math.max(1, Math.floor(pagination.totalPages || 1));
        if (totalPages <= 1) return null;

        return Array.from({ length: totalPages }, (_, index) => (
            <li
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded-md cursor-pointer ${pagination.currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
            >
                {index + 1}
            </li>
        ));
    };

    // Modal component for verifying pin password
    const VerifyPinPasswordModal = () => {
        useEffect(() => {
            if (pinVerificationInputRef.current) {
                pinVerificationInputRef.current.focus();
            }
        }, []);

        return (
            // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            // <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            // <div className="relative mt-0 z-40 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="relative mt-0 z-40">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto"> 
                    <h2 className="text-xl font-semibold mb-4">Enter Pin Password</h2>
                    <p className="mb-4">Please enter your 4-digit pin password to view pins.</p>
                    <div className="relative">
                        <input
                            type={showVerificationPassword ? 'text' : 'password'}
                            value={pinPassword}
                            ref={pinVerificationInputRef}
                            onChange={(e) => setPinPassword(e.target.value)}
                            placeholder="Enter pin password"
                            maxLength={4}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setShowVerificationPassword(!showVerificationPassword);
                                // Return focus to the input after toggling visibility
                                setTimeout(() => {
                                    if (pinVerificationInputRef.current) {
                                        pinVerificationInputRef.current.focus();
                                    }
                                }, 0);
                            }}
                        >
                            {showVerificationPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {pinPasswordError && (
                        <p className="text-red-500 mb-4">{pinPasswordError}</p>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={verifyPinPassword}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Modal component for creating pin password
    const CreatePinPasswordModal = () => {
        // Use useEffect to focus the input when the component mounts
        useEffect(() => {
            if (pinInputRef.current) {
                pinInputRef.current.focus();
            }
        }, []);

        return (
            <div className="relative mt-0 z-40">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Create Pin Password</h2>
                    <p className="mb-4">Please create a 4 digit pin password to secure your pins.</p>
                    <div className="relative">
                        <input
                            ref={pinInputRef}
                            type={showPassword ? 'text' : 'password'}
                            value={pinPassword}
                            onChange={(e) => setPinPassword(e.target.value)}
                            maxLength={4}
                            placeholder="Create pin password"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setShowPassword(!showPassword);
                                // Return focus to the input after toggling visibility
                                setTimeout(() => {
                                    if (pinInputRef.current) {
                                        pinInputRef.current.focus();
                                    }
                                }, 0);
                            }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {pinPasswordError && (
                        <p className="text-red-500 mb-4">{pinPasswordError}</p>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={createPinPassword}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {showVerifyModal && <VerifyPinPasswordModal />}
            {showCreateModal && <CreatePinPasswordModal />}

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-2 border border-gray-300">Pin</th>
                                    <th
                                        className="p-2 border border-gray-300 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('used_by')}
                                    >
                                        Used By {getSortIcon('used_by')}
                                    </th>
                                    <th
                                        className="p-2 border border-gray-300 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        Created Date {getSortIcon('created_at')}
                                    </th>
                                    <th
                                        className="p-2 border border-gray-300 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('assigned_date')}
                                    >
                                        Assigned Date {getSortIcon('assigned_date')}
                                    </th>
                                    <th
                                        className="p-2 border border-gray-300 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('used_date')}
                                    >
                                        Used Date {getSortIcon('used_date')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pins.map((pin) => (
                                    <tr key={pin.id} className="border border-gray-200 text-center">
                                        <td className="p-2 border border-gray-300">{pin.pin}</td>
                                        <td className="p-2 border border-gray-300">{pin.usedUser ? pin.usedUser.name : "-"}</td>
                                        <td className="p-2 border border-gray-300">{new Date(pin.created_at).toLocaleDateString()}</td>
                                        <td className="p-2 border border-gray-300">{pin.assigned_date ? new Date(pin.assigned_date).toLocaleDateString() : "-"}</td>
                                        <td className="p-2 border border-gray-300">{pin.used_date ? new Date(pin.used_date).toLocaleDateString() : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                Showing {Math.max(1, ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1)} to{" "}
                                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems || 0)} of{" "}
                                {pagination.totalItems || 0} entries
                            </div>
                            <nav>
                                <ul className="flex space-x-2">
                                    <li
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        className={`px-3 py-1 border rounded-md ${pagination.currentPage === 1
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer hover:bg-gray-100"
                                            }`}
                                    >
                                        Previous
                                    </li>
                                    {renderPageNumbers()}
                                    <li
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        className={`px-3 py-1 border rounded-md ${pagination.currentPage === pagination.totalPages
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer hover:bg-gray-100"
                                            }`}
                                    >
                                        Next
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PinManagement;
