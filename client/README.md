# Book Review & User Manager Frontend (React App)

Written by CHEN CHENG, IFN666 Web and Mobile Application .

## Purpose

The **Book Review & User Manager Frontend** The Book Review & User Management System is designed to provide a platform for readers to discover and evaluate books while managing user profiles efficiently.It allows users to register,log in, browse, create, update, delete, and view book entries, as well as submit star ratings and detailed review comments.Administrators can manage user accounts, moderate or remove reviews, and update book for to ensure content quality.

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

## How to Contribute
To contribute to the development of this project:

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes, ensuring you follow the existing code style and structure.
4. **Commit** your changes with clear and descriptive commit messages.
5. **Push** your changes to your forked repository.
6. **Submit a Pull Request** for review.

Ensure your code passes any relevant tests, and provide clear documentation for new features or bug fixes.

## Dependencies

The **Book Review & User Manager Frontend** relies on the following dependencies, listed in the `package.json` file:

- **react**: A JavaScript library for building user interfaces.
- **react-dom**: Provides DOM-specific methods for rendering React components.
- **react-router-dom**: Used for routing and navigation between different views of the app.
- **react-hook-form**: A library for handling form validation and submission.
- **dotenv**: Loads environment variables for API configuration.

To install these dependencies, simply run:

```bash
npm install
```

## Application Architecture

The **Book Review & User Manager** follows a **component-based architecture**, with React components serving as the building blocks of the user interface. The application is organized into several components and pages, each with a specific responsibility:

- **Components:** Reusable pieces that encapsulate common logic or UI patterns.
  - **ProtectedRoute.jsx::** Guards routes so only authenticated users can access them.
  - **AdminRoute.jsx:** Wraps routes to restrict access to admin users.
- **Pages:** Top-level views mapped to routes—each renders a self-contained screen or feature.
  - **Layout.jsx:** The overall shell (header, navigation links, outlet for nested pages).
  - **Home.jsx:** Landing page with a welcome message or featured books.
  - **Books.jsx:** Displays the book catalog with search, filter, pagination, and CRUD triggers.
  - **BookDetail.jsx::** Shows one book’s metadata, average rating, and review list; lets users post/edit reviews.
  - **MyReviews.jsx:** Lists all reviews submitted by the current user.
  - **Users.jsx:** Admin interface for viewing, editing, and deleting user accounts.
  - **About.jsx:** Static page describing the project.
  - **Login.jsx::** User sign-in form.
  - **About.jsx:** Static page describing the project.
  - **Register.jsx::** New-user sign-up form.
  - **NoPage.jsx::** 404 fallback for unmatched routes.


### Folder Structure:
```
/public
  favicon.svg                # Application's favicon

/src
  /components
    /AdminRoute.jsx          # Restricts routes to admin users
    /ProtectedRoute.jsx      # Guards routes for authenticated users

  /pages                     # Main page views mapped to routes
    /Layout.jsx              # App shell (header, nav, outlet)
    /Home.jsx                # Landing page with featured books
    /Books.jsx               # Book catalog with search, pagination, and CRUD actions
    /BookDetail.jsx          # Book metadata, average rating, and review list/form
    /MyReviews.jsx           # List of reviews submitted by the current user
    /Users.jsx               # Admin interface for managing user accounts
    /About.jsx               # Static project description page
    /Login.jsx               # User sign-in form
    /NoPage.jsx              # 404 fallback for unmatched routes

  App.jsx                    # Main application component,Wires up MantineProvider, Notifications, and routing
  main.jsx                   # Entry point for React
```

## How to Report Issues

If you encounter any issues with the **Book Review & User Manager Frontend**, please follow these steps to report them:

1. Check the **Issues** page on the repository to see if your issue has already been reported.
2. If the issue has not been reported, **create a new issue** with the following details:
   - A clear description of the problem.
   - Steps to reproduce the issue, including any relevant code or error messages.
   - The expected behavior vs. the actual behavior.
   - Screenshots or logs (if applicable).
3. We will review the issue and provide updates as necessary.
