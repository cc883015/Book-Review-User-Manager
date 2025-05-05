# IFN666_25se1 Assessment 02 Submission

**Student name:**  CHENG CHEN

**Student ID:** n12047805

# Response to marking criteria

## (API) Core: Application architecture (1 mark)

- **One line description:** Layered architecture separating routing, controllers, models, middleware, and utilities.
- **Video timestamp:** 8:11
- **Relevant files**
 - /server/server.js

 - /server/src/routes/

 - /server/src/controllers/

 - /server/src/models/

 - /server/src/middleware/

 - /server/src/utils/

## (API) Core: Endpoints (2 marks)

- **One line description:** RESTful endpoints for authentication , books, reviews , and users.
 - **Video timestamp:** 1:11
 - **Relevant files**
 - /server/src/routes/index.js

 - /server/src/routes/auth.js

 - /server/src/routes/book.js

 - /server/src/routes/review.js

 - /server/src/routes/user.js

API-collection.json

## (API) Core: Data model (3 marks)

- **One line description:** Mongoose schemas for Book, Review, and User entities.
- **Video timestamp:** 1:29
- **Relevant files**
   - //server/src/models/book.js

   - /server/src/models/review.js

   - /server/src/models/user.js

## (API) Core: Data interface (3 marks)

- **One line description:** Controllers implement CRUD logic for each model and authentication.
- **Video timestamp:** source code for 2:17 demo for 6:49
- **Relevant files**
   - /server/src/controllers/auth.js

   - /server/src/controllers/book.js

   - /server/src/controllers/review.js

   - /server/src/controllers/user.js

## (API) Core: Deployment to web server (3 marks)

- **One line description:**  
- **Video timestamp:** 
- **Relevant files** 
  
   


## (API) Core: API testing with Hoppscotch (3 marks)

- **One line description:** This is a collection of "Book Review" exported from Hoppscotch, including test requests for all interfaces such as user registration/login, crud for book and review.
- **Video timestamp:**  2:40
- **Relevant files**
   - API-collection.json

## (API) Additional: Authentication (3 marks)

- **One line description:** 
- **Video timestamp:**   
- **Relevant files**
 

## (API) Additional: Input validation (3 marks)

- **One line description:** 
- **Video timestamp:** 
- **Relevant files**
  

## (API) Additional: Security (3 marks)

- **One line description:** Passwords hashed with bcrypt, JWT secret stored in environment, CORS and morgan rate‐limiting applied.
- **Video timestamp:** 4:46
- **Relevant files**
   - /server/src/models/user.js

   - /server/server.js

   - /server/.env

## (API) Additional: Rate limiting (3 marks)

- **One line description:** Different rate limiters for authenticated (90/min) and unauthenticated (50/min) and review （3/minute）
- **Video timestamp:** 5:25 for source code 5:36 for demo
- **Relevant files**
   - /server/server.js

## (API) Additional: Query filtering (3 marks)

- **One line description:** Supports query parameters for title/author filtering on book list.
- **Video timestamp:** demo 5:57 
- **Relevant files**
   - /server/src/controllers/book.js

   - /server/src/middleware/validatePaginateQueryParams.js

## (API) Additional: Pagination (3 marks)

- **One line description:** Paginate “list” endpoints via custom middleware and Mongoose plugin.
- **Video timestamp:** 0：33
- **Relevant files**
   - /server/src/utils/mongoosePaginate.js

   - /server/src/middleware/validatePaginateQueryParams.js

   - /server/src/controllers/book.js

   - /server/src/controllers/user.js

## (API) Additional: Use of third-party APIs (3 marks)

- **One line description:** 
- **Video timestamp:** 
- **Relevant files**
  

## (API) Additional: Role-based Access Control (3 marks)

- **One line description:** checkAdmin middleware restricts book and user management to admin users.
- **Video timestamp:** 6：40 for admin  7:37 for normal user
- **Relevant files**
   - /server/src/controllers/user.js

   - /server/src/controllers/book.js

   - /server/src/middleware/authenticateWithJwt.js

## (API) Additional: Custom middleware (3 marks)

- **One line description:** 
- **Video timestamp:** 
- **Relevant files**
  

## (API) Additional: Upon request (3 marks)

- **One line description:** 
- **Video timestamp:** 
- **Relevant files**
  



