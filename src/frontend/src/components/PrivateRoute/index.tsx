import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
    // If not authenticated, redirect to the login page
    const expiration = sessionStorage.getItem('expiration');
    console.log(expiration)
    const isAuthenticated = expiration && new Date().getTime() < Number(expiration);
    console.log(isAuthenticated)
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;