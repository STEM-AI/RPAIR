import React, { useState, useEffect , lazy ,Suspense } from "react";
import { BrowserRouter as Router, Routes, Route ,useLocation } from "react-router-dom";
import "./App.css";


//                              components              //
import { MatchProvider } from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/MatchContext";
import Navbar from "./components/Nav/nav";
import Footer from "./components/Footer/footer";
import ContactUs from "./components/Contact/contactUs";
import PublicRoute from "./components/PublicRoute";
import LayoutDashboard from "./pages/Dashboards/LayoutDashboard/LayoutDashboard";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingPage from "./components/LoadingPage"
import VEX123Sheet from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";
import SheetSolo from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/SheetSolo";
import SelectMatch123 from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/SelectMatch123";
import Interview123 from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Interview123";
import MainProg from "./pages/Competitions/Programming/main/ProgWelcome";
import ProgWelcome from "./pages/Competitions/Programming/main/ProgWelcome";
import ProgInfo from "./pages/Competitions/Programming/main/ProgInfo";
import CompetitionQuestions from "./pages/Competitions/Programming/main/CompetitionQuestions";
import Home from "./components/Home/Home";
import {ResultProvider } from "../src/context/CompetitionContext" ; 
import CompetitionResult from "./pages/Competitions/Programming/main/CompetitionResult";
import Robotics from "./pages/Gallary/Robotics/Robotics";
import EventDetails from "./pages/Dashboards/AdminDashboard/EventDetails";
import LiveEvents from "./pages/LiveEvents/introEvents";
import IntroVexIQ from "./pages/Dashboards/AdminDashboard/IntroVexIQ";
import IntroVexGO from "./pages/LiveEvents/introVexGo";
import LiveTeamIQ from "./pages/Dashboards/View/LiveTeam";
import LiveProgramming from "./pages/LiveEvents/LiveMatches/LiveProgramming";
import LiveVex123 from "./pages/LiveEvents/LiveMatches/LiveVex123";
import LiveSkillsVex from "./pages/LiveEvents/LiveMatches/LiveVexIQ/LiveSkillsIQ/LiveSkills";
import LiveTeamVex from "./pages/LiveEvents/LiveMatches/LiveVexIQ/LiveTeamwork/LiveTeam";
import ProgrammingComp from "./components/Competitions/Programming";
import CompetitionSheetContainer from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";

import { EventNameProvider } from './context/EventName';
import OurEvents from "./pages/EventsResources/OurEvents";
import AllEventDetails from "./pages/EventsResources/AllEventDetails";
import CompEvents from "./pages/EventsResources/CompEvents";

import SkillsContainerGO from "./pages/LiveEvents/LiveMatches/LiveVexGO/Skillsgo/SkillsContainerGo";
import CompetitionSheet from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";
import Sheet123 from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";



