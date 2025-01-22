import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Nav/nav";
import Footer from "./components/Footer/footer";
import Home from "./components/Home/Home";
import About from "./pages/About/About";
import ContactUs from "./components/Contact/contactUs";
import Competitions from "./pages/Competitions/Competitions";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/Register";
import LayoutDashboard from "./pages/Dashboards/LayoutDashboard/LayoutDashboard";
import AdminDashboard from "./components/Dashboards/AdminDashboard/AdminDashboard";
import Teams from "./components/Dashboards/AdminDashboard/Teams";
import CreateEvent from "./components/Dashboards/AdminDashboard/Management/CreateEvent";
import Judge from "./pages/Dashboards/Judge/Judge";
import User from "./pages/Dashboards/User/User";

const App = () => {
  // Layout component to dynamically render children with or without Navbar/Footer
  const Layout = ({ children, hideNavbar = false }) => (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideNavbar && (
        <>
          <Footer />
        </>
      )}
    </>
  );

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

        {/* Admin Dashboard Routes */}
        <Route
          path="/Dashboard/Admin"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <AdminDashboard />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/Teams"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Teams />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/CreateEvent"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CreateEvent />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
            path="/Dashboard/Admin/CreateEvent"
          element={
            <Layout hideNavbar>
                  <LayoutDashboard>
                    <CreateEvent />
                  </LayoutDashboard>
            </Layout>
            }
        />
         <Route
          path="/Dashboard/Judge"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Judge />
              </LayoutDashboard>
            </Layout>
          }
        />
         <Route
          path="/Dashboard/User"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <User/>
              </LayoutDashboard>
            </Layout>
          }
        />
      </Routes>
                <ContactUs />

    </Router>
  
  );
};

export default App;
