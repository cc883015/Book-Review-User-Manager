import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Group,
  Card,
  Badge,
  Button,
  Center,
  Loader,
  Modal,
  Textarea,
  Select,
  ActionIcon,
  Paper,
  Image,
  SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import jwt_decode from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const form = useForm({
    initialValues: {
      rating: '5',
      comment: ''
    },
    validate: {
      comment: (value) => (value.trim().length > 0 ? null : 'Comment cannot be empty')
    }
  });

  useEffect(() => {
    // Get user ID
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Invalid token:', error);
        notifications.show({
          title: 'Error',
          message: 'Invalid login information, please log in again',
          color: 'red'
        });
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMyReviews();
    }
  }, [userId]);

  const fetchMyReviews = async () => {
    if (!userId) return;

    setLoading(true);
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch reviews',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (values) => {
    if (!editingReview) return;

    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${editingReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(values.rating),
          comment: values.comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      const updatedReview = await response.json();
      notifications.show({
        title: 'Success',
        message: 'Review updated successfully',
        color: 'green'
      });
      setEditModalOpen(false);
      setEditingReview(null);

      // Update local review list
      setReviews(reviews.map(review =>
        review._id === updatedReview._id ? updatedReview : review
      ));
    } catch (error) {
      console.error('Error updating review:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update review',
        color: 'red'
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      notifications.show({
        title: 'Success',
        message: 'Review deleted successfully',
        color: 'green'
      });
      setDeleteModalOpen(false);
      setReviewToDelete(null);

      // Update local review list
      setReviews(reviews.filter(review => review._id !== reviewToDelete._id));
    } catch (error) {
      console.error('Error deleting review:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete review',
        color: 'red'
      });
    }
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    form.setValues({
      rating: review.rating.toString(),
      comment: review.comment
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Title order={1} mb="xl">My Reviews</Title>

      {reviews.length === 0 ? (
        <Center style={{ height: '30vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Text size="xl" color="dimmed" mb="md">You haven't posted any reviews yet</Text>
            <Button component={Link} to="/books">
              Browse Books
            </Button>
          </div>
        </Center>
      ) : (
        <SimpleGrid cols={1} spacing="lg">
          {reviews.map(review => (
            <Paper key={review._id} p="md" withBorder>
              <Group position="apart" mb="md">
                <Group>
                  <Image
                    src={review.book.coverImage}
                    width={80}
                    height={120}
                    fit="contain"
                    radius="md"
                  />
                  <div>
                    <Text weight={500} component={Link} to={`/books/${review.book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {review.book.title}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Author: {review.book.author}
                    </Text>
                    <Badge color={getRatingColor(review.rating)} mt="xs">
                      {review.rating} ★
                    </Badge>
                    <Text size="xs" color="dimmed" mt="xs">
                      Reviewed on {formatDate(review.createdAt)}
                    </Text>
                  </div>
                </Group>
                <Group>
                  <ActionIcon color="blue" onClick={() => openEditModal(review)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => openDeleteModal(review)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              <Text>{review.comment}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      )}

      {/* Edit review dialog */}
      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingReview(null);
        }}
        title="Edit Review"
        size="md"
      >
        {editingReview && (
          <form onSubmit={form.onSubmit(handleUpdateReview)}>
            <Select
              label="Rating"
              placeholder="Select rating"
              data={[
                { value: '5', label: '5 stars - Excellent' },
                { value: '4', label: '4 stars - Good' },
                { value: '3', label: '3 stars - Average' },
                { value: '2', label: '2 stars - Poor' },
                { value: '1', label: '1 star - Very Poor' }
              ]}
              required
              {...form.getInputProps('rating')}
              mb="md"
            />
            <Textarea
              label="Comment"
              placeholder="Share your thoughts about this book..."
              required
              minRows={4}
              {...form.getInputProps('comment')}
              mb="md"
            />
            <Group position="right">
              <Button type="button" variant="outline" onClick={() => {
                setEditModalOpen(false);
                setEditingReview(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                Update Review
              </Button>
            </Group>
          </form>
        )}
      </Modal>

      {/* Delete confirmation dialog */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        <Text mb="md">
          Are you sure you want to delete your review of "{reviewToDelete?.book.title}"? This action cannot be undone.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => {
            setDeleteModalOpen(false);
            setReviewToDelete(null);
          }}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteReview}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default MyReviews;
