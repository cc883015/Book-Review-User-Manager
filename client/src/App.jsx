import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import MyReviews from "./pages/MyReviews";
import Users from "./pages/Users";
import About from "./pages/About";
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from "./pages/NoPage";
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <>
      <MantineProvider>
        <Notifications position="top-right" />
        <BrowserRouter basename="/assignment2">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="books" element={<Books />} />
              <Route path="books/:id" element={<BookDetail />} />
              <Route path="my-reviews" element={
                <ProtectedRoute>
                  <MyReviews />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              } />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </>
  )
}

export default App;
