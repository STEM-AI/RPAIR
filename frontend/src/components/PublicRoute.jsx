import { Navigate } from 'react-router-dom';
import { getTokens } from '../pages/Auth/auth';

const PublicRoute = ({ children }) => {
    const { access_token } = getTokens();
        if (access_token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PublicRoute;
