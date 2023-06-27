import React, { createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const AccountContext = createContext();

const User_Account = (props) => {
  const { children } = props;
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log("Authenticated: ", authenticated);
  }, [authenticated]);

  const getSession = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUserName(user.username);
      return user.signInUserSession;
    } catch (err) {
      console.error(err);
    }
  };

  const authenticate = async (Username, Password) => {
    try {
      const user = await Auth.signIn(Username, Password);
      return user;
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    try {
      Auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        getSession,
        logout,
        authenticated,
        setAuthenticated,
        userName, // Provide the username through context
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default User_Account;
export { AccountContext };
