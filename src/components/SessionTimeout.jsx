import { useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import PropTypes from 'prop-types';

const SessionTimeout = ({ timeoutMinutes = 1 }) => {
    const { logout } = useContext(AuthContext);
    
    // Convert minutes to milliseconds
    const timeoutDuration = timeoutMinutes * 60 * 1000;
    
    // Function to handle user activity
    const handleUserActivity = useCallback(() => {
        // Update the last activity timestamp in localStorage
        localStorage.setItem('lastActivityTime', Date.now().toString());
    }, []);
    
    // Function to check for session timeout
    const checkForInactivity = useCallback(() => {
        const lastActivityTime = parseInt(localStorage.getItem('lastActivityTime') || Date.now().toString(), 10);
        const currentTime = Date.now();
        const inactiveTime = currentTime - lastActivityTime;
        
        // If inactive for too long, log out
        if (inactiveTime > timeoutDuration && localStorage.getItem('token')) {
            console.log(`Session timeout: Inactive for ${inactiveTime / 1000} seconds`);
            
            // Set session expired flag in localStorage
            localStorage.setItem('sessionExpired', 'true');
            
            // Perform logout
            logout();
            
            // Redirect to login page using window.location
            window.location.href = '/login';
        }
    }, [logout, timeoutDuration]);
    
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
        const intervalId = setInterval(checkForInactivity, 10000); // Check every 10 seconds
        
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
