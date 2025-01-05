// src/utils/apiValidator.js
import { API_CONFIG } from './apiConfig';

/**
 * Validate a cURL command for Crustdata's API:
 *  - URL must start with API_CONFIG.baseUrl
 *  - Must have 'Authorization' header with either Token or Bearer
 *  - If --data/-d is present, parse as JSON -> POST request
 */
export const validateCurlCommand = (curlCommand) => {
    const errors = [];
    const fixes = [];

    // Must start with curl
    if (!curlCommand.toLowerCase().startsWith('curl')) {
        return null; // We'll just say not recognized
    }

    // Extract URL
    const urlMatch = curlCommand.match(/https:\/\/[^\s'"]+/);
    const url = urlMatch ? urlMatch[0] : '';

    // Validate endpoint
    if (!url.startsWith(API_CONFIG.baseUrl)) {
        errors.push('Invalid API endpoint');
        fixes.push(`Use ${API_CONFIG.baseUrl} as the base URL`);
    }

    // Check for Authorization header
    // Accepts either -H or --header, "Token" or "Bearer"
    const authMatch = curlCommand.match(
        /(?:-H|--header)\s+['"]Authorization:\s*(Token|Bearer)\s+([^'"]+)['"]/
    );
    if (!authMatch) {
        errors.push("Missing or invalid 'Authorization' header");
        // By docs, "Bearer" is recommended
        fixes.push("Add header: --header 'Authorization: Bearer YOUR_API_TOKEN'");
    }

    // Attempt to parse body if user has data
    let parsedBody = null;
    let method = 'GET';
    const dataPattern = /(?:--data|-d)(?:=|\s+)'+([^']+)'/;
    const dataMatch = curlCommand.match(dataPattern);

    if (dataMatch) {
        method = 'POST';
        try {
            parsedBody = JSON.parse(dataMatch[1]);
        } catch (e) {
            errors.push("Unable to parse JSON from --data. Check if it's valid JSON.");
            fixes.push("Verify the JSON structure in your --data block.");
        }
    }

    if (errors.length > 0) {
        return {
            valid: false,
            errors,
            fixes
        };
    }

    // Auth scheme + token
    const authScheme = authMatch[1]; // "Token" or "Bearer"
    const authToken = authMatch[2];

    return {
        valid: true,
        errors,
        fixes,
        parsedRequest: {
            url,
            method,
            headers: {
                Authorization: `${authScheme} ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: parsedBody
        }
    };
};

/**
 * Send the parsed request to the Crustdata API. Checks for region errors too.
 */
export const sendRequest = async (parsedRequest) => {
    try {
        const fetchOptions = {
            method: parsedRequest.method,
            headers: {
                'Content-Type': 'application/json',
                ...parsedRequest.headers
            }
        };

        if (parsedRequest.method === 'POST' && parsedRequest.body) {
            fetchOptions.body = JSON.stringify(parsedRequest.body);
        }

        const response = await fetch(parsedRequest.url, fetchOptions);
        const data = await response.json();

        if (!response.ok) {
            // region-based 422 error
            if (
                response.status === 422 &&
                data.non_field_errors?.[0]?.includes('No mapping found for REGION')
            ) {
                return {
                    success: false,
                    statusCode: response.status,
                    logs:
                        'Invalid region format. Check the official region list:\n' +
                        'https://crustdata-docs-region-ison.s3.us-east-2.amazonaws.com/updated_regions.json'
                };
            }
            // generic API error
            return {
                success: false,
                statusCode: response.status,
                logs: `API Error: ${JSON.stringify(data)}`
            };
        }

        // Successful response
        return {
            success: true,
            statusCode: response.status,
            data
        };
    } catch (err) {
        return {
            success: false,
            statusCode: 500,
            logs: `Network error: ${err.message}`
        };
    }
};
