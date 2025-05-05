import { useState, useEffect } from 'react';
import {
  Title,
  TextInput,
  Group,
  Button,
  Card,
  Image,
  Text,
  Badge,
  SimpleGrid,
  Pagination,
  Center,
  Loader,
  ActionIcon,
  Modal,
  Textarea
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import jwt_decode from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const form = useForm({
    initialValues: {
      title: '',
      author: '',
      description: '',
      publishDate: new Date(),
      isbn: '',
      coverImage: 'https://covers.openlibrary.org/b/id/8091016-L.jpg'
    },
    validate: {
      title: (value) => (value ? null : 'The title cannot be empty'),
      author: (value) => (value ? null : 'The author cannot be empty'),
      description: (value) => (value ? null : 'The description cannot be empty'),
      isbn: (value) => (value ? null : 'The ISBN cannot be empty')
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.is_admin);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [page, searchTitle, searchAuthor]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/books?page=${page}&limit=8`;
      if (searchTitle) url += `&title=${encodeURIComponent(searchTitle)}`;
      if (searchAuthor) url += `&author=${encodeURIComponent(searchAuthor)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('get book failed');

      const data = await response.json();
      setBooks(data);

      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const links = {};
        linkHeader.split(',').forEach(link => {
          const match = link.match(/<([^>]+)>; rel="([^")]+)"/);
          if (match) {
            links[match[2]] = match[1];
          }
        });
        if (links.last) {
          const lastPageMatch = links.last.match(/page=(\d+)/);
          if (lastPageMatch) setTotalPages(parseInt(lastPageMatch[1], 10));
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      notifications.show({ title: 'Error', message: 'Failed to fetch books', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleCreateBook = async (values) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      notifications.show({ title: 'Error', message: 'You need to be logged in to perform this action', color: 'red' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...values, publishDate: values.publishDate.toISOString() })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create book');
      }
      await response.json();
      notifications.show({ title: 'Success', message: 'Book created successfully', color: 'green' });
      setModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
      notifications.show({ title: 'Error', message: error.message || 'Failed to create book', color: 'red' });
    }
  };

  const handleUpdateBook = async (values) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      notifications.show({ title: 'Error', message: 'You need to be logged in to perform this action', color: 'red' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/books/${editingBook._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...values, publishDate: values.publishDate.toISOString() })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update book');
      }
      await response.json();
      notifications.show({ title: 'Success', message: 'Book updated successfully', color: 'green' });
      setModalOpen(false);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
      notifications.show({ title: 'Error', message: error.message || 'Failed to update book', color: 'red' });
    }
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    const token = localStorage.getItem('jwt');
    if (!token) {
      notifications.show({ title: 'Error', message: 'You need to be logged in to perform this action', color: 'red' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookToDelete._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete book');
      }
      notifications.show({ title: 'Success', message: 'Book deleted successfully', color: 'green' });
      setDeleteModalOpen(false);
      setBookToDelete(null);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      notifications.show({ title: 'Error', message: error.message || 'Failed to delete book', color: 'red' });
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    form.setValues({ ...book, publishDate: new Date(book.publishDate) });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingBook(null);
    form.reset();
    setModalOpen(true);
  };

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const getRatingColor = (rating) => rating >= 4 ? 'green' : rating >= 3 ? 'yellow' : 'red';

  return (
    <>  
      <Group position="apart" mb="md">
        <Title order={1}>Book List🧾</Title>
        {isAdmin && (
          <Button color="red" onClick={openCreateModal} leftSection={<IconPlus size={16} />}>Add Book</Button>
        )}
      </Group>

      <form onSubmit={handleSearch}>
        <Group mb="lg">
          <TextInput
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            icon={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <TextInput
            placeholder="Search by author"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
            icon={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <Button color="red" type="submit">Search🔍</Button>
        </Group>
      </form>

      {loading ? (
        <Center style={{ height: '50vh' }}><Loader size="xl" /></Center>
      ) : books.length === 0 ? (
        <Center style={{ height: '50vh' }}><Text size="xl" color="dimmed">No books found</Text></Center>
      ) : (
        <>        
          <SimpleGrid cols={4} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]}>            
            {books.map(book => (
              <Card key={book._id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section component={Link} to={`/books/${book._id}`} style={{ textDecoration: 'none' }}>
                  <Image src={book.coverImage} height={200} alt={book.title} />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500} component={Link} to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {book.title}
                  </Text>
                  {book.averageRating > 0 && (
                    <Badge color={getRatingColor(book.averageRating)}>
                      {book.averageRating.toFixed(1)} ★ ({book.totalRatings})
                    </Badge>
                  )}
                </Group>

                <Text size="sm" color="dimmed" lineClamp={2}>{book.description}</Text>

                <Text size="xs" color="dimmed" mt="sm">Author👮: {book.author}</Text>

                {isAdmin && (
                  <Group position="right" mt="md">
                    <ActionIcon color="red" onClick={() => openEditModal(book)}><IconEdit size={16} /></ActionIcon>
                    <ActionIcon color="red" onClick={() => openDeleteModal(book)}><IconTrash size={16} /></ActionIcon>
                  </Group>
                )}
              </Card>
            ))}
          </SimpleGrid>

          <Center mt="xl">
            <Pagination total={totalPages} value={page} onChange={setPage} size="lg" />
          </Center>
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal opened={modalOpen} onClose={() => { setModalOpen(false); setEditingBook(null); form.reset(); }} title={editingBook ? "Edit Book" : "Add Book"} size="lg">
        <form onSubmit={form.onSubmit(editingBook ? handleUpdateBook : handleCreateBook)}>
          <TextInput label="Title" placeholder="Enter book title" required {...form.getInputProps('title')} mb="md" />
          <TextInput label="Author" placeholder="Enter author name" required {...form.getInputProps('author')} mb="md" />
          <Textarea label="Description" placeholder="Enter book description" required minRows={3} {...form.getInputProps('description')} mb="md" />
          <DatePicker label="Publication Date" placeholder="Select publication date" required {...form.getInputProps('publishDate')} mb="md" />
          <TextInput label="ISBN" placeholder="Enter ISBN number" required {...form.getInputProps('isbn')} mb="md" />
          <TextInput label="Cover Image URL" placeholder="Enter cover image URL" {...form.getInputProps('coverImage')} mb="md" />
          <Group position="right" mt="md">
            <Button variant="outline" color="red" type="button" onClick={() => { setModalOpen(false); setEditingBook(null); form.reset(); }}>
              Cancel
            </Button>
            <Button color="red" type="submit">
              {editingBook ? "Update" : "Create"}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setBookToDelete(null); }} title="Confirm Delete" size="sm">
        <Text mb="md">Are you sure you want to delete the book？ "{bookToDelete?.title}"? This action cannot be undo.</Text>
        <Group position="right">
          <Button variant="outline" color="red" onClick={() => { setDeleteModalOpen(false); setBookToDelete(null); }}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteBook}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default Books;
