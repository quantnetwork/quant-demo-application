# Overledger Demo Server

This service complements the Demo Client providing endpoints which wrap Overledger SDK functionality.
It also exposes a Socket.io connection, which allows the client to receive live updates regarding subscribed transactions.

The endpoints are:

```GET /token``` Which returns an access token which should be used for any calls made to Overledger.
The credentials used for generating the token can be configured in the .env file.
These credentials can be obtained by creating an account on https://developer.quant.network/login

```POST /sign``` where the request body is an Overledger prepared request in json format. This endpoint will return the
signed request. NOTE: No changes to the Overledger prep call response shoud be required. Just send that response to this endpoint.

```POST /subscription-update``` This endpoint is not meant to be called directly by users. It's meant to be passed in as the
callback url for calls to the overledger webhook service when subscribing to transaction updates.

In addition to the endpoints above, this service also runs a Socket.io connection, reachable on the same port. Whenever the ```/subscription-update```
is called by overledger, the service will pass the update to any clients listening on the Socket.io connection. NOTE: The json object
sent to the client via Socket.io has the same structure as the request body for the ```/subscription-update``` endpoint. In fact
the code for that endpoint simply handles the request and passes it on to the Socket.io connector.

## Running it locally

### Prerequisites

- Node.js version 8, or later (tested upto v14.17.0)
- npm (installed with node)
- Yarn(https://classic.yarnpkg.com/en/docs/install) - A package manager that doubles as a project manager.
- Have an Overledger account (https://developer.quant.network/login), with keys for Sandbox 2.0.
- Have Address/origin and secret/private key for at least one of the technologies.


### Installing

Begin by cloning the repository.
To install the required dependencies, open a terminal window in the root directory of the project and run:

```
npm install
```

### Configure

There is a .env file which contains several fields that require configuration (they come with placeholder values, which need to be replaced for the service to work).
This information is split into two types. Credentials for OAuth, and DLT public/private keys.
You will need to replace the placeholder values for these fields,
for the first set of fields you should use the details from an Overledger Sandbox 2.0 account.
For the second set, you will need the public key (Address/origin ID) and private key for each of the supported technologies
(Ethereum, Ripple, Bitcoin).

Once the values are in place run:

```
npm install -g secure-env
```

and

```
secure-env .env -s password
```

This will secure the .env file.

### Running

To start the project run:

```
npm start
```
