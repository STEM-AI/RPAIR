import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

//                          Home                   //
import Navbar from "./components/Nav/nav";
import Footer from "./components/Footer/footer";
import ContactUs from "./components/Contact/contactUs";
import Home from "./components/Home/Home";
import About from "./pages/About/About";
import Competitions from "./pages/Competitions/Competitions";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/Register";
import Gallery from "./pages/Gallary/Gallary";
import PublicRoute from "./components/PublicRoute";
import ResetPassword from "./pages/Auth/ResetPassword";
import VolunteerForm from "./pages/Volunteer/Volunteerform";

//                          LayoutDashboard                   //
import LayoutDashboard from "./pages/Dashboards/LayoutDashboard/LayoutDashboard";

//                          Admin                   //
import AdminDashboard from "./pages/Dashboards/AdminDashboard/AdminDashboard";
import CreateEvent from "./pages/Dashboards/AdminDashboard/Management/CreateEvent";
import CreateStaff from "./pages/Dashboards/AdminDashboard/Management/CreateStaff";
import CreateCompetition from "./pages/Dashboards/AdminDashboard/Management/CreateCompetition";
import ListTeams from "./pages/Dashboards/AdminDashboard/ListTeams";
import CreateOrganization from "./pages/Dashboards/AdminDashboard/Management/CreateOrg";
import TeamDetails from "./pages/Dashboards/AdminDashboard/TeamDetails";
import ListCompetitions from "./pages/Dashboards/AdminDashboard/ListCompetitions";
import CompetitionEvents from "./pages/Dashboards/AdminDashboard/CompetitionEvents";

//                          User                   //
import CreateTeam from "./pages/Dashboards/UserDashbord/CreateTeam";
import UserDashbord from "./pages/Dashboards/UserDashbord/UserDashbord";
import PaymentForm from "./pages/Dashboards/UserDashbord/PayMent";
import GameTimer from "./pages/Dashboards/Judge/VexIQ/Scores/GameTimer";

//                          Judge                   //
import JudgeEvent from "./pages/Dashboards/Judge/JudgeEvent";
import MatchRounds from "./pages/Dashboards/Judge/VexIQ/matches/matches";
import Interview from "./pages/Dashboards/Judge/VexIQ/interview";
import Inspection from "./pages/Dashboards/Judge/VexIQ/Inspection";
import Notebook from "./pages/Dashboards/Judge/VexIQ/Notebook";
import Teamwork from "./pages/Dashboards/Judge/VexIQ/matches/teamwork";
import Skills from "./pages/Dashboards/Judge/VexIQ/matches/skills";
import StartMatch from "./pages/Dashboards/Judge/StartMatch";
import EventDetails from "./pages/Dashboards/Judge/eventDetails";
import LiveTeam from "./pages/Dashboards/View/LiveTeam";
import LiveSkills from "./pages/Dashboards/View/LiveSkills";
import ListJudges from "./pages/Dashboards/AdminDashboard/ListJudges";
import Matchess from "./pages/Dashboards/AdminDashboard/Matchess";
import RoboticsPage from "./components/CardSlider/roboticsPage";
import OpenSourcePage from "./components/CardSlider/openSourcePage";
import MyTeams from "./pages/Dashboards/UserDashbord/MyTeams";
import MyTeamDetails from "./pages/Dashboards/UserDashbord/MyTeamDetails";
import UADashboard from "./pages/Dashboards/UADashboard";
import EventDash from "./pages/Dashboards/EventsDash";
import SelectEvent from "./pages/Dashboards/Judge/VexIQ/matches/SelectMatch";
import VexPage from "./pages/Dashboards/AdminDashboard/Robotics/Vex";
import SourcePage from "./pages/Dashboards/AdminDashboard/OpenSource/Source";
import TeamSetting from "./pages/AccountSetting/TeamSetting";
import JudgeSetting from "./pages/AccountSetting/JudgeSetting";
import VexGOAbout from "./components/Competitions/Robotics/VexGo";
import Vex123About from "./components/Competitions/Robotics/Vex123";
// import VexV5About from "./components/Competitions/Robotics/Vex"; // arg3y hena tany fe moshkelaaaa
import VexIQAbout from "./components/Competitions/Robotics/VexIQ";

const App = () => {
  const Layout = ({ children, hideNavbar = false }) => (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideNavbar && <Footer />}
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
          path="resources/volunteering"
          element={
            <Layout>
              <VolunteerForm />
            </Layout>
          }
        />
        {/* <Route
          path="/competitions"
          element={
            <Layout>
              <Competitions />
            </Layout>
          }
        /> */}
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/reset-password"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Layout>
                <Register />
              </Layout>
            </PublicRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <Layout>
              <Gallery />
            </Layout>
          }
        />
        <Route
          path="/Robotics/Vex"
          element={
            <Layout>
              <RoboticsPage />
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/VexGo"
          element={
            <Layout>
              <VexGOAbout />
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/Vex123"
          element={
            <Layout>
              <Vex123About />
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/VexIQ"
          element={
            <Layout>
              <VexIQAbout />
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/VexV5"
          element={
            <Layout>
              <VexIQAbout />
            </Layout>
          }
        />

        <Route
          path="/OpenSource/competitions"
          element={
            <Layout>
              <OpenSourcePage />
            </Layout>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/Dashboard/Admin"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <UADashboard />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Event/:competition_name/:event_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <SelectEvent />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Event/:competition_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <EventDash />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Matchess"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Matchess />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/:role/Teams"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <ListTeams />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Teams/:team_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <TeamDetails />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Competitions/robotics/:event_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CompetitionEvents />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Competitions/Robotics"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <VexPage />
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
          path="/Dashboard/Competitions/OpenSource"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <SourcePage />
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

        {/* User Dashboard Routes */}
        <Route
          path="/Dashboard/User"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <UADashboard />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Team/AccountSetting"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <TeamSetting />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/User/Teams"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <MyTeams />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/teams/:team_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <MyTeamDetails />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/User/CreateTeam"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CreateTeam />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/User/PaymentForm"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <PaymentForm />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Competitions"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <ListCompetitions />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/listJudges"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <ListJudges />
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

        {/* JUDGE DASHBOARD */}

        <Route
          path="/Dashboard/Game"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <GameTimer />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Judge/AccountSetting"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <JudgeSetting />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/JudgeEvent/:event_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <StartMatch />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/JudgeEvent"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <JudgeEvent />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Judge/Matches"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <MatchRounds />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Judge/matches/teamwork"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Teamwork />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Judge/eventDetails"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <EventDetails />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Judge/Matches/skills"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Skills />
              </LayoutDashboard>
            </Layout>
          }
        />

        <Route
          path="/Dashboard/Judge/Interview"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Interview />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Judge/inspection"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Inspection />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Judge/Notebook"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Notebook />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/LiveTeam"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <LiveTeam />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/LiveSkills"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <LiveSkills />
              </LayoutDashboard>
            </Layout>
          }
        />
      </Routes>

      {/* <ContactUs /> */}
    </Router>
  );
};

export default App;
