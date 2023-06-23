import React, { useState } from "react";
import Userpool from "../User_Userpool.jsx";
import axios from "axios";

const User_signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [gender, setGender] = useState("");
  const [otherGender, setOtherGender] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email,
      password,
      givenName,
      familyName,
      gender,
      otherGender,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/getFacebookData",
        userData
      );
      // process the response here, you may want to navigate the user to a different page or update some state.
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="givenName">First Name</label>
        <input
          value={givenName}
          onChange={(event) => setGivenName(event.target.value)}
        />

        <label htmlFor="familyName">Last Name</label>
        <input
          value={familyName}
          onChange={(event) => setFamilyName(event.target.value)}
        />

        <label htmlFor="gender">Gender</label>
        <select
          value={gender}
          onChange={(event) => setGender(event.target.value)}
        >
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {gender === "Other" && (
          <div>
            <label htmlFor="otherGender">Please specify</label>
            <input
              value={otherGender}
              onChange={(event) => setOtherGender(event.target.value)}
            />
          </div>
        )}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default User_signup;