---


## (Client) Core: Application architecture (3 marks)

- **One line description:** React front-end structured into reusable components and page views under src.
- **Video timestamp:** 8:05
- **Relevant files**
   - /client/src/components/

   - /client/src/pages/

   - /client/src/App.jsx

   - /client/src/main.jsx

## (Client) Core: User interface design (3 marks)

- **One line description:**  Consistent UI built with Mantine components for layout, forms, notifications, and modals.
- **Video timestamp:** from 00:00 for all viedo and 8:35
- **Relevant files**
   - /client/src/pages/ 

   - /client/src/components/ 

   - /client/src/App.jsx

## (Client) Core: React components (3 marks)

- **One line description:** Implements the core React components for application layout, protected routing, and book management .
- **Video timestamp:** demo at 6:47 for create/edit book. 7:03 for create/edit/delete review ;7:08 for edit/delete user  source code from 8:44
- **Relevant files**
   - /client/src/components/ProtectedRoute.jsx

   - /client/src/components/AdminRoute.jsx

   - /client/src/pages/Layout.jsx

   - /client/src/pages/Books.jsx

   - /client/src/pages/BookDetail.jsx

   - /client/src/pages/MyReviews.jsx
## (Client) Core: State management (3 marks)

- **One line description:** Local state via useState/useEffect and form state via Mantine’s useForm.
- **Video timestamp:**  8:50
- **Relevant files**
   - /client/src/pages/Books.jsx

   - /client/src/pages/BookDetail.jsx

   - /client/src/pages/Login.jsx

   - /client/src/pages/Register.jsx
## (Client) Core: API integration (3 marks)

- **One line description:** integrated with REST API. nearly all features  were matched at the frontend. 
- **Video timestamp:** all throughout video and 9:02 show demo
- **Relevant files**
   - /client/src/pages/Login.jsx

   - /client/src/pages/Register.jsx

   - /client/src/pages/Layout.jsx

   - /client/src/pages/Books.jsx

   - /client/src/pages/BookDetail.jsx

## (Client) Additional: Authentication (3 marks)

- **One line description:** Front end handles JWT login/logout flow, storing token in localStorage and gating routes via protected/admin wrappers.
- **Video timestamp:**   0:09 for admin 7:04 for normal user
- **Relevant files**
   - /client/src/pages/Login.jsx

   - /client/src/pages/Register.jsx

   - /client/src/pages/Layout.jsx

## (Client) Additional: Input validation (3 marks)

- **One line description:**Use Mantine 'useForm' for required fields and format verification in all forms.
- **Video timestamp:** 4:10
- **Relevant files**
   - /client/src/pages/Login.jsx

   - /client/src/pages/Register.jsx

   - /client/src/pages/Books.jsx

   - /client/src/pages/BookDetail.jsx
## (Client) Additional: Rate limiting (3 marks)

- **One line description:** Prevents duplicate submissions by disabling action buttons and showing loaders during pending requests.
- **Video timestamp:** 5:25 for source code 5:36 for demo
- **Relevant files**
   - server.js

   - /client/src/pages/Books.jsx

   - /client/src/pages/BookDetail.jsx

## (Client) Additional: Search and Sort (3 marks)

- **One line description:** Enables filtering the book catalog by title and author via inputs and query parameters.
- **Video timestamp:** demo for 5:57 
- **Relevant files**
   - /client/src/pages/Books.jsx



## (Client) Additional: Pagination (3 marks)

- **One line description:** Implements server-side pagination with Mantine’s  Pagination 
- **Video timestamp:** 0:33 
- **Relevant files**
   - /client/src/pages/Books.jsx
   - /client/src/pages/MyReviews.jsx
   -  /client/src/pages/Users.jsx

## (Client) Additional: Accessibility (3 marks)

- **One line description:** 
- **Video timestamp:** 
- **Relevant files**
 
## (Client) Additional: Advanced UI design (3 marks)

- **One line description:**
- **Video timestamp:** 
- **Relevant files**
 

## (Client) Additional: Responsive design (3 marks)

- **One line description:** 
- **Video timestamp:** 
- **Relevant files**
 

## (Client) Additional: Upon request (3 marks)

- **One line description:** 
- **Video timestamp:** 
 
