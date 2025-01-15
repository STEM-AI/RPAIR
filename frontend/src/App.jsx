import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Nav/nav';
import Footer from './components/Footer/footer';
import Home from './components/Home/Home';
import About from './pages/About/About';
import ContactUs from './components/Contact/contactUs';
import Competitions from './pages/Competitions/Competitions';
import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';
import Admin from './pages/Dashboards/Admin/Admin';

// Layout Wrapper Component
const Layout = ({ children, hideNavbar }) => (
  <>
    {!hideNavbar && <Navbar />}
    {children}
    {!hideNavbar && <ContactUs />}
    {!hideNavbar && <Footer />}
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/competitions"
          element={
            <Layout>
              <Competitions />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        {/* Dashboard Routes (No Navbar, Footer, or ContactUs) */}
        <Route
          path="/dashbord/Admin"
          element={
            
            <Layout hideNavbar>
              <Admin />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
