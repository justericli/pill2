import "../App.css";
import User_signup from "./User_signup.jsx";
import User_login from "./User_login.jsx";
import User_Account, { AccountContext } from "./User_Account.jsx";
import User_status from "./User_status.jsx";

const user_login = () => {
  return (
    <User_Account>
      <User_status />
      <User_signup />
      <User_login />
    </User_Account>
  );
};

export default user_login;
