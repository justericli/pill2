import React, { useEffect, useState } from "react";
import UserPool from "../User_Userpool.jsx"; // adjust the import path to where your User_Userpool.jsx file is located
import { Auth } from "aws-amplify";

const User_dashboard = () => {
  const [givenName, setGivenName] = useState("");

  useEffect(() => {
    const cognitoUser = UserPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err);
          return;
        }

        console.log("session validity: " + session.isValid());
        setGivenName(session.getIdToken().payload["given_name"]);
      });
    }
  }, []);

  // Logout function
  async function handleLogout() {
    // Clear the user's session
    await Auth.signOut({ global: true });

    if (window.FB) {
      window.FB.logout();
    }

    // Redirect the user to the login page
    window.location.href = "/User_login";
  }

  return (
    <div>
      Hi, {givenName}
      <button onClick={handleLogout}>Logout</button>{" "}
      {/* Button to trigger logout */}
    </div>
  );
};

export default User_dashboard;
