require("dotenv").config();

const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json());

// Function to get a list of administrators for a given page
async function getAdmins(pageId) {
  const url = `https://graph.facebook.com/v17.0/${pageId}/admins`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.REACT_APP_FACEBOOK_APP}` },
  });

  if (response.status === 200) {
    return response.data.data;
  } else {
    throw new Error(`Error getting administrators: ${response.status}`);
  }
}

// Function to make an API call to a given administrator
async function makeApiCall(adminId, endpoint) {
  const url = `https://graph.facebook.com/v17.0/${adminId}/${endpoint}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.REACT_APP_FACEBOOK_APP}` },
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(`Error making API call: ${response.status}`);
  }
}

// Route to handle the "/getFacebookData" endpoint
app.post("/getFacebookData", async (req, res) => {
  try {
    const admins = await getAdmins(req.body.page_id);
    const responseData = [];

    for (const admin of admins) {
      const response = await makeApiCall(admin.id, "posts");
      responseData.push(response);
    }

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Facebook data" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
