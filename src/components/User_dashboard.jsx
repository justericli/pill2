import React, { useEffect, useState } from "react";
import UserPool from "../User_Userpool.jsx"; // adjust the import path to where your User_Userpool.jsx file is located
import { Auth } from "aws-amplify";
import "./User_dashboard.css";

const User_dashboard = () => {
  const [givenName, setGivenName] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const userPoolUsers = await UserPool.listUsers(); // Adjust the method according to your UserPool API
      setUsers(userPoolUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
  }

  useEffect(() => {
    fetchUsers();
    // Get DOM elements
    const addFriendsButton = document.getElementById("addFriendsButton");
    const modal = document.getElementById("modal");
    const closeModalButton = document.getElementById("closeModalButton");

    // Event listener for "Add Friends" button click
    addFriendsButton.addEventListener("click", () => {
      modal.style.display = "block";
    });

    // Event listener for "Close" button click
    closeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }, []);

  return (
    <div>
      <div>
        Hi, {givenName}
        <button onClick={handleLogout}>Logout</button>{" "}
        {/* Button to trigger logout */}
      </div>
      <button id="addFriendsButton">Add Friends</button>

      <div id="modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add Friends</h2>
          </div>
          <div className="modal-body">
            <div id="recommendedFriendsSection">
              <h3>Recommended Friends</h3>
              {/* Place recommended friends here */}
            </div>
            <div id="friendsSection">
              <h3>Friends</h3>
              {/* Place friends here */}
            </div>
          </div>
          <div className="modal-footer">
            <button id="closeModalButton">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_dashboard;
