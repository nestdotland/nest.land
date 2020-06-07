## Client-Side API
This API folder is dedicated to the client-side API. Because our registry API is not public, as of now, these serverless functions interface with our server-side API. In a future milestone, these functions will be converted to Deno.

### Functions:

```
https://nest.land/api/captcha
```
This function makes a request using Google's reCAPTCHA service. The user must pass this in order to generate an API key to publish a package with the CLI.

```
https://nest.land/api/key
```
This function interfaces with our server-side API in order to return a new API key to the client for use in the CLI.

```
https://nest.land/api/packages
```
This function utilizes the server-side API to return a JSON object with all of the packages to the user.