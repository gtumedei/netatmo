# Netatmo

1. Get an access token:
   - Log into the Netatmo website
   - Make a random API request from their UI https://dev.netatmo.com/apidocumentation/aircare
   - Copy the access token from the cURL output into the `.env` file in this directory
2. Run `scripts/fetch.ts` to download the data
3. Run `scripts/convert.ts` to create a CSV file
4. Done
