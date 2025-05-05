import React from 'react';
import { Text, Button, Group, Container, Image } from '@mantine/core';
import { Link } from 'react-router-dom';

const About = () => {
  // English introduction focusing on tech stack and core features
  const introText = `
This Book Review & User Manager is built on a robust  stack and designed to streamline the way users discover, evaluate, and discuss literature. On the server side, Node.js and Express provide a fast, scalable backend framework that defines RESTful endpoints for managing books, user accounts, and reviews. MongoDB, accessed through Mongoose, ensures flexible document storage with schema validation and middleware hooks to automatically calculate aggregate data such as average ratings and review counts.

User authentication and security are handled via JSON Web Tokens (JWT) combined with bcrypt password hashing, delivering secure login and session management. The backend also integrates Winston for structured logging and centralized error-handling middleware to catch and respond to validation errors or unexpected exceptions with clear HTTP status codes.

On the client side, React powers a responsive single-page application with React Router facilitating smooth navigation between Home, Books, Reviews, and About pages. Mantine UI components deliver consistent styling, theming support, and accessible design patterns out of the box. State management is implemented using React’s Context API, separating authentication state from book/review data to avoid excessive prop drilling. Form validation hooks from Mantine provide instant feedback for inputs, ensuring data integrity on both create and update operations.

Key user-facing features include: searching and filtering the book catalog by title, author, genre, or rating; paginated results for performance; submitting star ratings and detailed review comments; and real-time notifications via WebSocket when new reviews are posted. Administrative capabilities allow role-based access control (RBAC), enabling moderators to approve or remove reviews, manage user roles, and update book metadata through a protected dashboard.
`;

  return (
    <Container size="md" py="xl">
      {/* Navigation Buttons */}
      <Group position="apart" mb="md">
        <Button component={Link} to="/" color="green" variant="filled">🏠Home</Button>
        <Button component={Link} to="/books" color="green" variant="filled">📖Books</Button>
        <Button component={Link} to="/reviews" color="green" variant="filled">😊Reviews</Button>
        <Button component={Link} to="/about" color="green" variant="filled">🔗introduction</Button>
      </Group>

      {/* Image Section */}
      <Image
        
        alt="Book Review Application Illustration"
        mx="auto"
        mb="md"
        width={300}
        withPlaceholder
      />

      {/* Introduction Text */}
      {introText.split('\n\n').map((paragraph, idx) => (
        <Text key={idx} mb="md">
          {paragraph.trim()}
        </Text>
      ))}
    </Container>
  );
};

export default About;
