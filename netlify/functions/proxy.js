// Updated file: netlify/functions/proxy.js

// We need to install and use node-fetch for compatibility in the Netlify environment.
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const PERCHANCE_API_URL = 'https://server.perchance.org/text-to-image';

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Log the body we received from the front-end for debugging
        console.log("Received body:", event.body);

        const response = await fetch(PERCHANCE_API_URL, {
            method: 'POST',
            headers: {
                // *** THIS IS THE CRITICAL CHANGE ***
                // We are now sending a standard JSON header, which is more reliable.
                'Content-Type': 'application/json',
            },
            // event.body is already a stringified JSON, so we pass it directly.
            body: event.body, 
        });

        // Check if the response from Perchance is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perchance API Error:', errorText);
            throw new Error(`Perchance API returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Return the successful data to our front-end
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('Proxy function error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};