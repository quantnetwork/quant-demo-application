# Overledger Demo Application

This is the official Overledger Demo Application which showcases Overledger’s API v2.0.

## Requirements

- Have an Overledger Developer Portal account (https://developer.quant.network/login).
- Have Address/origin and secret/private key in Testnet for at least one of the technologies (Ethereum, Bitcoin, XRP Ledger).
- Check the individual projects' README files for additional technical requirements.

## Projects

In this project you can find both the client and the server repositories.

All you have to do is clone this repo and follow the instructions of the README files located inside the individual projects.

The server repository is located inside the "/server" folder.
The client repository is located inside the "/client" folder.

It is recommended to first set up and run the server and then set up and run the client.

## Generating an OAuth 2.0 token

In order to be able to use the Demo App you need to generate an OAuth 2.0 token.

This can be done by following the next steps:

1. Inside the /server folder go to the .env file and update the following fields with your generated clientId and clientSecret (from the Overledger Developer Portal)
   as well as the username and password that you used to log-in to the Overledger Developer Portal.
   ```
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    USER_NAME=your_user_name
    PASSWORD=your_password
    ```
2. Follow the instructions on how to start the server part of the demo app
   and when it is up and running you can use the command line to generate a token, using the following command:

   ```curl http://localhost:8081/token```

   Note: You need to change the above port (8081) if the app has been started in a different port than the default.


3. Copy the token that has been generated and use it in the Demo App when prompted.