//                              semple pages & Forms               //
//                          Common Pages (Lazy Loading)                   //
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Auth/login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const VolunteerForm = lazy(() => import("./pages/Volunteer/Volunteerform"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoon"));

//                          Admin Pages (Lazy Loading)                   //
const AddNews = lazy(() => import("./pages/Dashboards/AddNews"));
const CreateEvent = lazy(() => import("./pages/Dashboards/AdminDashboard/Management/CreateEvent"));
const CreateStaff = lazy(() => import("./pages/Dashboards/AdminDashboard/Management/CreateStaff"));
const CreateCompetition = lazy(() => import("./pages/Dashboards/AdminDashboard/Management/CreateCompetition"));
const CreateOrganization = lazy(() => import("./pages/Dashboards/AdminDashboard/Management/CreateOrg"));

//                          User Pages (Lazy Loading)                   //
const CreateTeam = lazy(() => import("./pages/Dashboards/UserDashbord/CreateTeam"));
const PaymentForm = lazy(() => import("./pages/Dashboards/UserDashbord/PayMent"));

//                          Dashboards (Lazy Loading)                   //
const EventDash = lazy(() => import("./pages/Dashboards/EventsDash"));
const UADashboard = lazy(() => import("./pages/Dashboards/UADashboard"));


// 414
//                          Admin (Lazy Loading)                   //
const ListTeams = lazy(() => import("./pages/Dashboards/AdminDashboard/ListTeams"));
const TeamDetails = lazy(() => import("./pages/Dashboards/AdminDashboard/TeamDetails"));
const ListCompetitions = lazy(() => import("./pages/Dashboards/AdminDashboard/ListCompetitions"));
const CompetitionEvents = lazy(() => import("./pages/Dashboards/AdminDashboard/CompetitionEvents"));
const ListJudges = lazy(() => import("./pages/Dashboards/AdminDashboard/ListJudges"));
const Matchess = lazy(() => import("./pages/Dashboards/AdminDashboard/IntroVexIQ"));

//                          User (Lazy Loading)                   //
const MyTeams = lazy(() => import("./pages/Dashboards/UserDashbord/MyTeams"));
const MyTeamDetails = lazy(() => import("./pages/Dashboards/UserDashbord/MyTeamDetails"));

//                          Judge (Lazy Loading)                   //
const JudgeEvent = lazy(() => import("./pages/Dashboards/Judge/JudgeEvent"));
const MatchRounds = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/matches"));
const Interview = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/interview"));
const Inspection = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/Inspection"));
const Notebook = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/Notebook"));
const Teamwork = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/teamwork"));
const Skills = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/skills"));
const EventDetailsJudge = lazy(() => import("./pages/Dashboards/Judge/eventDetailsJudge"));

const SelectEvent = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/SelectMatch"));
const StartMatchIQ = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/StartMatchIQ"));
const StartMatchGO = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/JudgeGO/StartMatchGO"));
const SelectMatchGO = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/JudgeGO/SelectMatchGO"));
const COOPMatch = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/COOPmatches"));
const SkillsGO = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/Solomatches"));
const SheetCoop = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/SheetCoop"));


//                          Misc (Lazy Loading)                   //
const AllSetting = lazy(() => import("./pages/AccountSetting/AllSetting"));
const LiveTeam = lazy(() => import("./pages/Dashboards/View/LiveTeam"));
const LiveSkills = lazy(() => import("./pages/Dashboards/View/LiveSkills"));

//                      Home pages              //
const About = lazy(() => import("./pages/About/About"));
const Gallery = lazy(() => import("./pages/Gallary/Gallary"));
const RoboticsGallery = lazy(() => import("./pages/Gallary/Robotics/RoboticsGallery"));

//                        start  Competitions (Lazy Loading)                   //
const RoboticsPage = lazy(() => import("./components/Competitions/roboticsPage"));
const OpenSourcePage = lazy(() => import("./components/Competitions/openSourcePage"));
const Programming = lazy(() => import("./components/Competitions/Programming"));
const WebDesign = lazy(() => import("./components/Competitions/WebDesign"));
const AI = lazy(() => import("./components/Competitions/AI"));
const GraphicDesign = lazy(() => import("./components/Competitions/GraphicDesign"));
const STMATH = lazy(() => import("./components/Competitions/STMATH"));
const MobileApp = lazy(() => import("./components/Competitions/MobileApp"));
const Fablab = lazy(() => import("./components/Competitions/Fablab"));
const Arduino = lazy(() => import("./components/Competitions/OpenSource/Arduino"));
const VexGOAbout = lazy(() => import("./components/Competitions/Robotics/VexGo"));
const Vex123About = lazy(() => import("./components/Competitions/Robotics/Vex123"));
const VexV5About = lazy(() => import("./components/Competitions/Robotics/VexV5"));
const VexIQAbout = lazy(() => import("./components/Competitions/Robotics/VexIQ"));
const VexPage = lazy(() => import("./pages/Dashboards/AdminDashboard/Robotics/Vex"));
const SourcePage = lazy(() => import("./pages/Dashboards/AdminDashboard/OpenSource/Source"));
const InterviewSheet = lazy(() => import("./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/JudgeGO/InterviewGo"));
const LiveCoop = lazy(() => import("./pages/LiveEvents/LiveMatches/LiveVexGO/LiveCoopGO/LiveCoop"));




const App = () => {
  
  
  
  const Layout = ({ children, hideNavbar = false }) => (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideNavbar && <Footer />}
    </>
  );
  const LayoutComing = ({ children, hideNavbar = false }) => (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
  

  return (
    <>
        {/* <Router> */}
         <LoadingProvider>
        <MatchProvider>
        <ResultProvider>
        <EventNameProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Suspense fallback={<LoadingPage />}>
              <Home />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/competitions/ComingSoon"
          element={
            <LayoutComing>
              <ComingSoonPage />
            </LayoutComing>
          }
        />
        <Route
          path="*"
          element={
            <Layout hideNavbar>
            <NotFoundPage/>  
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
          path="/ProgrammingCompetitions"
          element={
            <Layout>
              <ProgrammingComp />
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
              <Suspense fallback={<LoadingPage/>}>
                <Gallery />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/gallery/Robotics"
          element={
            <Layout>
              <Suspense fallback={<LoadingPage/>}>
                <Robotics />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/gallery/Robotics/:VexType"
          element={
            <Layout>
              <Suspense fallback={<LoadingPage/>}>
                <RoboticsGallery />
              </Suspense>
            </Layout>
          }
        />
        {/* EVENTS */}
        <Route
          path="/resources/event"
          element={
            <Layout>
                <OurEvents/>
            </Layout>
          }
        />
        <Route
          path="/Competitions/:competition_name"
          element={
            <Layout>
                <CompEvents/>
            </Layout>
          }
        />

<Route
          path="/Competitions/:competition_name/:event_name"
          element={
            <Layout>
              <AllEventDetails/>
            </Layout>
          }
                />
     

        {/* Start Competitions */}
        <Route
          path="/Robotics/Vex"
          element={
            <Layout>
              <Suspense fallback={<LoadingPage/>}>
                <RoboticsPage />
                </Suspense>
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/VexGo"
          element={
            <Layout>
              <Suspense fallback={<LoadingPage />}>
              <VexGOAbout />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/Vex123"
          element={
            <Layout>
            <Suspense fallback={<LoadingPage/>}>
                <Vex123About />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/Competitions/Robotics/VexV5"
          element={
            <Layout>
              <VexV5About />
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
          path="/competitions/OpenSource"
          element={
            <Layout>
              <OpenSourcePage />
            </Layout>
          }
        />
        <Route
          path="/Competitions/OpenSource/Arduino"
          element={
            <Layout>
              <Arduino />
            </Layout>
          }
        />
       
        {/* end Competitions */}
         <Route
          path="/Dashboard/AccountSetting"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <AllSetting />
              </LayoutDashboard>
            </Layout>
          }
        />
        {/* Admin Dashboard Routes */}
        <Route
          path="/Dashboard/AddNews"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <AddNews />
              </LayoutDashboard>
            </Layout>
          }
        />
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
          path="/Dashboard/Competitions/:competition_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <CompetitionEvents />
              </LayoutDashboard>
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Competitions/:competition_name/:event_name"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
              <EventDetails/>
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
          path="/Dashboard/teams/User/:team_name"
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
          path="/Dashboard/JudgeEvent/eventDetailsJudge"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <EventDetailsJudge />
              </LayoutDashboard>
            </Layout>
          }
        />
       

        <Route
          path="/Dashboard/JudgeEvent/vex_iq"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <StartMatchIQ />
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
          path="/Dashboard/JudgeEvent/vex_go"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <StartMatchGO />
              </LayoutDashboard>
            </Layout>
          }
        />
                        <Route
          path="/Dashboard/Judge/matchesGO"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <SelectMatchGO />
              </LayoutDashboard>
            </Layout>
          }
        />
           <Route
          path="/Dashboard/VexGO/COOPMatches"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <COOPMatch />
              </LayoutDashboard>
            </Layout>
          }
        />
          <Route
          path="/Dashboard/VexGO/Skills"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                < SkillsGO/>
              </LayoutDashboard>
            </Layout>
          }
        /> 
        <Route
          path="/SheetCoop"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <SheetCoop />
              </LayoutDashboard>
            </Layout>
          }
        /> 
        <Route
          path="/SheetSolo"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <SheetSolo />
              </LayoutDashboard>
            </Layout>
          }
        /> 



         <Route
          path="/Dashboard/JudgeEvent/vex_123"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <SelectMatch123 />
              </LayoutDashboard>
            </Layout>
          }
        /> 


                         <Route
          path="/Dashboard/Judge/interview123"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Interview123/>
              </LayoutDashboard>
            </Layout>
          }
        /> 
                 <Route
          path="/Dashboard/Judge/matches123"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
              <Sheet123/>
              </LayoutDashboard>
            </Layout>
          }
        /> 





        {/* PROGRAMMING */}

        <Route
          path="/Programming"
          element={
            <Layout hideNavbar>
              {/* <LayoutDashboard> */}
              <ProgWelcome/>
              {/* </LayoutDashboard> */}
            </Layout>
          }
          />

