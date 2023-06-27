/* global FB */

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AccountContext } from "./User_Account.jsx";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoIdentityCredentials,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    userPoolId: "us-east-1_zBOyMr7hs",
    userPoolWebClientId: "474p9bsq38phlbsk6rq0rak8d1",
    identityPoolId: "us-east-1:2db79836-c39c-426f-9aa5-1ed010e49e3c",
    region: "us-east-1",
    mandatorySignIn: true,
    oauth: {
      domain: "joinwherologin.auth.us-east-1.amazoncognito.com",
      scope: ["email", "profile", "openid"],
      redirectSignIn: "http://joinwhero.com/User_dashboard",
      redirectSignOut: "http://joinwhero.com",
      responseType: "token",
    },
    federationTarget: "COGNITO_USER_POOLS",
  },
});

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
        fields: "id,first_name,last_name,email",
        appsecret_proof: process.env.REACT_APP_PASS_PHRASE,
      },
      async (response) => {
        try {
          console.log("User info response:", response);

          const { email, first_name, last_name } = response;
          setEmail(email);
          setGivenName(first_name);

          const currentUser = await Auth.currentAuthenticatedUser();
          Auth.updateUserAttributes(currentUser, {
            email,
            given_name: first_name,
            family_name: last_name,
            gender: "male", // Hard-code the 'gender' attribute to 'male'
          });

          navigate("/User_dashboard");
        } catch (error) {
          console.error("Failed to get user info or update user attributes: ");
          document.getElementById("status").innerHTML =
            "An unexpected error occurred. Please try again.";
        }
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
        <label htmlFor="email">Email</label>
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
