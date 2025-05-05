import React from 'react';
import { Link } from 'react-router-dom';

const NoPage = () => {

  const introText = `
This Book Review Management System is built on a robust  stack and designed to streamline the way users discover, evaluate, and discuss literature. On the server side, Node.js and Express provide a fast, scalable backend framework that defines RESTful endpoints for managing books, user accounts, and reviews. MongoDB, accessed through Mongoose, ensures flexible document storage with schema validation and middleware hooks to automatically calculate aggregate data such as average ratings and review counts.

User authentication and security are handled via JSON Web Tokens (JWT) combined with bcrypt password hashing, delivering secure login and session management. The backend also integrates Winston for structured logging and centralized error-handling middleware to catch and respond to validation errors or unexpected exceptions with clear HTTP status codes.

On the client side, React powers a responsive single-page application with React Router facilitating smooth navigation between Home, Books, Reviews, and About pages. Mantine UI components deliver consistent styling, theming support, and accessible design patterns out of the box. State management is implemented using React’s Context API, separating authentication state from book/review data to avoid excessive prop drilling. Form validation hooks from Mantine provide instant feedback for inputs, ensuring data integrity on both create and update operations.

Key user-facing features include: searching and filtering the book catalog by title, author, genre, or rating; paginated results for performance; submitting star ratings and detailed review comments; and real-time notifications via WebSocket when new reviews are posted. Administrative capabilities allow role-based access control (RBAC), enabling moderators to approve or remove reviews, manage user roles, and update book metadata through a protected dashboard.
`;

  return (
    <div className="container mx-auto p-6">
      {/* Navigation Buttons */}
      <nav className="flex space-x-4 mb-6">
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Home🏠
        </Link>
        <Link to="/about" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          🔗about
        </Link>
        <Link to="/contact" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          ☎️Contact
        </Link>
      </nav>


      <div className="mb-6">
        <img
          src="https://covers.openlibrary.org/b/id/8091016-L.jpg"
          alt="Illustrative Not Found"
          className="w-full max-w-md mx-auto rounded shadow-lg"
        />
      </div>


      <article className="prose prose-lg mx-auto">
        {introText.split('\n').map((line, idx) => (
          <p key={idx}>{line.trim()}</p>
        ))}
      </article>
    </div>
  );
};

export default NoPage;
