# applicaster-login-flow

Lambda function that handles retrieving access token, refresh tokens, and revoking refresh tokens. Utilizes email/password credentials and returns access_token and refresh_token for a given user.

To initalize local environment

AWS Lambda - applicaster-login-flow-test

AWS Gateway - applicaster-login-flow-test

`npm install`

To test locally, comment out the export.handler function and individually run any individual function.

`node index.js`

You also will need to create a .env file that contains the `AUTH_TEST_CLIENT_ID` and `AUTH_TEST_SECRET_ID`

## Test Vs Prod

Code within index.js file is for production. To create a test version replace the following URL:

- `https://login.forumcomm.com/` -> `https://login-test.forumcomm.com`

## Setup in AWS

The code above works for any application integrated within the applicaster-integration api within Auth0.

Required Environment Variables

- AUTH_CLIENT_ID - client id from Auth0 application
- AUTH_SECRET_ID - client secret from Auth0 application

API Gateway needs to be configured with following endpoints

### /login

- POST
- payload:
  ```
  {
      "username": "example@gmail.com",
      "password": "test@123"
  }
  ```

### /refresh-token

- POST
- payload:
  ```
  {
      "refresh_token": "REFRESH_TOKEN_VALUE"
  }
  ```

### /reset-password

- POST
- payload:
  ```
  {
      “email”: “YOUR_EMAIL@EMAIL.COM”
  }
  ```
