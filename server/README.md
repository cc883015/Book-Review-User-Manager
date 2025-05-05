# Book Review & User Manager API (Express App)

Written CHENG CHEN for Queensland University of Technology, IFN666 Web and Mobile Application Development.

## Purpose

The **Book Review & User Management API** is a backend service built using **Express.js**, MongoDB, and Mongoose that enables users to register, log in, and manage both book records and user‐submitted reviews. It supports creating, reading, updating, and deleting books, as well as posting, editing, and removing star ratings and review comments tied to individual books. User authentication is handled via JWT and bcrypt, ensuring secure login flows and protected routes for profile management, review moderation, and administrative. Designed for robustness and scalability, this API provides paginated listings, full-text search/filtering on titles and authors, role-based access control (users vs. admins), and comprehensive error handling—delivering a secure and efficient backend foundation for any book-centric review platform.

## API Endpoints

### **Authentication**
- `POST /api/auth/register` – Register a new user (username, email & password).
- `POST /api/auth/login` – Authenticate an existing user and obtain a JWT.

### **User Management**
All user-management routes require a valid JWT. Admins may manage all users; regular users can view/update their own profile.
- `GET /api/users` –  Retrieve a list of all users (admin only).
- `GET /api/users/:id` – Get a single user’s profile by ID (admin).
- `PUT /api/users/:id` – Update a user’s profile by ID (admin).
- `DELETE /api/users/:id` – Delete a user account by ID (admin only).

### **Book Management**
All book routes are public for read; creation, update and deletion require authentication (admin only).
- `GET /api/books` – List books with optional pagination, title/author filtering, and sorting.
- `GET /api/books/:id` – Get details for one book by ID.
- `POST /api/books` – Create a new book entry (admin only).
- `GET /api/books/:id` – Update book metadata by ID (admin only).
- `GET /api/books` – Delete a book by ID (admin only).

### **Review Management**
Any authenticated user can post a review. Users may update or delete only their own reviews; admins may manage all.
- `GET /api/reviews/book/:bookId` – Retrieve all reviews for a given book.
- `GET /api/reviews/user/:userId` – Retrieve all reviews submitted by a specific user.
- `POST /api/reviews` – Create a new review (rating, comment).
- `PUT /api/reviews/:id` – Update a review by ID (user or admin).
- `DELETE /api/reviews/:id` – Delete a review by ID (user or admin).

## Note:

All routes requiring authentication use the authenticateWithJwt middleware.

Routes with pagination (GET /api/books) also use validatePaginateQueryParams.

The controllers for each resource are under server/src/controllers/ and routes under server/src/routes/.

Utility helpers like generatePaginationLinks and mongoosePaginate live in server/src/utils/.

## How to Contribute
We welcome contributions to the development of the TBook Review & User Management API. Here's how you can contribute:

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes and **commit** them with clear, descriptive commit messages.
4. **Push** your changes to your forked repository.
5. Submit a **Pull Request (PR)** to the main repository.

Please ensure that your contributions follow the existing code style, include appropriate tests, and are well-documented.

## Features
- **Secure Authentication:** Implements user registration and login flows using JSON Web Tokens (JWT) and bcrypt, ensuring protected access to designated endpoints.
- **Book Lifecycle Management:** Full CRUD support for book records—including creation, retrieval, modification, and deletion—complete with metadata such as title, author, ISBN, and cover images.
- **Review Operations:** Enables authenticated users to submit, edit, and remove star-rating reviews with accompanying text, while administrators can moderate all reviews.
- **Dynamic Search & Filtering:** Provides real-time search capabilities on book listings by title and author, allowing users to quickly find relevant entries.
- **Server-Side Pagination:** Delivers paginated responses for book collections, with pagination links in HTTP headers and front-end controls to navigate through pages of results.
- **Average Rating Calculation:** Automatically computes and updates each book’s mean rating based on its reviews, displayed alongside total review counts.
- **Role-Based Access Control:** Differentiates permissions between regular users and admin users, restricting certain operations (e.g., book management, user administration) to privileged roles.
- **Request limiting:**Applies rate-limiting middleware to cap the number of API calls per minute, protecting against abuse and preserving service availability. 
- **Consistent Error Handling:**Returns standardized error responses and status codes for validation failures, authentication errors, missing resources, and unexpected exceptions.

## Dependencies

The **Book Review & User Manager** has the following dependencies, listed in the `package.json` file:

- **express**: The web framework used to handle HTTP requests and routing.
- **mongoose**: MongoDB Object Data Modeling (ODM) library used to interact with the database.
- **bcryptjs**: For hashing and verifying user passwords during authentication.
- **jsonwebtoken**: For creating and validating JWT tokens for user authentication.
- **dotenv**: For managing environment variables securely.
- **express-rate-limit**: For rate-limiting incoming requests to prevent abuse.

To install these dependencies, you can simply run `npm install` in the root directory of the project.

## Application Architecture

The **Book Review & User Manager** follows a **RESTful architecture** with the following structure:

- **Express.js** handles HTTP requests, routes, and middleware to control the flow of data.
- **MongoDB** is used as the database for storing user and book and user and reviews information, accessed through **Mongoose**.
- **JWT Authentication** is used to secure API endpoints. Users must log in to receive a JWT token, which is required to access protected routes.
- The API includes rate limiting through **express-rate-limit** to protect against excessive use.
- The application is divided into modules, such as **controllers** for managing system logic, **models** for interacting with the database, and **middleware** for books like authentication and error handling.

### Folder Structure:
```
/controllers     # ontroller files handling business logic for authentication, users, books, and reviews
/models          # Mongoose models for User, Book, and Review schemas
/routes          # API route definitions for auth, user, book, and review endpoints
/middleware      # Middlewares for JWT authentication, error handling, request throttling, and ObjectId validation
/utils           # Helper functions and plugins (pagination)
```

## How to Report Issues

To report an issue with the **Book Review & User Manager**, follow these steps:

1. **Check the Issues page** on GitHub to see if the issue has already been reported.
2. If it hasn't been reported, create a new issue with the following information:
   - **Description of the issue**.
   - **Steps to reproduce** the issue.
   - **Expected behavior** and **actual behavior**.
   - Any relevant **error logs** or **screenshot**.

