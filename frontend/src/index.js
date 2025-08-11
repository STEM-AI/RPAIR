import React from 'react';
import 'animate.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import 'animate.css/animate.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
    </HelmetProvider>

  </React.StrictMode>
);
