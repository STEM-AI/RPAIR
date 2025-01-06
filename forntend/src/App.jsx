import './App.css';
import react from 'react';
import Navbar from './components/Nav/nav';
import Footer from './components/Footer/footer';
import CardSlider from './components/CardSlider/cardSlider';
import Home from './components/Home/Home';
function App() {
  return (
    <>
      <Navbar />
      <Home/>
      <CardSlider />
      <Footer/>
    </>
  );
}

export default App

