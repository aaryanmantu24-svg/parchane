// Updated and simplified: netlify/functions/proxy.js

exports.handler = async function (event, context) {
    const PERCHANCE_API_URL = 'https://server.perchance.org/text-to-image';

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const response = await fetch(PERCHANCE_API_URL, {
            method: 'POST',
            headers: {
                // This header is what the Perchance API expects.
                'Content-Type': 'application/json',
            },
            // event.body is the stringified JSON from our front-end. We pass it through.
            body: event.body, 
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perchance API Error:', errorText);
            throw new Error(`Perchance API returned status ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('Proxy function error:', error.message);
        return {
            statusCode: 500,
            // Return a more specific error message to the front-end
            body: JSON.stringify({ error: `Proxy Error: ${error.message}` }),
        };
    }
};