import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Group,
  Button,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Checkbox,
  PasswordInput,
  Center,
  Loader,
  Pagination
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      is_admin: false
    },
    validate: {
      username: (value) => (value ? null : 'Username cannot be empty'),
      password: (value, values) => {
        // Password is required for new users, optional when editing
        if (!editingUser && !value) return 'Password cannot be empty';
        if (value && value.length < 6) return 'Password must be at least 6 characters';
        return null;
      }
    }
  });

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user list');

      const data = await response.json();
      setUsers(data);

      // Parse pagination information
      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const links = {};
        linkHeader.split(',').forEach(link => {
          const match = link.match(/<([^>]+)>; rel="([^"]+)"/);
          if (match) {
            const url = match[1];
            const rel = match[2];
            links[rel] = url;
          }
        });

        if (links.last) {
          const lastPageMatch = links.last.match(/page=(\d+)/);
          if (lastPageMatch) {
            setTotalPages(parseInt(lastPageMatch[1], 10));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch user list',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values) => {
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const newUser = await response.json();
      notifications.show({
        title: 'Success',
        message: 'User created successfully',
        color: 'green'
      });
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create user',
        color: 'red'
      });
    }
  };

  const handleUpdateUser = async (values) => {
    if (!editingUser) return;

    const token = localStorage.getItem('jwt');
    const updateData = { ...values };

    // If password is empty, don't send password field
    if (!updateData.password) {
      delete updateData.password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
        color: 'green'
      });
      setModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update user',
        color: 'red'
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green'
      });
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete user',
        color: 'red'
      });
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.reset();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.setValues({
      username: user.username,
      password: '',
      is_admin: user.is_admin
    });
    setModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  if (loading && users.length === 0) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Group position="apart" mb="xl">
        <Title order={1}>User Management</Title>
        <Button leftIcon={<IconPlus size={16} />} onClick={openCreateModal}>
          Add User ➕
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                <Badge color={user.is_admin ? 'blue' : 'gray'}>
                  {user.is_admin ? 'Admin' : 'Regular User'}
                </Badge>
              </td>
              <td>
                <Group spacing="xs">
                  <ActionIcon color="blue" onClick={() => openEditModal(user)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => openDeleteModal(user)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Center mt="xl">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
          />
        </Center>
      )}

      {/* Create/Edit User Form */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
          form.reset();
        }}
        title={editingUser ? "Edit User" : "Add User"}
        size="md"
      >
        <form onSubmit={form.onSubmit(editingUser ? handleUpdateUser : handleCreateUser)}>
          <TextInput
            label="Username"
            placeholder="Enter username"
            required
            {...form.getInputProps('username')}
            mb="md"
          />
          <PasswordInput
            label={editingUser ? "Password (leave empty to keep unchanged)" : "Password"}
            placeholder="Enter password"
            required={!editingUser}
            {...form.getInputProps('password')}
            mb="md"
          />
          <Checkbox
            label="Admin privileges"
            {...form.getInputProps('is_admin', { type: 'checkbox' })}
            mb="md"
          />
          <Group position="right">
            <Button type="button" variant="outline" onClick={() => {
              setModalOpen(false);
              setEditingUser(null);
              form.reset();
            }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? "Update" : "Create"}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Delete confirmation dialog */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        <Text mb="md">
          Are you sure you want to delete user "{userToDelete?.username}"? This action cannot be undone.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => {
            setDeleteModalOpen(false);
            setUserToDelete(null);
          }}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default Users;
