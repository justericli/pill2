import React, { useState } from "react";
import {
  Auth,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

const User_signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [gender, setGender] = useState("");
  const [otherGender, setOtherGender] = useState("");

  const UserPoolId = "us-east-1_zBOyMr7hs";
  const ClientId = "474p9bsq38phlbsk6rq0rak8d1";

  const userPool = new CognitoUserPool({
    UserPoolId,
    ClientId,
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const attributes = [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "given_name",
          Value: givenName,
        },
        {
          Name: "family_name",
          Value: familyName,
        },
        {
          Name: "gender",
          Value: gender === "Other" ? otherGender : gender,
        },
      ];

      userPool.signUp(email, password, attributes, null, (err, result) => {
        if (err) {
          console.error("Error signing up:", err);
          // Handle the error, e.g., display an error message to the user
        } else {
          console.log("Successfully signed up:", result);
          // Handle the successful signup, e.g., redirect to a confirmation page
        }
      });
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="givenName">First Name</label>
        <input
          id="givenName"
          value={givenName}
          onChange={(event) => setGivenName(event.target.value)}
        />

        <label htmlFor="familyName">Last Name</label>
        <input
          id="familyName"
          value={familyName}
          onChange={(event) => setFamilyName(event.target.value)}
        />

        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
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
              id="otherGender"
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
