import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const UserNameDisplay = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const nameAttr = user.attributes.name;
        setUserName(nameAttr);
      } catch (error) {
        console.error("Error getting user name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div>
      {userName ? <p>User name: {userName}</p> : <p>Loading user name...</p>}
    </div>
  );
};

export default UserNameDisplay;
