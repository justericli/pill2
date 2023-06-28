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
      redirectSignIn: "http://www.joinwhero.com/User_dashboard",
      redirectSignOut: "http://www.joinwhero.com/User_login",
      responseType: "token",
    },
    federationTarget: "COGNITO_USER_POOLS",
  },
});

const User_login = () => {
  let fbToken = "";
  let fbExpiresAt = "";
  let fbLoginClicked = false; // Flag to track if Facebook login button was clicked

  const statusChangeCallback = (response) => {
    console.log("statusChangeCallback");
    console.log(response);
    if (response.status === "connected") {
      fbToken = response.authResponse.accessToken; // Save the token
      fbExpiresAt = response.authResponse.expiresIn; // Save the expiration time
      getUserInfo();
      testAPI();
    } else {
      document.getElementById("status").innerHTML = "Please log into this app.";
    }
  };

  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { authenticate, setAuthenticated, logout } = useContext(AccountContext);
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");

  const UserPoolId = "us-east-1_zBOyMr7hs";
  const ClientId = "474p9bsq38phlbsk6rq0rak8d1";

  const poolData = {
    UserPoolId,
    ClientId,
  };
  const userPool = new CognitoUserPool(poolData); // Define userPool here

  const getUserInfo = () => {
    console.log("Getting user info");
    FB.api(
      "/me",
      {
        fields: "id,first_name,last_name,email",
        appsecret_proof: "Karatekid22@",
      },
      async (response) => {
        try {
          console.log("User info response:", response);
          const { email, first_name, last_name } = response;
          setEmail(email);
          setGivenName(first_name);

          await Auth.federatedSignIn(
            "facebook",
            { token: fbToken, expires_at: fbExpiresAt }, // Use saved token and expiration time
            { email: email, name: first_name }
          );

          const currentUser = await Auth.currentAuthenticatedUser();
          Auth.updateUserAttributes(currentUser, {
            email,
            given_name: first_name,
            family_name: last_name,
            gender: "male", // Hard-code the 'gender' attribute to 'male'
          });

          navigate("/User_dashboard");
        } catch (error) {
          console.error(
            "Failed to get user info or update user attributes: ",
            error
          );
          if (fbLoginClicked) {
            // Show error message only if Facebook login button was clicked
            document.getElementById("status").innerHTML =
              "An unexpected error occurred. Please try again.";
          }
        }
      }
    );
  };

  window.statusChangeCallback = statusChangeCallback;
  window.getUserInfo = getUserInfo;

  function testAPI() {
    console.log("Welcome!  Fetching your information.... ");
    FB.api("/me", { fields: "name" }, function (response) {
      console.log("Response from Facebook API: ", response);
      if (response.name) {
        console.log("Successful login for: " + response.name);
        document.getElementById("status").innerHTML =
          "Thanks for logging in, " + response.name + "!";
      } else {
        console.log("Name field not found in the response.");
        document.getElementById("status").innerHTML =
          "Logged in, but could not get the user's name.";
      }
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
    fbLoginClicked = true; // Set the flag to true when Facebook login button is clicked
    FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("Welcome!  Fetching your information.... ");
          FB.api("/me", function (response) {
            console.log("Good to see you, " + response.name + ".");
            statusChangeCallback(response);
            testAPI();
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        scope: "public_profile,email",
        return_scopes: true,
        auth_type: "rerequest",
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("User logged in");
        setAuthenticated(true); // Set authenticated to true when user logs in
        authenticate(email, password);
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
