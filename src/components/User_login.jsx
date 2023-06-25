/* global FB */

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AccountContext } from "./User_Account.jsx";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from "amazon-cognito-identity-js";

// Replace these with your actual UserPoolId and ClientId
const UserPoolId = "us-east-1_zBOyMr7hs";
const ClientId = "474p9bsq38phlbsk6rq0rak8d1";

const poolData = {
  UserPoolId,
  ClientId,
};
const userPool = new CognitoUserPool(poolData);

const User_login = () => {
  async function statusChangeCallback(response) {
    console.log("statusChangeCallback");
    console.log(response);
    if (response.status === "connected") {
      getUserInfo();
      testAPI();
    } else {
      document.getElementById("status").innerHTML = "Please log into this app.";
    }
  }

  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { authenticate, setAuthenticated } = useContext(AccountContext);
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");

  const getUserInfo = () => {
    console.log("Getting user info");
    FB.api(
      "/me",
      {
        fields: "name,email",
        appsecret_proof: process.env.REACT_APP_PASS_PHRASE,
      },
      (response) => {
        console.log("User info response:", response);

        const { email, name } = response;

        Auth.updateUserAttributes(authenticate().user, {
          email,
          name,
        });

        navigate("/User_dashboard");
      }
    );
  };

  window.statusChangeCallback = statusChangeCallback;
  window.getUserInfo = getUserInfo;

  function testAPI() {
    console.log("Welcome!  Fetching your information.... ");
    FB.api("/me", function (response) {
      console.log("Successful login for: " + response.name);
      document.getElementById("status").innerHTML =
        "Thanks for logging in, " + response.name + "!";
    });
  }

  useEffect(() => {
    // This function initializes our FB library
    const initializeFacebookLogin = () => {
      FB.init({
        appId: "730655258288890",
        cookie: true,
        xfbml: true,
        version: "v15.0",
      });

      FB.getLoginStatus((response) => {
        statusChangeCallback(response);
      });

      // Add a listener to the auth.statusChange event
      FB.Event.subscribe("auth.statusChange", statusChangeCallback);

      // Add a listener to the auth.logout event
      FB.Event.subscribe("auth.logout", () => {
        // Clear the state
        setGivenName("");
      });
    };

    // This event listener is triggered when the FB SDK has loaded
    window.fbAsyncInit = initializeFacebookLogin;

    if (window.FB) {
      initializeFacebookLogin();
    }

    return () => {
      if (window.FB) {
        FB.Event.unsubscribe("auth.statusChange", statusChangeCallback);
        FB.Event.unsubscribe("auth.logout", () => {});
      }
    };
  }, []);

  const handleFBLogin = () => {
    FB.login((response) => {
      statusChangeCallback(response);
      testAPI();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("User logged in");
        navigate("/User_dashboard");
      },
      onFailure: (err) => {
        console.error("Error logging in:", err);
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Can you see me ?email">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>
        <button type="submit">Login</button>
      </form>
      <div
        className="fb-login-button"
        data-width=""
        data-size="large"
        data-button-type="continue_with"
        data-layout="default"
        data-auto-logout-link="false"
        data-use-continue-as="true"
        onClick={handleFBLogin}
      ></div>
      <div id="status"></div>
    </div>
  );
};

export default User_login;
