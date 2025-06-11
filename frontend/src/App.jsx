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
import OpenWelcome from "./pages/Competitions/OpenSource/OpenWelcom"
import CompetitionQuestions from "./pages/Competitions/Programming/main/CompetitionQuestions";
import Home from "./components/Home/Home";
import {ResultProvider } from "../src/context/CompetitionContext" ; 
import CompetitionResult from "./pages/Competitions/Programming/main/CompetitionResult";
import Robotics from "./pages/Gallary/Robotics/Robotics";
import EventDetails from "./pages/Dashboards/AdminDashboard/EventDetails";
import LiveEvents from "./pages/LiveEvents/introEvents";
import IntroVexIQ from "./pages/LiveEvents/IntroVexIQ";
import IntroVexGO from "./pages/LiveEvents/introVexGo";
import LiveTeamIQ from "./pages/Dashboards/View/LiveTeam";
import LiveProgramming from "./pages/LiveEvents/LiveMatches/LiveProgramming";
import LiveVex123 from "./pages/LiveEvents/LiveMatches/LiveVex123";
import LiveSkillsVex from "./pages/LiveEvents/LiveMatches/LiveVexIQ/LiveSkillsIQ/LiveSkills";
import LiveTeamVex from "./pages/LiveEvents/LiveMatches/LiveVexIQ/LiveTeamwork/LiveTeam";
import ProgrammingComp from "./components/Competitions/Programming";
import CompetitionSheetContainer from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";
import Certificate from "./components/Certificate/Certificate"
import OurEvents from "./pages/EventsResources/OurEvents";
import AllEventDetails from "./pages/EventsResources/AllEventDetails";
import CompEvents from "./pages/EventsResources/CompEvents";

import SkillsContainerGO from "./pages/LiveEvents/LiveMatches/LiveVexGO/Skillsgo/SkillsContainerGo";
import CompetitionSheet from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";
import Sheet123 from "./pages/Dashboards/Judge/JudgeComp/Robotics/Vex123/Sheet123";


//                          Judge (Normal Loading)                   //
import JudgeEvent from "./pages/Dashboards/Judge/JudgeEvent";
import MatchRounds from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/matches";
import Interview from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/interview";
import Inspection from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/Inspection";
import Notebook from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/Notebook";
import Teamwork from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/teamwork";
import Skills from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/skills";
import EventDetailsJudge from "./pages/Dashboards/Judge/eventDetailsJudge";

import SelectEvent from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/matches/SelectMatch";
import StartMatchIQ from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexIQ/StartMatchIQ";
import StartMatchGO from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/JudgeGO/StartMatchGO";
import SelectMatchGO from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/JudgeGO/SelectMatchGO";
import COOPMatch from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/COOPmatches";
import SkillsGO from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/Solomatches";
import SheetCoop from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/matches/SheetCoop";
import ScheduleManagement from "./pages/Dashboards/AdminDashboard/Management/CreateSchedule/ScheduleManagement";
import MyCertificate from "./pages/Dashboards/UserDashbord/MyCertificate";
import Rank from "./pages/EventsResources/Rank";


//                              Sample pages & Forms               //
//                          Common Pages                           //
import NotFoundPage from "./pages/NotFound";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";
import VolunteerForm from "./pages/Volunteer/Volunteerform";
import ComingSoonPage from "./pages/ComingSoon";

//                          Admin Pages                           //
import AddNews from "./pages/Dashboards/AddNews";
import CreateEvent from "./pages/Dashboards/AdminDashboard/Management/CreateEvent";
import CreateStaff from "./pages/Dashboards/AdminDashboard/Management/CreateStaff";
import CreateCompetition from "./pages/Dashboards/AdminDashboard/Management/CreateCompetition";
import CreateOrganization from "./pages/Dashboards/AdminDashboard/Management/CreateOrg";

//                          User Pages                           //
import CreateTeam from "./pages/Dashboards/UserDashbord/CreateTeam";
import PaymentForm from "./pages/Dashboards/UserDashbord/PayMent";

//                          Dashboards                           //
import EventDash from "./pages/Dashboards/EventsDash";
import UADashboard from "./pages/Dashboards/UADashboard";

// 414
//                          Admin                           //
import ListTeams from "./pages/Dashboards/AdminDashboard/ListTeams";
import TeamDetails from "./pages/Dashboards/AdminDashboard/TeamDetails";
import ListCompetitions from "./pages/Dashboards/AdminDashboard/ListCompetitions";
import CompetitionEvents from "./pages/Dashboards/AdminDashboard/CompetitionEvents";
import ListJudges from "./pages/Dashboards/AdminDashboard/ListJudges";
import GameScheduleForm from "./pages/Dashboards/AdminDashboard/Management/CreateSchedule/GameScheduleForm";
import DeleteSchedule from "./pages/Dashboards/AdminDashboard/Management/CreateSchedule/DeleteSchedule";

