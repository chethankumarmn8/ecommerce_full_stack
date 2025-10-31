import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const PrivateRoute = () => {
    const { isAuthenticated, authChecked } = useAuth();
    if (!authChecked) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner
                    animation="border"
                    role="status"
                    style={{ width: '3rem', height: '3rem' }}
                >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;