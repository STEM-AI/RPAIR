import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Nav/nav';
import Footer from './components/Footer/footer';
import Home from './components/Home/Home';
import About from './pages/About/About'; // استيراد صفحة About
import ContactUs from './components/Contact/contactUs';

const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<Home />} />
          
          {/* صفحة About */}
          <Route path="/about" element={<About />} />

        </Routes>
        <ContactUs />
        <Footer />
      </>
    </Router>
  );
}

export default App;