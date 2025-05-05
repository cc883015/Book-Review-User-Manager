import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import jwt_decode from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.is_admin);
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
