# Book Review & User Manager App

## Purpose
The Book Review & User Management System is designed to provide a platform for readers to discover and evaluate books while managing user profiles efficiently.    It allows users to register, log in, browse, create, update, delete, and view book entries, as well as submit star ratings and detailed review comments.    Administrators can manage user accounts, moderate or remove reviews, and update book infor to ensure content quality.

## API Endpoints

### **Authentication**
- `POST /api/auth/register` – Register a new user (username, email & password).
- `POST /api/auth/login` – Authenticate an existing user and obtain a JWT.

### **User Management**
All user-management routes require a valid JWT. Admins may manage all users; regular users can view/update their own profile.
- `GET /api/users` –  Retrieve a list of all users (admin only).
- `GET /api/users/:id` – Get a single user’s profile by ID (admin only).
- `PUT /api/users/:id` – Update a user’s profile by ID (admin only).
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

We welcome contributions to the development of this app! Here's how you can get involved:

1. **Fork the repository** and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes and **commit** them with clear, descriptive messages.
4. **Push** your changes to your forked repository.
5. Submit a **Pull Request (PR)** to the main repository, detailing the changes made and why they are necessary.

We ask that all contributions follow our coding standards and include appropriate tests.

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

This app requires the following dependencies:

### **Backend (Node.js)**
1. **Express**: Web framework for handling HTTP requests.

2. **MongoDB**: Database for storing books reviews and user data.

3. **Mongoose**: MongoDB for interacting with the database.

4. **bcryptjs**: Password hashing for user authentication.

5. **jsonwebtoken**: For creating JWT tokens for user sessions.

### **Frontend (Vite + React)**
1. **React**: Frontend framework for building the UI.
2. **Vite**: Build tool and dev server for React.
3. **Mantine**: A library of components

To install dependencies:
```bash
# Backend（server）
cd server
npm install

# Frontend（client）
cd client
npm install
```

## Application Architecture

The application follows a **client-server architecture**:

- **Frontend:** The frontend is a React app, which handles rendering the user interface and sending API requests to the backend.
- **Backend:** The backend is built with **Node.js** and **Express**, providing the API to manage books and user authentication. It communicates with a **MongoDB** database using **Mongoose** for data storage.
- **Authentication:** User authentication is handled with **JWT** tokens, providing secure sessions.

The frontend and backend are separated, making it easy to scale or swap technologies in the future.

## Deployment

Using Caddy, both applications can be deployed behind a reverse proxy on a single server.



```bash
$cat /etc/caddy/Caddyfile


n12047805.ifn666.com {
        handle /api/* {
                reverse_proxy localhost:5004
        }
        handle{
                root * /home/ubantu/666BOOKUSERMANAGER/client/dist
                try_files(path)/index.html
               
         }

}
```

## Reporting Issues

To report an issue, follow these steps:
1. **Check the Issues page** on GitHub to see if the issue has already been reported.
2. If not, create a new issue with the following details:
   - **Description of the problem** (including steps to reproduce it).
   - **Expected behavior** and **actual behavior**.
   - **Screenshots** (if applicable).
   - **Logs or error messages** (if applicable).
3. Please be clear and concise to help us quickly understand and resolve the issue.