//                          User                           //
import MyTeams from "./pages/Dashboards/UserDashbord/MyTeams";
import MyTeamDetails from "./pages/Dashboards/UserDashbord/MyTeamDetails";

//                          Misc                           //
import AllSetting from "./pages/AccountSetting/AllSetting";
import TeamSetting from "./pages/AccountSetting/TeamSetting";

//                      Home pages              //
import Gallery from "./pages/Gallary/Gallary";
import RoboticsGallery from "./pages/Gallary/Robotics/RoboticsGallery";

//                        Competitions                       //
import RoboticsPage from "./components/Competitions/roboticsPage";
import OpenSourcePage from "./components/Competitions/openSourcePage";
import Arduino from "./components/Competitions/OpenSource/Arduino";
import VexGOAbout from "./components/Competitions/Robotics/VexGo";
import Vex123About from "./components/Competitions/Robotics/Vex123";
import VexV5About from "./components/Competitions/Robotics/VexV5";
import VexIQAbout from "./components/Competitions/Robotics/VexIQ";
import VexPage from "./pages/Dashboards/AdminDashboard/Robotics/Vex";
import SourcePage from "./pages/Dashboards/AdminDashboard/OpenSource/Source";
import InterviewSheet from "./pages/Dashboards/Judge/JudgeComp/Robotics/VexGO/JudgeGO/InterviewGo";
import LiveCoop from "./pages/LiveEvents/LiveMatches/LiveVexGO/LiveCoopGO/LiveCoop";
import CompOpen from "./pages/Competitions/OpenSource/CompOpen";
import RegisterOrg from "./pages/Auth/RegisterOrg";
import OrganizerDash from "./pages/Dashboards/OrganizerDash/OrganizerDash";
import ActiveOrg from "./pages/Dashboards/AdminDashboard/Management/ActiveOrg";
import Python from "./pages/Dashboards/Judge/JudgeComp/Programming/Python";
import FileComp from "./pages/Dashboards/Judge/JudgeComp/OpenSource/FileComp";
import UploadFileMcq from "./pages/Dashboards/AdminDashboard/Management/UploedFileMcq";


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
          path="/register/organization"
          element={
            <Layout>
              <RegisterOrg />
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
              
                <Gallery />
              
            </Layout>
          }
        />
        <Route
          path="/gallery/Robotics"
          element={
            <Layout>
                <Robotics />
            </Layout>
          }
        />
        <Route
          path="/gallery/Robotics/:VexType"
          element={
            <Layout>
              
                <RoboticsGallery />
              
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
          path="/Competitions/:competition_name/:event_name/Rank"
          element={
            <Layout>
                <Rank/>
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
         <Route
          path="/Dashboard/TeamSetting/:id"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <TeamSetting />
              </LayoutDashboard>
            </Layout>
          }
        />
              {/* Organizer Dashboard Routes */}
         <Route
          path="/Dashboard/OrganizerEvent"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <OrganizerDash />
              </LayoutDashboard>
            </Layout>
          }
        />
              

        {/* Admin Dashboard Routes */}
        <Route
          path="/Dashboard/Certificate"
          element={
            <Layout hideNavbar>
                <Certificate />
            </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/Upload_QuestionsFile"
          element={
            
             <Layout hideNavbar>
             <LayoutDashboard>
             <UploadFileMcq />
             </LayoutDashboard>
           </Layout>
          }
        />
        <Route
          path="/Dashboard/Admin/ActiveOrganization"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <ActiveOrg />
              </LayoutDashboard>
            </Layout>
          }
        />
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
          path="/Dashboard/Teams/:id"
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
          path="/Dashboard/Admin/Schedule"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <ScheduleManagement />
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
          path="/Dashboard/teams/User/:id"
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
          path="/Dashboard/User/Certificate/:id"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <MyCertificate />
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
          path="/Dashboard/JudgeEvent/python"
          element={
            <Layout hideNavbar>
              <LayoutDashboard>
                <Python />
              </LayoutDashboard>
            </Layout>
          }
        />
       <Route
  path="/Dashboard/JudgeEvent/:competition_name"
  element={
    <Layout hideNavbar>
      <LayoutDashboard>
        <FileComp />
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
          path="/OpenSource"
          element={
            <Layout hideNavbar>
              {/* <LayoutDashboard> */}
              <OpenWelcome/>
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
          path="/CompetitionOpenSource-start/:competition"
          element={
            <Layout hideNavbar>
              {/* <LayoutDashboard> */}
              <CompOpen/>
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
            </ResultProvider>
            </MatchProvider>
        {/* <ContactUs /> */}

          {/* </Router> */}
      </LoadingProvider>
      </>
  );
};


export default App;
