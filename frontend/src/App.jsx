import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Nav/nav';
import Footer from './components/Footer/footer';
import Home from './components/Home/Home';
import About from './pages/About/About'; 
import ContactUs from './components/Contact/contactUs';
import Competitions from './pages/Competitions/Competitions';

const App = () => {
  return (
    <>
    <Router>
    
        <Navbar />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Competitions/>} />

        </Routes>

        <ContactUs />

        <Footer />
      
    </Router >
      </>
  );
}


export default App;

