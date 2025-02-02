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
import Teams from "./components/Dashboards/AdminDashboard/ListTeams";
import CreateEvent from "./components/Dashboards/AdminDashboard/Management/CreateEvent";
import Judge from "./pages/Dashboards/Judge/Judge";
import User from "./pages/Dashboards/User/User";
import CreateStaff from "./components/Dashboards/AdminDashboard/Management/CreateStaff";
import CreateCompetition from "./components/Dashboards/AdminDashboard/Management/CreateCompetition";
import VexIQ from "./components/Competitions/VexIQ";
import ListTeams from "./components/Dashboards/AdminDashboard/ListTeams";
import CreateOrganization from "./components/Dashboards/AdminDashboard/Management/CreateOrg";
import TeamDetails from "./components/Dashboards/AdminDashboard/TeamDetails";
import ListCompetitions from "./components/Dashboards/AdminDashboard/Management/ListCompetitions";
import CompetitionEvents from "./components/Dashboards/AdminDashboard/Management/CompetitionEvents";
import CreateTeam from "./components/Dashboards/AdminDashboard/Management/CreateTeam";

// import CreateOrg from "./components/Dashboards/AdminDashboard/Management/CreateOrg";
import MyTeam from "./pages/Dashboards/User/MyTeam";
import PaymentForm from "./components/Dashboards/UserDashbord/PayMent";

const App = () => {
  // Layout component to dynamically render children with or without Navbar/Footer
  const Layout = ({ children, hideNavbar = false }) => (
    <>
      {children}
      {!hideNavbar && <Footer />}
      
          </>
  );

  return (
    <Router>
      <Navbar />
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
                <ListTeams />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route path="/Dashboard/Admin/Teams/:name" element={
          <Layout hideNavbar>
          <LayoutDashboard>
          <TeamDetails />
          </LayoutDashboard>
          </Layout>} />
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
          path="/Dashboard/Admin/Competitions/:competition_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CompetitionEvents />
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
            path="/Dashboard/Admin/CreateStaff"
          element={
            <Layout hideNavbar>
                  <LayoutDashboard>
                    <CreateStaff />
                  </LayoutDashboard>
            </Layout>
            }
        />
        <Route
            path="/Dashboard/Admin/CreateCompetition"
          element={
            <Layout hideNavbar>
                  <LayoutDashboard>
                    <CreateCompetition />
                  </LayoutDashboard>
            </Layout>
            }
        />
         <Route
            path="/Dashboard/Admin/CreateTeam"
          element={
            <Layout hideNavbar>
                  <LayoutDashboard>
                    <CreateTeam />
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
        {/* User Dashboard Routes */}
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
         <Route
          path="/Dashboard/User/CreateTeam"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CreateTeam/>
                  </LayoutDashboard>
            </Layout>
          }
        />
         <Route
          path="/Dashboard/User/PaymentForm"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <PaymentForm/>
                  </LayoutDashboard>
            </Layout>
          }
        />
         <Route
          path="/Dashboard/User/MyTeams"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <MyTeam/>
                  </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/Competitions"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <ListCompetitions />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/CreateOrganization"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CreateOrganization />
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
