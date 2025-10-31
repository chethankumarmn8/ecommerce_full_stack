import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);

                // Validate token expiration
                if (decoded.exp * 1000 < Date.now()) {
                    throw new Error('Token expired');
                }

                setUser({
                    email: decoded.sub,
                    role: decoded.role,
                    userId: decoded.userId  // Ensure this matches your token structure
                });
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication error:', error);
                logout();
            }
        }
        setAuthChecked(true);
    }, [logout]);

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('userToken', data.token);
            const decoded = jwtDecode(data.token);

            setUser({
                email: decoded.sub,
                role: decoded.role,
                userId: decoded.userId
            });
            setIsAuthenticated(true);

            const redirectPath = sessionStorage.getItem('redirectPath') || '/';
            sessionStorage.removeItem('redirectPath');
            navigate(redirectPath);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            showAuthModal,
            setShowAuthModal,
            authMode,
            setAuthMode,
            login,
            logout,
            isAuthenticated,
            user,
            authChecked
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);