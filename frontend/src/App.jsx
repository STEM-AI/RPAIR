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

const App = () => {
  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/Dashboard/Admin"
            element={
              <LayoutDashboard>
                <AdminDashboard />
              </LayoutDashboard>
            }
          />
          <Route
            path="/Dashboard/Admin/Teams"
            element={
              <LayoutDashboard>
                <Teams />
              </LayoutDashboard>
            }
          />
          <Route
            path="/Dashboard/Admin/CreateEvent"
            element={
              <LayoutDashboard>
                <CreateEvent />
              </LayoutDashboard>
            }
          />
        </Routes>
        <ContactUs />

        {/* <Footer /> */}
      </Router>
    </>
  );
};

export default App;