<Route
          path="/Competition-start/:competition"
          element={
            <Layout hideNavbar>
              {/* <LayoutDashboard> */}
              <ProgInfo/>
              {/* </LayoutDashboard> */}
            </Layout>
          }
          />





<Route
          path="/competition/:competition"
          element={
            <Layout hideNavbar>

                <CompetitionQuestions />

            </Layout>
          }
        /> 

<Route
          path="/competition/:competition/results"
          element={
            <Layout hideNavbar>

                <CompetitionResult/>

            </Layout>
          }
        /> 
                


      <Route
          path="/Dashboard/Judge/InterviewGO"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <InterviewSheet />
              </LayoutDashboard>
            </Layout>
          }
        /> 
        
        <Route
          path="/Dashboard/Judge/eventDetailsJudge"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <eventDetailsJudge />
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
          path="/live-events"
          element={
            <Layout>
              <LiveEvents />
            </Layout>
          }
        />
                <Route
          path="/LiveMatch/VexIq"
          element={
            <Layout>
                <IntroVexIQ />
            </Layout>
          }
        />
          <Route
          path="/LiveMatch/Vexgo"
          element={
            <Layout>
                <IntroVexGO />
            </Layout>
          }
        />
                  <Route
          path="/LiveMatch/SkillsIQ"
          element={
            <Layout>
                <LiveSkillsVex/>
            </Layout>
          }
        />
        

        <Route
          path="/LiveMatch/SkillsGo"
          element={
            <Layout>
                <SkillsContainerGO />
            </Layout>
          }
        />
                {/* <Route
          path="/LiveMatch/Skills"
          element={
            <Layout>
                <SkillsContainerIQ />
            </Layout>
          }
        /> */}

                  <Route
          path="/LiveMatch/Teamwork"
          element={
            <Layout>
                <LiveTeamVex />
            </Layout>
          }
                />

                  <Route
          path="/LiveMatch/Coop"
          element={
            <Layout>
                <LiveCoop />
            </Layout>
          }
                />
                

          <Route
          path="/LiveProgramming"
          element={
            <Layout >
                <LiveProgramming/>
            </Layout>
            
          }
            />

<Route
          path="/LiveVex123"
          element={
            <Layout >
                <LiveVex123 />
            </Layout>
            
          }
            />
            </Routes>
            </EventNameProvider>
            </ResultProvider>
            </MatchProvider>
        {/* <ContactUs /> */}

          {/* </Router> */}
      </LoadingProvider>
      </>
  );
};


export default App;
