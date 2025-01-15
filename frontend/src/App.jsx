import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Nav/nav';
import Footer from './components/Footer/footer';
import Home from './components/Home/Home';
import About from './pages/About/About'; 
import Competitions from './pages/Competitions/Competitions';
import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';

import AdminDashboard from './components/Dashboards/AdminDashboard/AdminDashboard';
import Teams from './components/Dashboards/AdminDashboard/Teams';
import Layout from './pages/Dashboards/Layout/Layout';


const App = () => {

  return (
    <>
    
    
        {/* <Navbar /> */}
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Competitions/>} />
          <Route
        path="/Dashboard/Admin"
        element={
          <Layout>
            <AdminDashboard />
          </Layout>
        }
      />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route
        path="/Dashboard/Admin/Teams"
        element={
          <Layout>
            <Teams />
          </Layout>
        }
      />
    </Routes>
          
         

        
        </Router>

        {/* <Footer /> */}
      
    
      </>
  );
}


export default App;

