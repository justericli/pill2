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
  const [fbToken, setFbToken] = useState("");
  const [fbExpiresAt, setFbExpiresAt] = useState("");

  let fbLoginClicked = false; // Flag to track if Facebook login button was clicked

  const statusChangeCallback = (response) => {
    console.log("statusChangeCallback");
    console.log(response);
    if (response.status === "connected") {
      setFbToken(response.authResponse.accessToken); // Save the token
      const expiresAt =
        new Date().getTime() + response.authResponse.expiresIn * 1000;
      setFbExpiresAt(expiresAt);
      localStorage.setItem("fbTokenExpiresAt", expiresAt);
      getUserInfo();
      testAPI();
      refreshAuthToken(); // Refresh the token in AWS Cognito sessions
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
          setGivenName(first_name);

          console.log(fbToken);

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

  window.statusChangeCallback = statusChangeCallback;
  window.getUserInfo = getUserInfo;

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

      // Refresh the token a few minutes before it actually expires
      if (currentTime > tokenExpiresAt - 5 * 60 * 1000) {
        try {
          const { authResponse } = await new Promise((resolve, reject) => {
            FB.getLoginStatus(resolve);
          });
          if (authResponse && authResponse.accessToken) {
            const newToken = authResponse.accessToken;
            const newExpiresAt =
              new Date().getTime() + authResponse.expiresIn * 1000;
            setFbToken(newToken);
            setFbExpiresAt(newExpiresAt);
            localStorage.setItem("fbTokenExpiresAt", newExpiresAt);
            await Auth.federatedSignIn("facebook", {
              token: newToken,
              expires_at: newExpiresAt,
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
        setGivenName("");
      });
    };

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
    FB.login(
      async (response) => {
        if (response.authResponse) {
          const { accessToken, expiresIn } = response.authResponse;

          const fbExpiresAt = new Date().getTime() + expiresIn * 1000;

          setFbToken(accessToken);
          setFbExpiresAt(fbExpiresAt);

          FB.api(
            "/me",
            { fields: "id,first_name,last_name,email" },
            async (response) => {
              const { email, first_name, last_name } = response;
              setEmail(email);
              setGivenName(first_name);

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

  // const handleFBLogin = () => {
  //   fbLoginClicked = true;
  //   FB.login(
  //     (response) => {
  //       if (response.authResponse) {
  //         console.log("Welcome! Fetching your information...");
  //         FB.api("/me", function (response) {
  //           console.log("Good to see you, " + response.name + ".");
  //           statusChangeCallback(response);
  //           testAPI();

  //           // Perform login logic here
  //           if (fbToken && fbExpiresAt) {
  //             getUserInfo();
  //           }
  //         });
  //       } else {
  //         console.log("User cancelled login or did not fully authorize.");
  //       }
  //     },
  //     {
  //       scope: "public_profile,email",
  //       return_scopes: true,
  //       auth_type: "rerequest",
  //       nonce: generateNonce(), // Generate nonce for Facebook login
  //     }
  //   );
  // };

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

//
//
//

//
//

//

//

//

//
//import React, { useEffect, useState } from "react";
// import { Amplify, Auth, Hub } from "aws-amplify";
// import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
// import awsConfig from "./aws-exports";

// const updatedAwsConfig = {
//   ...awsConfig,
//   oauth: {
//     ...awsConfig.oauth,
//     domain: "joinwherologin.auth.us-east-1.amazoncognito.com",
//     scope: ["email", "profile", "openid"],
//     redirectSignIn: "http://www.joinwhero.com/User_dashboard",
//     redirectSignOut: "http://www.joinwhero.com/User_login",
//     responseType: "token",
//     identityPoolId: "us-east-1:2db79836-c39c-426f-9aa5-1ed010e49e3c",
//     region: "us-east-1",
//     userPoolId: "us-east-1_zBOyMr7hs",
//     userPoolWebClientId: "474p9bsq38phlbsk6rq0rak8d1",
//   },
// };

// Amplify.configure(updatedAwsConfig);

// function UserLogin() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const authListener = ({ payload: { event, data } }) => {
//       switch (event) {
//         case "signIn":
//         case "cognitoHostedUI":
//           getUser().then((userData) => setUser(userData));
//           break;
//         case "signOut":
//           setUser(null);
//           break;
//         case "signIn_failure":
//         case "cognitoHostedUI_failure":
//           console.log("Sign in failure", data);
//           break;
//         default:
//           break;
//       }
//     };

//     Hub.listen("auth", authListener);

//     Auth.currentAuthenticatedUser()
//       .then((currentUser) => setUser(currentUser))
//       .catch(() => console.log("Not signed in"));

//     return () => {
//       Hub.remove("auth", authListener);
//     };
//   }, []);

//   const getUser = async () => {
//     const currentUser = await Auth.currentAuthenticatedUser();
//     return currentUser;
//   };

//   return (
//     <div className="App">
//       <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
//       <button
//         onClick={() =>
//           Auth.federatedSignIn({
//             provider: CognitoHostedUIIdentityProvider.Facebook,
//           })
//         }
//       >
//         Open Facebook
//       </button>
//       <button onClick={() => Auth.signOut()}>Sign Out</button>
//       <div>{user && user.getUsername()}</div>
//     </div>
//   );
// }

// export default UserLogin;
