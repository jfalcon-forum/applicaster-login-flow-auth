const axios = require("axios").default;
const jwt_decode = require("jwt-decode");
require("dotenv").config();

// Call that logs the user into Auth0 and gets user ID
const getAccessToken = async (email, password) => {
  let options = {
    method: "POST",
    url: "https://login.forumcomm.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "password",
      username: email,
      password: password,
      audience: "https://applicaster-integration",
      scope: "offline_access",
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_SECRET_ID,
    }),
  };

  const response = await axios
    .request(options)
    .then(function (response) {
      // Return a confirmation message or chain naviga call.
      return {
        status: 200,
        ...response.data,
      };
    })
    .catch(function (error) {
      if (error.response) {
        return {
          status: 403,
          formError: error.response.data.error_description,
        };
      } else {
        console.log("Error", error.message);
      }
    });

  return await response;
};

// Gets new refresh token and access token
const getRefreshAccessToken = async (token) => {
  var options = {
    method: "POST",
    url: "https://login.forumcomm.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_SECRET_ID,
      refresh_token: token,
    }),
  };

  const response = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        ...response.data,
      };
    })
    .catch(function (error) {
      if (error.response) {
        return {
          status: 403,
          formError: error.response.data.error_description,
        };
      } else {
        console.log("Error", error.message);
      }
    });

  return await response;
};

// Used to revoke a given token
const revokeRefreshToken = async (token) => {
  var options = {
    method: "POST",
    url: "https://login.forumcomm.com/oauth/revoke",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_SECRET_ID,
      token: token,
    }),
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error.response.data);
    });
};

// Reset Password
const resetPassword = async (email) => {
  let options = {
    method: "POST",
    url: "https://login.forumcomm.com/dbconnections/change_password",
    headers: { "content-type": "application/json" },
    data: {
      client_id: process.env.AUTH_CLIENT_ID,
      email: email,
      connection: "Username-Password-Authentication",
    },
  };

  const response = axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        message: response.data,
      };
    })
    .catch(function (error) {
      if (error.response) {
        return {
          status: 403,
          formError: error.response.data.error_description,
        };
      } else {
        console.log("Error", error.message);
      }
    });

  return await response;
};

exports.handler = async (event, context, callback) => {
  if (event.context === undefined) {
    return {
      status: 403,
      formError: "body needs to be sent as json",
    };
  }
  if (event.context["resource-path"] === "/refresh-token") {
    if (event.body.refresh_token.length < 1) {
      return {
        status: 403,
        formError: "Invalid refresh token",
      };
    }
    const response = await getRefreshAccessToken(event.body.refresh_token);
    return response;
  } else if (event.context["resource-path"] === "/login") {
    if (event.body.email.length < 1 && event.body.password.length < 1) {
      return {
        status: 403,
        formError: "Invalid username or password",
      };
    }
    const response = await getAccessToken(
      event.body.email,
      event.body.password
    );
    return response;
  } else if (event.context["resource-path"] === "/reset-password") {
    if (event.body.email.length < 1) {
      return {
        status: 403,
        formError: "Invalid email",
      };
    }
    const response = await resetPassword(event.body.email);
    return response;
  } else {
    return {
      status: 400,
      message: "Invalid path",
    };
  }
};
