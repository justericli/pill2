import React from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const joinWaitlist = () => {
  window.location.href =
    "https://docs.google.com/forms/d/e/1FAIpQLSeajIakLYw0FjHvaEgs9OdBkj6Wj0G4ChvKnPPfHTOz-57anw/viewform?usp=sf_link";
};

const Homepage = () => {
  return (
    <>
      <GlobalStyle />
      <div
        style={{
          backgroundColor: "#92A0D3",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "white" }}>Welcome to Whero!</h1>
        <p style={{ color: "white" }}>
          Don't live alone. Whero will bring a social aspect to finding places
          to rent by connecting to your social media for roommates.
        </p>
        <p style={{ color: "white" }}>
          Join our waiting list to find out when Whero comes to your city.
        </p>
        <button
          style={{
            backgroundColor: "#fff",
            color: "#92A0D3",
            fontSize: "16px",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
            marginTop: "20px",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#92A0D3";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#92A0D3";
          }}
          onClick={joinWaitlist}
        >
          Join Our Waitlist
        </button>
      </div>
    </>
  );
};

export default Homepage;

{
  /* <Link to="/User_login">
        <button>User Login</button>
      </Link>
      <Link to="/Landlord_login">
        <button>Landlord Login</button>
      </Link>
      <Link to="/Testing">
        <button>Testing</button>
      </Link> */
}
{
  /* </div> */
}
