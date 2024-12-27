

import "./index.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import App from './App';  // Import your main App component
import Login from './Components/Login';
import Dashboard from "./Components/Home/Dashboard";

 ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Login/>} />
        <Route path="dashboard" element={<Dashboard/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);
