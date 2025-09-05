const axios = require('axios');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        console.log('Function called with:', event.httpMethod);
        console.log('Event body:', event.body);
        
        // Parse request body
        let requestData;
        try {
            requestData = JSON.parse(event.body);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid JSON in request body',
                    details: parseError.message 
                }),
            };
        }
        
        const { url } = requestData;

        if (!url) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Image URL is required' }),
            };
        }

        console.log(`Testing URL: ${url}`);

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid URL format' }),
            };
        }

        // Simple HTTP test without image processing
        console.log('Starting simple HTTP request...');
        const response = await axios.head(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ImageVerifier/1.0)',
            },
        });

        console.log('HTTP response headers:', response.headers);

        // Get basic info from headers
        const contentLength = response.headers['content-length'];
        const contentType = response.headers['content-type'];
        
            let imageResponse;
            let dimensions = null;
            let errorMsg = null;
            try {
                // Download the image as arraybuffer
                imageResponse = await axios.get(url, {
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; ImageVerifier/1.0)',
                    },
                });
                // Use image-size to get dimensions
                const sizeOf = require('image-size');
                dimensions = sizeOf(imageResponse.data);
            } catch (imgErr) {
                errorMsg = imgErr.message;
            }

            const result = {
                url: url,
                success: !!dimensions,
                fileSize: fileSize || null,
                fileSizeKB: fileSize ? Math.round(fileSize / 1024 * 100) / 100 : null,
                contentType: contentType,
                width: dimensions ? dimensions.width : null,
                height: dimensions ? dimensions.height : null,
                type: dimensions ? dimensions.type : null,
                message: dimensions ? 'Image analysis successful.' : 'Could not analyze image.',
                note: dimensions ? undefined : errorMsg,
                httpStatus: httpStatus,
                headers: headers
            };

        console.log('Returning result:', result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
        };

    } catch (error) {
        console.error('Error testing URL:', error);
        console.error('Error stack:', error.stack);

        let errorMessage = 'Failed to test URL';
        let statusCode = 500;

        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            errorMessage = 'Could not connect to the URL. Please check if the URL is accessible.';
            statusCode = 400;
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Request timed out. The server may be slow or unreachable.';
            statusCode = 408;
        } else if (error.response?.status === 404) {
            errorMessage = 'URL not found (404). Please check the URL.';
            statusCode = 404;
        } else if (error.response?.status === 403) {
            errorMessage = 'Access forbidden (403). The URL may have access restrictions.';
            statusCode = 403;
        }

        return {
            statusCode,
            headers,
            body: JSON.stringify({
                error: errorMessage,
                details: error.message,
                code: error.code || 'UNKNOWN',
                httpStatus: error.response?.status
            }),
        };
    }
};
