import React, { useState } from "react";

const PinManagement = () => {
    const [pins, setPins] = useState([
        { id: 1, pin: "123456", usedUser: null, created_at: "2025-03-20", assigned_date: "2025-03-22", used_date: null },
        { id: 2, pin: "789012", usedUser: { name: "Jane Doe" }, created_at: "2025-03-18", assigned_date: null, used_date: "2025-03-22" },
        { id: 3, pin: "345678", usedUser: null, created_at: "2025-03-21", assigned_date: null, used_date: null }
    ]);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 3, totalPins: 30 });
    const [selectedPins, setSelectedPins] = useState([]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-2 border border-gray-300">Pin</th>
                            <th className="p-2 border border-gray-300">Used By</th>
                            <th className="p-2 border border-gray-300">Created Date</th>
                            <th className="p-2 border border-gray-300">Assigned Date</th>
                            <th className="p-2 border border-gray-300">Used Date</th>
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
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    Showing <span>1</span> to <span>10</span> of <span>{pagination.totalPins}</span> entries
                </div>
                <nav>
                    <ul className="flex space-x-2">
                        <li className={`px-3 py-1 border rounded-md ${pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                            <a href="#">Previous</a>
                        </li>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <li key={page} className={`px-3 py-1 border rounded-md ${pagination.currentPage === page ? "bg-blue-500 text-white" : "cursor-pointer"}`}>
                                <a href="#">{page}</a>
                            </li>
                        ))}
                        <li className={`px-3 py-1 border rounded-md ${pagination.currentPage === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                            <a href="#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default PinManagement;
