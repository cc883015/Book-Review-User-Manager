import { useState } from 'react';
import { TextInput, PasswordInput, Button, Alert, Modal, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      // Assuming the response contains the JWT token
      const { token } = await response.json();

  
      localStorage.setItem('jwt', token);

     
      setSuccessModalOpen(true);

      // Show notification
      notifications.show({
        title: 'Login Successful',
        message: 'You have successfully logged in!',
        color: 'green',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    // Navigate to home page after closing the modal
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
      {error && <Alert color="red">{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          fullWidth
          mt="sm"
          loading={loading}
          disabled={loading}
        >
          Log In 🏠
        </Button>
      </form>

      {/* Success Modal */}
      <Modal
        opened={successModalOpen}
        onClose={handleSuccessModalClose}
        title="Login Successful"
        centered
      >
        <Text mb="md">You have successfully logged in!</Text>
        <Group position="right">
          <Button onClick={handleSuccessModalClose}>Continue</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default Login;
