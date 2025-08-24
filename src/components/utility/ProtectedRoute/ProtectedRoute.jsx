import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const loginData = useSelector((state) => state.login.loginState);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loginData?.token) {
            navigate('/login');
        }
    }, [loginData, navigate]);

    return loginData?.token ? children : null;
}

export default ProtectedRoute
