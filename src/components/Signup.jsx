import React, { useState } from "react";
import UserPool from "../Userpool.js";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    // Convert phone number to desired format
    const formattedPhoneNumber = `+1${phoneNumber}`;

    const attributes = [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "family_name",
        Value: familyName,
      },
      {
        Name: "website",
        Value: website,
      },
      {
        Name: "phone_number",
        Value: formattedPhoneNumber,
      },
      {
        Name: "name",
        Value: name,
      },
    ];

    UserPool.signUp(email, password, attributes, null, (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log(data);
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          name="name"
        ></input>
        <label htmlFor="familyName">Family Name</label>
        <input
          value={familyName}
          onChange={(event) => setFamilyName(event.target.value)}
        ></input>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>

        <label htmlFor="website">Website</label>
        <input
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        ></input>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        ></input>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
