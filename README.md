# Address Verification

The goal of this project is to validate addresses from the end client by finding if they have any geocodes associated with them. I have used NodeJS to build a standalone service for this application. It can be deployed to a hosting platform such as Heroku or you can test it locally on your machine.

## Getting Started

----------

### Prerequisites

- Node `v12.6.0`(NPM is installed with Node)

### Installing & Testing

1. Make sure `node` and `npm` is installed on the system. To check run the following commands from command prompt or shell: `node -v` & `npm -v`.

2. Run `npm install` from the directory where `package.json` is present.
This will install the required modules present in `package.json` into the project directory inside `node_modules` directory.
Make sure you also install the dev dependencies included in `package.json` specifically nodemon to run this application locally.

3. All environment variables (process.env) are loaded from the `nodemon.json` file. In the current `nodemon.json` file the following dummy values are present for different keys:  
`YOUR_DB_URL`: This must be replaced with a valid mongodb url. This will be used to establish connection to the database.  
`YOUR_GEOCODE_API_KEY` & `YOUR_GEOCODE_API_URL`: This can be obtained from https://locationiq.com/ by registering for a free account.  
`YOUR_ENCRYPTION_KEY`: This can be replaced by any string of your choice. It should be a random string as it's used for encryption/decryption. 

4. Run the application on your local machine using `npm run start:dev`. It will run on localhost:5000 as defined in your `nodemon.json` file.

5. To test the service, goto `localhost:5000/address/verify` and add the following query parameters:
`address_line_one, city, state, zip_code` along with their values.
An example,  
`localhost:5000/address/verify?address_line_one=123 test street&city=testCity&state=testState&zip_code=12345`
The service will return either return a success/error in json format.
- The success format:  
*Status Code: 200*  
`{  
  "address_line_one": "address entered",  
  "city": "city entered",  
  "state": "state entered",  
  "zip_code": "zip_code entered",  
  "latitude: "latitude returned",  
  "longitude: "longitude returned"  
 }`  
- The error format:  
*Status Code: 400/404/500/429,etc*  
`{  
	"message" : "Reason for error"  
}`

### Project Structure

- The `index.js` file on the root directory is where the application starts. This is where a connection to mongodb is established, routes are delegated and CORS (Cross-origin resource sharing) is enabled as this service will be used by external clients. 
- The `address.js` file in the routes directory is where the verification route will be served.
- The `index.js` file in the middleware directory is where the input is validated to see if it has all required parameters and valid characters.
- The `address.js` file in the controllers directory is where the logic for the address verification resides.
- The `address.js` file in the models directory is where the database schema is defined to store the queried address information.

### Implementation

1) The address/verify route is redirected to the `address.js` file in the routes directory.
2) Before the request gets processed by the controller, it is being passed to a middleware where the input is validated. 
    - If it passes validation it gets forwarded to the controller else an error is sent to the client.
3) The controller will hash the address provided by the user and check to see if it exists in the database. 
    - If it does, it decrypts the encrypted geocode (latitude, longitude) stored and returns a response. 
    - If it doesn't or if the database in unavailable, a request to the LocationIQ geocoding API is sent to get the geocode information.
    - If a geocode is found, it is sent as part of the response and finally the geocode gets encrypted and a record gets created in the database with the hashed address information and encrypted geocode information.
    - If there was an error from the api, the client receives an appropriate error message.

## Architecture
----------
![architecture-diagram](https://github.com/akshayiyer91/address-verification/blob/master/images/Architecture.png)

## Assumptions
----------
1) All query parameters are required.
2) The input structure must contain alphanumeric characters/comma/space to pass validation. (Alphanumeric characters are checked for 27 different locales) 
3) Leading and trailing spaces are trimmed while processing the request.
4) The query parameters are hashed (one way) and geocodes are encrypted before getting stored in the database, assuming these are PII (Personally identifiable information).
5) Accessing any other route in the application must return 404 with a message `Resource does not exist`.
6) If any specific address returns multiple geocodes from the API, the first one is returned as part of the response.

## Limitations
----------
Assuming the [LocationIQ](https://locationiq.com/) account registered is a free one, there are a few limitations to the geocoding API:  
- 10,000 requests per day
- 2 requests per second
- No dedicated endpoints
- Limited commercial use

## Error Structure
----------
The error structure is returned in json format:
HTTP Response Code|Description
--|--
400|Invalid Request
403|Service not enabled
403|Access restricted
404|Unable to geocode
429|Rate Limited Second
429|Rate Limited Minute
429|Rate Limited Day
500|Unknown error - Please try again after some time

## Authors
----------
Akshay Iyer