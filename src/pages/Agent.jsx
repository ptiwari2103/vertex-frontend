import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';

const Agent = () => {
    const { userdata } = useContext(AuthContext);
    const [isAgent, setIsAgent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Check if user is already an agent
    useEffect(() => {
        // const checkAgentStatus = async () => {
        //     try {
        //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/members/${userdata?.id}/agent-status`, {
        //             headers: {
        //                 Authorization: `Bearer ${localStorage.getItem('token')}`
        //             }
        //         });
                
        //         if (response.data.success) {
        //             setIsAgent(true);
        //         }
        //     } catch (error) {
        //         console.error('Error checking agent status:', error);
        //     }
        // };

        // if (userdata?.id) {
        //     checkAgentStatus();
        // }


    //     const getAgentMember = async() => {
    //         try {
    //             const agentmember = await axios.get(`${import.meta.env.VITE_API_URL}/members/${userdata?.id}/agent-members`, {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             });
    //             console.log(agentmember);
    //         }catch(error){
    //             console.error('Error checking get agent member:', error);
    //         }
    //     }
    //     if(userdata?.id){
    //         getAgentMember();
    //     }

        if(userdata?.agent?.id){
            setIsAgent(true);
        }
    
     }, [userdata?.id]);

    const handleRequestAgent = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/members/request-agent`,
                { user_id: userdata?.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                setSuccessMessage('Your agent request has been submitted successfully!');
                setIsAgent(true);
            } else {
                setError(response.data.message || 'Failed to submit agent request. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
            console.error('Error requesting agent status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Agent Dashboard</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}
                
                {!isAgent ? (
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            Become an agent to start adding new members to the platform and earn commissions.
                        </p>
                        <button
                            onClick={handleRequestAgent}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Request to become an Agent'}
                        </button>
                    </div>
                ) : (
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            You are now an agent. You can add new members to the platform.
                        </p>
                        <button
                            onClick={() => window.location.href = '/register'}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                        >
                            Add Member
                        </button>
                    </div>
                )}
                
                {isAgent && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Members</h2>
                        
                        {userdata?.agentmembers && userdata.agentmembers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {userdata.agentmembers.map((member, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-900">{member.name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{member.user_id}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{member.email_id}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{member.mobile_number}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {member.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-lg text-center">
                                <p className="text-gray-600 mb-4">You don't have any members yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Agent;
