import React, { useContext } from "react";
import "../App.css";
import Signup from "./Signup.jsx";
import Signin_landlord from "./Login.jsx";
import Account, { AccountContext } from "./Account.jsx";
import Status from "./Status.jsx";
import Dashboard from "./Dashboard.jsx";
import { Route, BrowserRouter, Link } from "react-router-dom";
import User_login from "./User_Home.jsx";

const App = () => {
  return (
    <div>
      <Status />
      <Signup />
      <Signin_landlord />
    </div>
  );
};

export default App;
