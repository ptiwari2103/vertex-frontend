import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';

const Agent = () => {
    const { userdata, updateuserdata, updateagentmembercount, setpagerefresh } = useContext(AuthContext);
    const [isAgent, setIsAgent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [agentMembers, setAgentMembers] = useState([]);

    // Check if user is already an agent
    useEffect(() => {
        if(userdata?.agent?.id){
            setIsAgent(true);
            setpagerefresh(true);
        }
    }, [userdata?.agent?.id, setpagerefresh]);

    useEffect(() => {
        if(userdata?.id){
            const fetchAgentlist = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/members/${userdata?.id}/agent-members`,
                        {
                            headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (response.data.success) {
                    //console.log(response);
                    setAgentMembers(response.data.data);
                    updateagentmembercount(response.data.data.length)
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
            fetchAgentlist();
        }
    }, [userdata?.id, updateagentmembercount]);

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
                updateuserdata(response.data.data);
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
                        {(userdata.agent.status === "Approved" && userdata.profile.is_agent === "Active") || 
                         (userdata.agent.status === "Pending") ? (
                            <>
                                <p className="text-gray-600 mb-4">
                                    You are now an agent. You can add new members to the platform.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/register'}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                                >
                                    Add Member
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-4">
                                Your agent account is deactivated. Please contact support.
                                </p>
                                <button
                                    disabled
                                    className="bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out opacity-50 cursor-not-allowed"
                                >
                                    Add Member
                                </button>
                            </>
                        )}
                    </div>
                )}
                
                {isAgent && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Members</h2>
                        
                        {agentMembers.length > 0 ? (
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
                                        {agentMembers.map((member, index) => (
                                            <tr 
                                                key={index} 
                                                className={`hover:bg-gray-50 ${index < import.meta.env.VITE_AGENT_WORKING_MEMBER_START ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
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
