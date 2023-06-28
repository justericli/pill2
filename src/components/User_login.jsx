/* global FB */

import React, { useState, useEffect } from "react";

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
      testAPI();
    } else {
      document.getElementById("status").innerHTML = "Please log into this app.";
    }
  };

  window.statusChangeCallback = statusChangeCallback;

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
        document.getElementById("status").innerHTML =
          "Please log into this app.";
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

  return (
    <div>
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
