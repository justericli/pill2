/* global FB */

import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Auth } from "aws-amplify";
import { AccountContext } from "./User_Account.jsx";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from "amazon-cognito-identity-js";
import { Amplify } from "aws-amplify";
import jsSHA from "jssha";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { authenticate, setAuthenticated, logout } = useContext(AccountContext);
  const [fbLoginClicked, setFbLoginClicked] = useState(false);
  let fbToken = "";
  let fbExpiresAt = "";

  const createUser = async (email, firstName, lastName) => {
    const response = await axios.post(
      `https://3tcdi7h273.execute-api.us-east-1.amazonaws.com/prod`,
      {
        email,
        firstName,
        lastName,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = response.data;

    return user;
  };

  const checkUserExists = async (email) => {
    const response = await axios.get(`/api/users?email=${email}`);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = response.data;

    return user != null;
  };

  const statusChangeCallback = useCallback(
    (response) => {
      console.log("statusChangeCallback");
      console.log(response);
      if (response.status === "connected") {
        fbToken = response.authResponse.accessToken; // Save the token
        fbExpiresAt =
          new Date().getTime() + response.authResponse.expiresIn * 1000; // Convert to timestamp
        getUserInfo();
        testAPI();
        refreshAuthToken(); // Refresh the token in AWS Cognito session
      } else {
        document.getElementById("status").innerHTML =
          "Please log into this app.";
      }
    },
    [setAuthenticated, authenticate]
  );

  useEffect(() => {
    // Ensure the latest version of statusChangeCallback is used in the global scope
    window.statusChangeCallback = statusChangeCallback;
  }, [statusChangeCallback]);

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
        appsecret_proof: generateAppSecretProof(
          fbToken,
          "33622b51827d1b461df385fbf0b1818c"
        ),
      },
      async (response) => {
        try {
          console.log("User info response:", response);
          const { email, first_name, last_name } = response;
          setEmail(email);

          const userExists = await checkUserExists(email);

          if (!userExists) {
            //Create a new user if they don't exist.
            await createUser(email, first_name, last_name);
          }

          await Auth.federatedSignIn(
            "facebook",
            { token: fbToken, expires_at: fbExpiresAt },
            { email: email, name: first_name }
          );

          const currentUser = await Auth.currentAuthenticatedUser();
          Auth.updateUserAttributes(currentUser, {
            email,
            given_name: first_name,
            family_name: last_name,
            gender: "male",
          });

          navigate("/User_dashboard");
        } catch (error) {
          console.error(
            "Failed to get user info or update user attributes: ",
            error
          );
          if (fbLoginClicked) {
            document.getElementById("status").innerHTML =
              "An unexpected error occurred. Please try again.";
          }
        }
      }
    );
  };

  const generateAppSecretProof = (accessToken, appSecret) => {
    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.setHMACKey(appSecret, "TEXT");
    shaObj.update(accessToken);
    return shaObj.getHMAC("HEX");
  };

  function testAPI() {
    console.log("Welcome! Fetching your information...");
    FB.api("/me", { fields: "name" }, function (response) {
      console.log("Response from Facebook API:", response);
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

  const refreshAuthToken = () => {
    setInterval(async () => {
      const tokenExpiresAt = localStorage.getItem("fbTokenExpiresAt");
      const currentTime = new Date().getTime();
      console.log("refreshAuthToken is being called");

      // Refresh the token a few minutes before it actually expires
      if (currentTime > tokenExpiresAt - 5 * 60 * 1000) {
        try {
          const { authResponse } = await new Promise((resolve, reject) => {
            FB.getLoginStatus(resolve);
          });
          if (authResponse && authResponse.accessToken) {
            fbToken = authResponse.accessToken;
            fbExpiresAt = new Date().getTime() + authResponse.expiresIn * 1000;
            localStorage.setItem("fbTokenExpiresAt", fbExpiresAt);
            await Auth.federatedSignIn("facebook", {
              token: fbToken,
              expires_at: fbExpiresAt,
            });
          }
        } catch (error) {
          console.error("Failed to refresh the token:", error);
        }
      }
    }, 60000); // check every minute
  };

  useEffect(() => {
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

      FB.Event.subscribe("auth.statusChange", statusChangeCallback);

      FB.Event.subscribe("auth.logout", () => {
        setEmail("");
      });
    };

    window.fbAsyncInit = initializeFacebookLogin;

    if (window.FB) {
      initializeFacebookLogin();
      refreshAuthToken();
    }

    return () => {
      if (window.FB) {
        FB.Event.unsubscribe("auth.statusChange", statusChangeCallback);
        FB.Event.unsubscribe("auth.logout", () => {});
      }
    };
  }, []);

  const generateNonce = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = "";
    for (let i = 0; i < 16; i++) {
      nonce += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return nonce;
  };

  const handleFBLogin = () => {
    setFbLoginClicked(true);
    FB.login(
      async (response) => {
        if (response.authResponse) {
          const { accessToken, expiresIn } = response.authResponse;

          const fbExpiresAt = new Date().getTime() + expiresIn * 1000;

          FB.api(
            "/me",
            { fields: "id,first_name,last_name,email" },
            async (response) => {
              const { email, first_name, last_name } = response;
              setEmail(email);

              try {
                await Auth.federatedSignIn(
                  "facebook",
                  { token: accessToken, expires_at: fbExpiresAt },
                  { email: email, name: first_name }
                );

                const currentUser = await Auth.currentAuthenticatedUser();
                Auth.updateUserAttributes(currentUser, {
                  email,
                  given_name: first_name,
                  family_name: last_name,
                  gender: "male",
                });
                navigate("/User_dashboard");
              } catch (error) {
                console.error(
                  "Failed to get user info or update user attributes: ",
                  error
                );
              }
            }
          );
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        scope: "public_profile,email",
        return_scopes: true,
        auth_type: "rerequest",
        nonce: generateNonce(), // Generate nonce for Facebook login
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make the API request to your API Gateway endpoint
      const response = await axios.post(
        "https://3tcdi7h273.execute-api.us-east-1.amazonaws.com/prod", // Replace with your API Gateway endpoint URL
        { email } // Pass the email value to the API request body
      );

      // Handle the response from the API
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }

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
        setAuthenticated(true);
        authenticate(email, password);
        navigate("/User_dashboard");
      },
      onFailure: (err) => {
        console.error("Error logging in:", err);
      },
    });
  };

  useEffect(() => {
    // Dynamically append the Facebook SDK script tag
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0&appId=730655258288890&autoLogAppEvents=1";
    script.nonce = generateNonce(); // Generate nonce for Facebook SDK script tag
    document.body.appendChild(script);

    return () => {
      // Remove the Facebook SDK script tag when component unmounts
      document.body.removeChild(script);
    };
  }, []);

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
