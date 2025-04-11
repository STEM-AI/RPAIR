import React from 'react';
import 'animate.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense } from 'react';
import LoadingPage from './components/LoadingPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<LoadingPage/>}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </Suspense>
    </HelmetProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
