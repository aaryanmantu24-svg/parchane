// This function will run on Netlify's servers, not in the user's browser.
exports.handler = async function (event, context) {
    // The Perchance API endpoint we want to call
    const PERCHANCE_API_URL = 'https://server.perchance.org/text-to-image';

    // We only allow POST requests to our proxy
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        // Forward the request from our front-end to the Perchance API
        const response = await fetch(PERCHANCE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // Perchance API expects this
            },
            body: event.body, // Pass through the body from our front-end request
        });

        // Get the data from the Perchance response
        const data = await response.json();

        // Return the data to our front-end
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Proxy Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch from Perchance API' }),
        };
    }
};