import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Text,
  Group,
  Image,
  Badge,
  Card,
  Button,
  Divider,
  Textarea,
  Select,
  Center,
  Loader,
  Avatar,
  Paper,
  Modal
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import jwt_decode from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      rating: '5',
      comment: ''
    },
    validate: {
      comment: (value) => (value.trim().length > 0 ? null : 'the comment can not be empty')
    }
  });

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAuthenticated(true);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    // 检查用户是否已经评价过此书
    if (userId && reviews.length > 0) {
      const userReview = reviews.find(review => review.user._id === userId);
      setHasReviewed(!!userReview);
    }
  }, [userId, reviews]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          navigate('/books');
          notifications.show({
            title: 'error',
            message: 'no book',
            color: 'red'
          });
          return;
        }
        throw new Error('get book failed');
      }

      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      notifications.show({
        title: 'error',
        message: 'no book',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/book/${id}`);
      if (!response.ok) throw new Error('get comment failed');

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      notifications.show({
        title: 'error',
        message: 'Failed to obtain comments',
        color: 'red'
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReview = async (values) => {
    if (!isAuthenticated) {
      notifications.show({
        title: 'error',
        message: 'You need to log in to evaluate the books',
        color: 'red'
      });
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          book: id,
          rating: parseInt(values.rating),
          comment: values.comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The submission of comments failed.');
      }

      const newReview = await response.json();
      notifications.show({
        title: 'Success',
        message: 'The comment was submitted successfully.',
        color: 'green'
      });
      setReviewModalOpen(false);
      form.reset();

      // 刷新评论和图书信息
      fetchReviews();
      fetchBook();
    } catch (error) {
      console.error('Error submitting review:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'The submission of comments failed.',
        color: 'red'
      });
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
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

  if (!book) {
    return (
      <Center style={{ height: '50vh' }}>
        <Text size="xl" color="dimmed">Book not found</Text>
      </Center>
    );
  }

  return (
    <>
      <Group align="flex-start" spacing="xl">
        <Image
          src={book.coverImage}
          width={300}
          height={450}
          fit="contain"
          radius="md"
        />
        <div style={{ flex: 1 }}>
          <Title order={1}>{book.title}</Title>
          <Text size="lg" color="dimmed" mb="md">
            Author: {book.author}
          </Text>

          <Group spacing="xs" mb="md">
            {book.averageRating > 0 ? (
              <Badge size="lg" color={getRatingColor(book.averageRating)}>
                {book.averageRating.toFixed(1)} ★ ({book.totalRatings} reviews)
              </Badge>
            ) : (
              <Badge size="lg" color="gray">No reviews yet</Badge>
            )}
          </Group>

          <Text mb="md">
            <strong>ISBN:</strong> {book.isbn}
          </Text>

          <Text mb="md">
            <strong>Publication Date:</strong> {formatDate(book.publishDate)}
          </Text>

          <Text mb="xl">
            <strong>Description:</strong><br />
            {book.description}
          </Text>

          {isAuthenticated && !hasReviewed && (
            <Button onClick={() => setReviewModalOpen(true)}>
              Review this book
            </Button>
          )}

          {isAuthenticated && hasReviewed && (
            <Badge color="blue" size="lg">
              You have already reviewed this book
            </Badge>
          )}
        </div>
      </Group>

      <Divider my="xl" />

      <Title order={2} mb="md">Reader Reviews</Title>

      {reviewLoading ? (
        <Center style={{ height: '20vh' }}>
          <Loader />
        </Center>
      ) : reviews.length === 0 ? (
        <Text color="dimmed" align="center" my="xl">
          No reviews yet. Be the first to review this book!
        </Text>
      ) : (
        reviews.map(review => (
          <Paper key={review._id} p="md" mb="md" withBorder>
            <Group position="apart" mb="xs">
              <Group>
                <Avatar color="blue" radius="xl">
                  {review.user && review.user.username ? review.user.username.charAt(0).toUpperCase() : '?'}
                </Avatar>
                <div>
                  <Text weight={500}>{review.user && review.user.username ? review.user.username : 'User'}</Text>
                  <Text size="xs" color="dimmed">
                    {formatDate(review.createdAt)}
                  </Text>
                </div>
              </Group>
              <Badge color={getRatingColor(review.rating)}>
                {review.rating} ★
              </Badge>
            </Group>
            <Text>{review.comment}</Text>
          </Paper>
        ))
      )}

      {/* 评价表单对话框 */}
      <Modal
        opened={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Book"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmitReview)}>
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
            <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Review
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default BookDetail;
