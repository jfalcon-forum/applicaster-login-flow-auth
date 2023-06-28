# applicaster-login-flow

Lambda function that handles retrieving access token, refresh tokens, and revoking refresh tokens. Utilizes email/password credentials and returns access_token and refresh_token for a given user.

To initalize local environment

AWS Lambda - applicaster-login-flow-test

AWS Gateway - applicaster-login-flow-test

`npm install`

To test locally, you'll need to comment out the export.handler function and individually run any individual function.

`node index.js`

You also will need to create a .env file that contains the AUTH_TEST_CLIENT_ID and AUTH_TEST_SECRET_ID
