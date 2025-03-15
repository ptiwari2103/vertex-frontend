import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
