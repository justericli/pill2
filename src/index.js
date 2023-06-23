import React from "react";
import ReactDOM from "react-dom";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import App from "./components/Landlord_login.jsx";
import Account from "./components/Account.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Home from "./Home.jsx";
import User_login from "./components/User_Home.jsx";
import User_dashboard from "./components/User_dashboard.jsx";
import FacebookLogin from "./components/Untitled-1.js";

Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Account>
        <Routes>
          <Route path="/User_dashboard" element={<User_dashboard />} />
          <Route path="/User_login" element={<User_login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/Landlord_login" element={<App />} />
          <Route path="/login" element={<User_dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Testing" element={<FacebookLogin />} />
        </Routes>
      </Account>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
