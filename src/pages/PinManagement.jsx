import React, { useState, useEffect, useContext, useCallback } from "react";
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

    useEffect(() => {
        fetchPins();
    }, [fetchPins]);

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
                className={`px-3 py-1 border rounded-md cursor-pointer ${
                    pagination.currentPage === index + 1 
                    ? "bg-blue-500 text-white" 
                    : "hover:bg-gray-100"
                }`}
            >
                {index + 1}
            </li>
        ));
    };

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
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
                                        className={`px-3 py-1 border rounded-md ${
                                            pagination.currentPage === 1 
                                            ? "opacity-50 cursor-not-allowed" 
                                            : "cursor-pointer hover:bg-gray-100"
                                        }`}
                                    >
                                        Previous
                                    </li>
                                    {renderPageNumbers()}
                                    <li 
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        className={`px-3 py-1 border rounded-md ${
                                            pagination.currentPage === pagination.totalPages 
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
