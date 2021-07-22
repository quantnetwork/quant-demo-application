# Overledger Demo Application

This is the official Overledger Demo Application which showcases Overledger’s API v2.0.

This README file and the ones on the client and server folders contain instructions on how to install, configure and run the Demo application. In this folder you can also find an mp4 instructional video.

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

## Subscribing to transaction updates - Port Forwarding

To subscribe to transaction updates from Overledger, which is one of the features of the demo app, you will need to expose the server port (default 8081)
to the outside world so that Overledger might reach it.

By default, some ports are blocked on modern-day routers. 
This is a great security feature because malicious requests are prevented from reaching the core processes that may be running on your computer.
However, at the same time, this can also result in problems for applications that need information sent back to them from the Internet – the router will block them.
The Demo application requires port 8081 of the server to be opened to receive updates from Overledger.
To open a port, you need to open a configuration page on the router:

Open your web browser and type the router’s address in the address bar.
To find your router’s address, check the router information or your computer’s network settings.
Type in your username and password if required.
The exact process on port forwarding can be different depending on the make and model of router.
Refer to the router’s documentation on how to set this up.
Once you have successfully set up port forwarding on your router,
the next thing to consider is also checking the firewall settings of your computer, to make sure the port connection is allowed.
