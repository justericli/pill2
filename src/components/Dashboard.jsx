import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AccountContext } from "./Account";
import { Auth } from "aws-amplify";
import UserNameDisplay from "./UserNameDisplay";
import ImageUpload from "./Forms/ListingForm.jsx";

const Dashboard = () => {
  const { getSession } = useContext(AccountContext);
  const [authenticated, setAuthenticated] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getSession()
      .then(() => {
        console.log("User is authenticated");
        setAuthenticated(true);
      })
      .catch(() => {
        console.log("User is not authenticated");
        setAuthenticated(false);
      });
  }, [getSession]);

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

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await Auth.signOut();
    setAuthenticated(false);
    setUserName("");
    // Redirect to the login page
    const navigateToLogin = () => {
      return <Navigate to="/Landlord_login.jsx" />;
    };

    return navigateToLogin();
  };

  return (
    <>
      {authenticated ? (
        <>
          <div>
            Welcome to your dashboard, <UserNameDisplay />
          </div>
          <ImageUpload />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Navigate to="/Landlord_login" />
      )}
    </>
  );
};

export default Dashboard;
