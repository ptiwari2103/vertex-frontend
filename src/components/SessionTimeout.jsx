import { useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import PropTypes from 'prop-types';

const SessionTimeout = ({ timeoutMinutes = import.meta.env.VITE_SESSION_TIMEOUT }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Convert minutes to milliseconds
    const timeoutDuration = timeoutMinutes * 60 * 1000;
    
    // Function to handle user activity
    const handleUserActivity = useCallback(() => {
        // Update the last activity timestamp in localStorage
        console.log('lastActivityTime=', Date.now().toString());
        localStorage.setItem('lastActivityTime', Date.now().toString());
    }, []);
    
    // Function to check for session timeout
    const checkForInactivity = useCallback(() => {
        const lastActivityTime = parseInt(localStorage.getItem('lastActivityTime') || Date.now().toString(), 10);
        const currentTime = Date.now();
        const inactiveTime = currentTime - lastActivityTime;
        
        // If inactive for too long, log out
        if (inactiveTime > timeoutDuration && localStorage.getItem('token')) {
            
            const sessionExpired = localStorage.getItem('sessionExpired');
            console.log('sessionExpired1=', sessionExpired);

            console.log(`Session timeout: Inactive for ${inactiveTime / 1000} seconds`);
            
            // First set session expired flag in localStorage
            localStorage.setItem('sessionExpired', 'true');
            
            const sessionExpired2 = localStorage.getItem('sessionExpired');
            console.log('sessionExpired2=', sessionExpired2);

            // Perform logout
            logout();
            
            // Navigate to login page
            navigate('/login');
        }
    }, [logout, navigate, timeoutDuration]);
    
    // Set up activity tracking and inactivity checking
    useEffect(() => {
        // Only set up if user is logged in
        if (!localStorage.getItem('token')) {
            return;
        }
        
        console.log("Setting up session timeout monitoring");
        
        // Initialize last activity time
        if (!localStorage.getItem('lastActivityTime')) {
            localStorage.setItem('lastActivityTime', Date.now().toString());
        }
        
        // Set up event listeners for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleUserActivity);
        });
        
        // Set up interval to check for inactivity
        const intervalId = setInterval(checkForInactivity, 60000); // Check every 60 seconds
        
        // Clean up
        return () => {
            // Remove event listeners
            events.forEach(event => {
                window.removeEventListener(event, handleUserActivity);
            });
            
            // Clear interval
            clearInterval(intervalId);
        };
    }, [handleUserActivity, checkForInactivity]);
    
    // This component doesn't render anything
    return null;
};

SessionTimeout.propTypes = {
    timeoutMinutes: PropTypes.number
};

export default SessionTimeout;
