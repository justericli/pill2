/* global FB */

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AccountContext } from "./User_Account.jsx";
import { CognitoUserPool } from "amazon-cognito-identity-js";

// Replace these with your actual UserPoolId and ClientId
const UserPoolId = "us-east-1_zBOyMr7hs";
const ClientId = "474p9bsq38phlbsk6rq0rak8d1";

const poolData = {
  UserPoolId,
  ClientId,
};
const userPool = new CognitoUserPool(poolData);

const User_login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { authenticate, setAuthenticated } = useContext(AccountContext);
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const fbUser = "";

  const statusChangeCallback = (response) => {
    console.log("statusChangeCallback");
    console.log(response);
    if (response.status === "connected") {
      getUserInfo();
      testAPI();
    } else {
      document.getElementById("status").innerHTML = "Please log into this app.";
    }
  };

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

  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
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

// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Auth } from "aws-amplify";
// import { AccountContext } from "./User_Account.jsx";
// import FacebookLogin from "facebook-login";

// const User_login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fbLoaded, setFbLoaded] = useState(false);
//   const navigate = useNavigate();
//   const { authenticate, setAuthenticated } = useContext(AccountContext);

//   Auth.currentAuthenticatedUser()
//     .then((user) => {
//       return Auth.updateUserAttributes(user, {
//         email: email,
//         given_name: first_name, // Amplify uses 'given_name' instead of 'first_name'
//         family_name: last_name, // Amplify uses 'family_name' instead of 'last_name'
//       });
//     })
//     .then((data) => {
//       console.log("Successfully updated user attributes:", data);
//     })
//     .catch((err) => {
//       console.log("Error updating user attributes:", err);
//     });

//   const statusChangeCallback = (response) => {
//     console.log("Status Change Callback Response:", response);
//     if (response.status === "connected") {
//       getUserInfo();
//     } else {
//       console.log("User cancelled login or did not fully authorize.");
//       document.getElementById("status").innerHTML =
//         "Please log into this webpage.";
//     }
//   };

//   const getUserInfo = () => {
//     console.log("Getting user info");
//     window.FB.api(
//       "/me",
//       {
//         fields: "first_name,last_name,email",
//         appsecret_proof: process.env.REACT_APP_PASS_PHRASE,
//       },
//       function (response) {
//         console.log("User info response:", response);
//         console.log("Successful login for: " + response.name);

//         const authResponse = window.FB.getAuthResponse();
//         let { accessToken, expiresIn } = authResponse;

//         if (!accessToken || !expiresIn) {
//           console.log("Access token or expiration time is missing.");
//           return;
//         }

//         document.getElementById("status").innerHTML =
//           "Thanks for logging in, " + response.name + "!";

//         console.log("Facebook Access Token: ", accessToken);

//         const { email, first_name, last_name } = response;

//         console.log(
//           "FACEBOOK_APP_SECRET: ",
//           process.env.REACT_APP_FACEBOOK_APP_SECRET
//         );

//         // Get the current authenticated user and then update attributes
//         Auth.currentAuthenticatedUser()
//           .then((user) => {
//             return Auth.updateUserAttributes(user, {
//               email: email, // Setting the email
//               given_name: first_name, // Set 'given_name' attribute
//               family_name: last_name, // Set 'family_name' attribute
//               // 'gender': gender,  // gender might not be available
//             });
//           })
//           .then((data) => {
//             console.log("Successfully updated user attributes:", data);
//           })
//           .catch((err) => {
//             console.log("Error updating user attributes:", err);
//           });

//         // Redirect the user to the dashboard
//         navigate("/User_dashboard");
//       }
//     );
//   };

//   const checkLoginState = () => {
//     console.log("Checking login state");
//     if (fbLoaded && window.FB.getAuthResponse().status === "connected") {
//       getUserInfo();
//     }
//   };

//   useEffect(() => {
//     if (window.FB) {
//       window.FB.init({
//         appId: "730655258288890",
//         cookie: true,
//         xfbml: true,
//         version: "v15.0",
//       });

//       window.FB.getLoginStatus(statusChangeCallback);
//     } else {
//       console.log("Facebook SDK not loaded yet");
//     }
//   }, []);

//   const onSubmit = (event) => {
//     event.preventDefault();

//     // Authenticate the user with the Amplify Auth service
//     Auth.signIn(email, password, (err, data) => {
//       if (err) {
//         console.log("Error signing in user:", err);
//       } else {
//         console.log("Successfully signed in user:", data);

//         // Check the user's login state
//         checkLoginState();
//       }
//     });
//   };

//   return (
//     <div>
//       <form onSubmit={onSubmit}>
//         <label htmlFor="email">Email</label>
//         <input
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//         ></input>
//         <label htmlFor="password">Password</label>
//         <input
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//         ></input>
//         <button type="submit">Login</button>
//       </form>
//       <div
//         className="fb-login-button"
//         data-width=""
//         data-size="large"
//         data-button-type="continue_with"
//         data-layout="default"
//         data-auto-logout-link="false"
//         data-use-continue-as="true"
//       ></div>
//       <button onClick={checkLoginState} disabled={!fbLoaded}>
//         Hi
//       </button>
//     </div>
//   );
// };

// export default User_login;
