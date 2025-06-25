# Netatmo

1. Get an access token:
   - Log into the Netatmo website
   - Make a request to their `/getstationsdata` endpoint: https://dev.netatmo.com/apidocumentation/weather#getstationsdata
   - Copy the access token from the cURL output and the device ID from the JSON response
   - Paste the access token and device ID into the `.env` file in this directory. If the file is not there, create it using `.env.example` as a template
2. Run `./scripts/fetch.ts` to download the data
3. Run `./scripts/convert.ts` to create a CSV file
4. Done
