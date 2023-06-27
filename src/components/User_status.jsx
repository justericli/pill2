import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./User_Account.jsx";

const User_status = () => {
  const [status, setStatus] = useState(false);
  const { getSession, logout, authenticated } = useContext(AccountContext);

  useEffect(() => {
    getSession().then((session) => {
      console.log("Session: ", session);
      setStatus(session ? true : false);
    });
  }, []);

  return (
    <div style={{ fontSize: "24px" }}>
      {status && authenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        "Please login"
      )}{" "}
    </div>
  );
};
export default User_status;
