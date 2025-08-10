import React, { useEffect } from 'react'
import Navbar from '../../../components/Nav/nav';
import Footer from '../../../components/Footer/footer';
import { useLocation } from 'react-router-dom';

export default function Layout({ hideNavbar = false,hideFooter = false , children }) {
  const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
  
    return (
    <>
         {!hideNavbar && <Navbar />}
            <ScrollToTop />
            {children}
        {!hideNavbar && <Footer />}
    </>
  )
}
