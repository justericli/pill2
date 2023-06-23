import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div>
      <Link to="/User_login">
        <button>User Login</button>
      </Link>
      <Link to="/Landlord_login">
        <button>Landlord Login</button>
      </Link>
      <Link to="/Testing">
        <button>Testing</button>
      </Link>
    </div>
  );
};

export default Homepage;
