/* global FB */

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AccountContext } from "./User_Account.jsx";

const User_login = () => {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { authenticate, setAuthenticated } = useContext(AccountContext);

  const statusChangeCallback = (response) => {
    console.log("statusChangeCallback");
    console.log(response);

    if (response.status === "connected") {
      testAPI();
    } else {
      setStatus("Please log into this webpage.");
    }
  };

  const checkLoginState = () => {
    FB.getLoginStatus((response) => {
      statusChangeCallback(response);
    });
  };

  const testAPI = () => {
    console.log("Welcome!  Fetching your information.... ");
    FB.api("/me", (response) => {
      console.log("Successful login for: " + response.name);
      setStatus("Thanks for logging in, " + response.name + "!");
    });
  };

  useEffect(() => {
    window.fbAsyncInit = () => {
      FB.init({
        appId: "{app-id}", // replace with your app id
        cookie: true,
        xfbml: true,
        version: "{api-version}", // replace with your api version
      });

      FB.getLoginStatus((response) => {
        statusChangeCallback(response);
      });
    };

    if (window.FB) {
      window.fbAsyncInit();
    }
  }, []);

  return (
    <div>
      <button onClick={checkLoginState}>Login with Facebook</button>
      <div id="status">{status}</div>
    </div>
  );
};

export default User_login;
