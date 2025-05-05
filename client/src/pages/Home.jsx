import { useEffect, useState } from 'react';
import {
  Title,
  Text,
  Button,
  Group,
  Card,
  Image,
  Badge,
  SimpleGrid,
  Center,
  Loader,
  Container,
} from '@mantine/core';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books?limit=4`);
        if (response.ok) {
          const data = await response.json();
          setTopBooks(data);
        }
      } catch (error) {
        console.error('Error fetching top books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  return (
    <Container size="lg" py="md">
      {/* 欢迎标题 */}
      <Title order={1} mb="md" align="center">
        Welcome to Book Review System ！ 👋
      </Title>
      <Text size="lg" mb="xl" align="center">
        Browse books, read reviews, share your reading feelings ❤️
      </Text>

      {/* 操作按钮 */}
      <Group position="center" mb="xl">
        <Button component={Link} to="/books" size="lg" color="green">
          Browse All Books📖
        </Button>
        <Button component={Link} to="/register" size="lg" variant="outline" color="green">
          Register Now 👋
        </Button>
      </Group>

      {/* 热门图书 */}
      <Title order={2} mb="md">
        Popular Books🔥
      </Title>

      {loading ? (
        <Center>
          <Loader size="xl" />
        </Center>
      ) : (
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          {topBooks.map((book) => (
            <Card
              key={book._id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              component={Link}
              to={`/books/${book._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card.Section>
                <Image src={book.coverImage} height={200} alt={book.title} />
              </Card.Section>

              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{book.title}</Text>
                {book.averageRating > 0 && (
                  <Badge color={getRatingColor(book.averageRating)}>
                    {book.averageRating.toFixed(1)} ★
                  </Badge>
                )}
              </Group>

              <Text size="sm" color="dimmed" lineClamp={2}>
                {book.description}
              </Text>

              <Text size="xs" color="dimmed" mt="sm">
                Author: {book.author}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

export default Home;
