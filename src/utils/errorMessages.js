export const ERROR_MESSAGES = {
    INVALID_ENDPOINT: "No valid endpoint found in the cURL command.",
    MISSING_AUTH: "Missing 'Authorization' header.",
    INVALID_AUTH: "Authorization header must start with 'Token' or 'Bearer'",
    INVALID_CONTENT_TYPE: "Content-Type must be 'application/json' for POST requests",
    INVALID_REGION: "Invalid region format. Please check the supported regions list.",
    RATE_LIMIT: "Rate limit exceeded. Please try again later.",
    NETWORK_ERROR: "Network error occurred while making the request."
};

export const FIX_SUGGESTIONS = {
    ENDPOINT: "Use a valid Crustdata endpoint such as https://api.crustdata.com/screener/company",
    AUTH: "Add: -H 'Authorization: Token YOUR_API_TOKEN' or 'Bearer YOUR_API_KEY'",
    CONTENT_TYPE: "Add: -H 'Content-Type: application/json'",
    REGION: "Check supported regions at: https://crustdata-docs-region-ison.s3.us-east-2.amazonaws.com/updated_regions.json"
};
