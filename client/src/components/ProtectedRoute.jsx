  import { useEffect, useState } from 'react';
  import { Navigate } from 'react-router-dom';
  import { Loader, Center } from '@mantine/core';

  const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('jwt');
      setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
      return (
        <Center style={{ height: '100vh' }}>
          <Loader size="xl" />
        </Center>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  export default ProtectedRoute;
